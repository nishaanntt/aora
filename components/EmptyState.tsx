import { Image, Text, View } from 'react-native';

import CustomButton from './CustomButton';
import React from 'react';
import { images } from '@/constants';
import { router } from 'expo-router';

interface EmptyStateProps {
	title: string;
	subtitle: string;
}

const EmptyState = ({ title, subtitle }: EmptyStateProps) => {
	return (
		<View className='justify-center items-center px-4'>
			<Image
				source={images.empty}
				resizeMode='contain'
				className='w-[270px] h-[215px]'
			/>

			<Text className='text-xl font-psemibold text-white mt-2'>{title}</Text>
			<Text className='font-pmedium text-sm text-gray-100'>{subtitle}</Text>

			<CustomButton
				title='Create Video'
				handlePress={() => router.push('/create')}
				containerStyles='w-full my-5'
			/>
		</View>
	);
};

export default EmptyState;
