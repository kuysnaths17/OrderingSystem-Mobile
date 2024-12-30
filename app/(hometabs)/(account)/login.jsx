import { View, Text, TextInput, TouchableOpacity } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native';

const login = () => {
    const nav = useNavigation();
    return (
        <View className='flex-1 items-center'>
            <View className='justify-center items-center mt-20 w-[100%]'>
                <Text className='text-6xl font-extrabold text-[#368EEF] my-10'>Login Here</Text>
                <Text className='text-3xl font-semibold text-gray-900 text-center text-wrap w-[75%] my-5'>Welcome back! Please login to your account.</Text>
            </View>     
            <View className='flex flex-col w-[90%]'>
                <View className='flex flex-col my-5'>
                    <TextInput className='w-full h-[4.5rem] border-2 border-gray-300 rounded-xl px-3 py-1' placeholder='Username' keyboardType='default'/>
                </View>
                <View className='flex flex-col my-5'>
                    <TextInput className='w-full h-[4.5rem] border-2 border-gray-300 rounded-xl px-3 py-1' placeholder='Password' keyboardType='visible-password'/>
                </View>
                <View className='flex justify-end items-end'>
                    <TouchableOpacity >
                        <Text className='text-xl font-semibold text-[#368EEF]'>Forgot Password?</Text>
                    </TouchableOpacity>
                </View>
                <View className='flex justify-center items-center mt-5'>
                    <TouchableOpacity className='w-[100%] h-[4rem] bg-[#368eef] rounded-xl justify-center items-center'>
                        <Text className='text-2xl font-semibold text-white'>Sign in</Text>
                    </TouchableOpacity>
                </View>
                <View className='flex justify-center items-center mt-10'>
                    <TouchableOpacity className='justify-center items-center' onPress={() => nav.navigate('register')}>
                        <Text className='text-2xl font-semibold text-slate-500'>Create Account</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}

export default login