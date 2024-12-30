import React, { useEffect, useState, useRef } from 'react';
import { View, Text, TouchableOpacity, Image, BackHandler, Alert } from 'react-native'
import { useNavigation } from '@react-navigation/native';



const index = () => {
  const nav = useNavigation();
  
  return (
    <View className='flex-1 relative'>
      <View className='justify-center items-center mt-20'>
        <Image source={require('@/assets/images/pgtLOGO.png')} className='w-[90%] h-[25rem]' />
      </View>
      <View>
        <View className='justify-center items-center mt-5'>
          <Text className='text-5xl font-bold text-gray-900 mb-6'>Welcome to Prethegem</Text>
          <Text className='text-xl font-semibold text-gray-900 text-center w-[85%]'>Hungry? Prethegem has you covered! Get ready for a taste adventure. We offer a wide selection of delicious dishes to satisfy every craving.</Text>
        </View>
      </View>
      <View className='absolute bottom-16 w-full'>
        <View className='flex flex-row justify-center items-center mt-5 gap-3'>
          <TouchableOpacity className='w-[40%] h-[4rem] bg-[#368eef] rounded-xl justify-center items-center' onPress={() => nav.navigate('login')}>
            <Text className='text-2xl font-semibold text-white'>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity className={`w-[40%] h-[4rem] rounded-xl justify-center items-center border-[#368eef] border-hairline`} onPress={() => nav.navigate('register')}>
            <Text className='text-2xl font-semibold text-black'>Register</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}

export default index