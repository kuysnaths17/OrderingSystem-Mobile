import { StyleSheet, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import Header from '@/components/header';
import axios from 'axios';
import { fetchItemByCategory } from '@/constants/API';
import { Text, View } from 'react-native-animatable';
import { useNavigation } from 'expo-router';
import { Link } from 'expo-router';

const categs = [
    { id: '1', catName: 'Main Course', catVal: 'main_course' },
    { id: '2', catName: 'Appertizer', catVal: 'appetizer' },
    { id: '3', catName: 'Dessert', catVal: 'dessert' },
    { id: '4', catName: 'Beverages', catVal: 'beverages' }
]

const items = () => {
    const nav = useNavigation();
    
    return (
        <View>
            <Header />
            <View className='relative'>
                <View className='relative py-10 bg-[#f4f9ff]'>
                    <Text className='text-4xl font-bold text-gray-900 text-center' animation={'tada'}>Categories</Text>
                </View>
                <View className='relative flex-row flex-wrap justify-between p-[15] pt-16 gap-10'>
                    {categs.map((item, index) => (
                        <Link key={index} className='w-[45%] h-[14rem] bg-slate-200 p-2 rounded-lg' href={{pathname:'/(hometabs)/(previewitem)', params:{category:item.catVal, categoryTitle: item.catName}}}>
                            <View className='w-[100%] h-[80%] bg-slate-700 rounded-lg' animation={''}>

                            </View>
                            <View>
                                <Text className='flex text-2xl font-bold text-gray-900 text-center mt-2'>{item.catName}</Text>
                            </View>
                        </Link>
                    ))}
                </View>
            </View>
        </View>
    )
}

export default items
