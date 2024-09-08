import { useEffect, useState } from 'react';

type fnType = () => void;

const useAppWrite = (fn: fnType) => {
	const [data, setData] = useState([]);
	const [isLoading, setIsLoading] = useState(true);

	const fetchData = async () => {
		setIsLoading(true);
		try {
			const res = await fn();
			setData(res);
		} catch (error) {
			// Alert.alert('Error', (error as Error).message);
			console.log(`FETCH DATA ERROR: ${error}`);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		fetchData();
	}, []);

	const refetch = () => fetchData();

	return { data, isLoading, refetch };
};

export default useAppWrite;
