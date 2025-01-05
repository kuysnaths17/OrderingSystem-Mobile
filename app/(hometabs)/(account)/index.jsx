import React, { useEffect, useState, useRef } from 'react';
import { View, Text, TouchableOpacity, Image, BackHandler, Alert, Dimensions } from 'react-native'
const { width, height } = Dimensions.get('window');
import { useNavigation } from '@react-navigation/native';
import { useMMKVBoolean } from 'react-native-mmkv';
import { deleteUser, setLoggedIn, storage } from '@/constants/storageUtils';

const index = () => {
  const nav = useNavigation();
  const [isloggedin, setIsloggedin] = useMMKVBoolean('isLoggedIn');


  const logout = async () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "OK",
          onPress: () => {
            setIsloggedin(false);
            deleteUser();
            nav.jumpTo('index');
          }
        }
      ]
    );
  }

  const handleLOGOUT = () => {
    logout();
  }

  return (
    <View className='flex-1 relative'>
      <View className='justify-center items-center mt-20'>
        <Image source={require('@/assets/images/ptgLOGO.png')} style={{height: height*0.35, width: width*0.75}} className='w-[90%] h-[25rem]' />
      </View>
      <View>
        <View className='justify-center items-center mt-8'>
          <Text className='text-4xl font-bold text-gray-900 mb-3'>Welcome to Prethegem</Text>
          <Text className='text-xl font-semibold text-gray-900 text-center' style={{width: width*0.85 }}>Hungry? Prethegem has you covered! Get ready for a taste adventure. We offer a wide selection of delicious dishes to satisfy every craving.</Text>
        </View>
      </View>
      <View className='absolute bottom-16 w-full'>
        {isloggedin ? (
          <>
            <View className='flex flex-row justify-center items-center mt-5 gap-3'>
              <TouchableOpacity className='w-[40%] h-[4rem] bg-[#e65d82] rounded-xl justify-center items-center' onPress={() => handleLOGOUT()}>
                <Text className='text-2xl font-semibold text-white'>Logout</Text>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <>
            <View className='flex flex-row justify-center items-center mt-5 gap-3'>
              <TouchableOpacity className='w-[40%] h-[4rem] bg-[#368eef] rounded-xl justify-center items-center' onPress={() => nav.navigate('login')}>
                <Text className='text-2xl font-semibold text-white'>Login</Text>
              </TouchableOpacity>
              <TouchableOpacity className={`w-[40%] h-[4rem] rounded-xl justify-center items-center border-[#368eef] border-hairline`} onPress={() => nav.navigate('register')}>
                <Text className='text-2xl font-semibold text-black'>Register</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>
    </View>
  )
}

export default index