import { StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native'
const { width, height } = Dimensions.get('window');
import React, { useEffect, useState } from 'react'
import Header from '@/components/header';
import axios from 'axios';
import { fetchItemByCategory } from '@/constants/API';
import { Text, View } from 'react-native-animatable';
import { useNavigation } from 'expo-router';
import { Link } from 'expo-router';
import { getUser, deleteUser, checkLoggedIn } from '@/constants/storageUtils';

import maincourse from '@/assets/images/maincourse.jpg';
import appetizer from '@/assets/images/appetizer.jpg';
import dessert from '@/assets/images/dessert.png';
import beverages from '@/assets/images/beverages.png';
import { useMMKVBoolean } from 'react-native-mmkv';

const categs = [
    { id: '1', catName: 'Main Course', catVal: 'main_course', img: maincourse },
    { id: '2', catName: 'Appetizer', catVal: 'appetizer', img: appetizer },
    { id: '3', catName: 'Dessert', catVal: 'dessert', img: dessert },
    { id: '4', catName: 'Beverages', catVal: 'beverages', img: beverages },
]

const index = () => {
    const nav = useNavigation();
    const [isLoggedIn, setIsLoggedIn] = useMMKVBoolean('isLoggedIn');

    return (
        <View className='flex-1'>
            <Header />
            <View className='relative'>
                <View className='relative py-8 bg-[#f4f9ff]'>
                    <Text className='text-4xl font-bold text-gray-900 text-center' animation={'tada'}>Categories</Text>
                </View>
                <View className='flex flex-row flex-wrap justify-evenly p-[15] pt-16 gap-10'>
                    {categs.map((item, index) => (
                        <Link key={index} style={{width: width*0.4, height: height*0.25}} className=' bg-[#a8c2f9] p-2 rounded-lg' href={{ pathname: '/(hometabs)/(previewitem)', params: { category: item.catVal, categoryTitle: item.catName } }}>
                            <View className='w-[100%] h-[100%]'>
                                <View className='w-[100%] h-[80%] bg-[#7c91bc] rounded-lg'>
                                    <Image source={item.img} className='w-full h-full rounded-lg' />
                                </View>
                                <View>
                                    <Text className='text-2xl font-bold text-gray-900 text-center mt-2'>{item.catName}</Text>
                                </View>
                            </View>
                        </Link>
                    ))}
                </View>
            </View>
        </View>
    )
}

export default index
