import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import Header from '@/components/header';
import axios from 'axios';
import { fetchItemByCategory } from '@/constants/API';

const categs = [
    {id:'1', catName: 'Main Course', catVal: 'main_course'},
    {id:'2', catName: 'Appertizer', catVal: 'appetizer'},
    {id:'3', catName: 'Dessert', catVal: 'dessert'},
    {id:'4', catName: 'Beverages', catVal: 'beverages'}
]

const items = () => {
    const handleOrderPicked = async (catVal) => {
        console.log(catVal)
        try {
            const res = await axios.get(`${fetchItemByCategory}/${catVal}`);
            console.log(res.data)
        } catch (error) {
            console.log(error)
        }
    }
    return (
        <View>
            <Header />
            <View className='relative'>
                <View className=''>
                    <Text className='text-4xl font-bold text-gray-900 text-center py-14 bg-[#f4f9ff]'>Categories</Text>
                </View>
                <View className='flex-row flex-wrap justify-between p-[15] pt-10 gap-10'>
                    {categs.map((item, index) => (
                        <TouchableOpacity key={index} className='w-[45%] h-[14rem] bg-slate-200 p-2 rounded-lg ' onPress={() => handleOrderPicked(item.catVal)}>
                            <View className='w-[100%] h-[80%] bg-slate-700 rounded-lg'>
                                
                            </View>
                            <View>
                                <Text className='text-2xl font-bold text-gray-900 text-center mt-2'>{item.catName}</Text>
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>
        </View>
    )
}

export default items
