import {
	Account,
	Avatars,
	Client,
	Databases,
	ID,
	Query,
	Storage,
} from 'react-native-appwrite';

export const config = {
	endpoint: 'https://cloud.appwrite.io/v1',
	platform: 'com.nishaanntt.aora',
	projectId: '66cbefed002db83f4150',
	databaseId: '66cbf104003d0275bdb6',
	userCollectionId: '66cbf12d002e0b463591',
	videoCollectionId: '66cbf1490007b927f492',
	storageId: '66cbf85e002b5180bde2',
};

const {
	endpoint,
	platform,
	projectId,
	databaseId,
	userCollectionId,
	videoCollectionId,
	storageId,
} = config;

// Init your React Native SDK
const client = new Client();

client.setEndpoint(endpoint).setProject(projectId).setPlatform(platform);

const account = new Account(client);
const avatars = new Avatars(client);
const databases = new Databases(client);
const storage = new Storage(client);

// Register User
export const createUser = async (
	email: string,
	password: string,
	username: string
) => {
	try {
		const newAccount = await account.create(
			ID.unique(),
			email,
			password,
			username
		);

		if (!newAccount) throw Error;

		const avatarUrl = avatars.getInitials(username);

		await signIn(email, password);

		const newUser = await databases.createDocument(
			databaseId,
			userCollectionId,
			ID.unique(),
			{ accountId: newAccount.$id, email, username, avatar: avatarUrl }
		);

		return newUser;
	} catch (error) {
		console.log(error);
		throw new Error((error as Error).message || String(error));
	}
};

export const signIn = async (email: string, password: string) => {
	try {
		const session = await account.createEmailPasswordSession(email, password);
		console.log('SIGNED IN');
		return session;
	} catch (error) {
		throw new Error((error as Error).message || String(error));
	}
};

export const getCurrentUser = async () => {
	try {
		const currentAccount = await account.get();

		if (!currentAccount) throw Error;

		const currentUser = await databases.listDocuments(
			databaseId,
			userCollectionId,
			[Query.equal('accountId', currentAccount.$id)]
		);

		if (!currentUser) throw Error;

		return currentUser.documents[0];
	} catch (error) {
		console.log(error);
	}
};

export const getAllPosts = async () => {
	try {
		const posts = await databases.listDocuments(databaseId, videoCollectionId, [
			Query.orderDesc('$createdAt'),
		]);

		return posts.documents;
	} catch (error) {
		throw new Error((error as Error).message);
	}
};

export const getLatestPosts = async () => {
	try {
		const posts = await databases.listDocuments(databaseId, videoCollectionId, [
			Query.orderDesc('$createdAt', Query.limit(7)),
		]);

		return posts.documents;
	} catch (error) {
		throw new Error((error as Error).message);
	}
};

export const searchPosts = async (query: string | string[]) => {
	try {
		const posts = await databases.listDocuments(databaseId, videoCollectionId, [
			Query.search('title', query),
		]);

		return posts.documents;
	} catch (error) {
		throw new Error((error as Error).message);
	}
};

export const getUserPosts = async (userId: string) => {
	try {
		const posts = await databases.listDocuments(databaseId, videoCollectionId, [
			Query.equal('creator', userId),
			Query.orderDesc('$createdAt'),
		]);

		return posts.documents;
	} catch (error) {
		throw new Error((error as Error).message);
	}
};

export const signOut = async () => {
	try {
		const session = await account.deleteSession('current');

		return session;
	} catch (error) {
		throw new Error((error as Error).message);
	}
};

export const getFilePreview = async (fileID, type) => {
	let fileUrl;

	try {
		if (type === 'video') {
			fileUrl = storage.getFileView(storageId, fileID);
		} else if (type === 'image') {
			fileUrl = storage.getFilePreview(
				storageId,
				fileID,
				2000,
				2000,
				'top',
				100
			);
		} else {
			throw new Error('Invalid File Type');
		}

		if (!fileUrl) throw Error;

		return fileUrl;
	} catch (error) {
		throw new Error((error as Error).message);
	}
};

export const uploadFile = async (file, type) => {
	if (!file) return;

	const asset = {
		name: file.fileName,
		type: file.mimeType,
		size: file.fileSize,
		uri: file.uri,
	};

	try {
		const uploadedFile = await storage.createFile(
			storageId,
			ID.unique(),
			asset
		);

		const fileUrl = await getFilePreview(uploadedFile.$id, type);

		return fileUrl;
	} catch (error) {
		throw new Error((error as Error).message);
	}
};

export const createVideo = async form => {
	try {
		const [thumbnailUrl, videoUrl] = await Promise.all([
			uploadFile(form.thumbnail, 'image'),
			uploadFile(form.video, 'video'),
		]);

		const newPost = await databases.createDocument(
			databaseId,
			videoCollectionId,
			ID.unique(),
			{
				title: form.title,
				thumbnail: thumbnailUrl,
				video: videoUrl,
				prompt: form.prompt,
				creator: form.userId,
			}
		);

		return newPost;
	} catch (error) {
		throw new Error((error as Error).message);
	}
};
