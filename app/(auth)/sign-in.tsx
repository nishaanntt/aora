import { Alert, Image, ScrollView, Text, View } from 'react-native';
import { Link, router } from 'expo-router';
import { getCurrentUser, signIn } from '@/lib/appwrite';

import CustomButton from '@/components/CustomButton';
import FormField from '@/components/FormField';
import { SafeAreaView } from 'react-native-safe-area-context';
import { images } from '@/constants';
import { useGlobalContext } from '@/context/GlobalProvider';
import { useState } from 'react';

const SignIn = () => {
	const [form, setForm] = useState({
		email: '',
		password: '',
	});

	const [submitting, setSubmitting] = useState(false);

	const { setUser, setIsLoggedIn } = useGlobalContext();

	const submit = async () => {
		if (form.email === '' || form.password === '') {
			Alert.alert('Error', 'Please fill in all the fields.');
		}

		setSubmitting(true);

		try {
			await signIn(form.email, form.password);
			const result = await getCurrentUser();
			setUser(result);
			setIsLoggedIn(true);
			router.replace('/home');
		} catch (error) {
			console.log('SIGN IN ERROR: ', error);
		} finally {
			setSubmitting(false);
		}
	};

	return (
		<SafeAreaView className='bg-primary h-full'>
			<ScrollView>
				<View className='w-full justify-center min-h-[80vh] px-4 my-6'>
					<Image
						source={images.logo}
						resizeMode='contain'
						className='w-[115px] h-[35px]'
					/>

					<Text className='text-2xl text-white mt-10 font-psemibold'>
						Log in to Aora
					</Text>

					<FormField
						title='Email'
						value={form.email}
						handleChangeText={e => setForm({ ...form, email: e })}
						otherStyles='mt-7'
						keyboardType='email-address'
					/>

					<FormField
						title='Password'
						value={form.password}
						handleChangeText={e => setForm({ ...form, password: e })}
						otherStyles='mt-7'
					/>

					<CustomButton
						title='Sign In'
						handlePress={submit}
						containerStyles='mt-7'
						isLoading={submitting}
					/>

					<View className='justify-center pt-5 flex-row gap-2'>
						<Text className='text-lg text-gray-100 font-pregular'>
							Don't have an account?
						</Text>
						<Link
							href='/sign-up'
							className='text-lg font-psemibold text-secondary'>
							Sign Up
						</Link>
					</View>
				</View>
			</ScrollView>
		</SafeAreaView>
	);
};

export default SignIn;
