import { View, Text, TextInput, TouchableOpacity, ScrollView, ToastAndroid, ActivityIndicator } from 'react-native'
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react'
import { useNavigation } from '@react-navigation/native';
import { loginUser } from '@/constants/API';
import axios from 'axios';
import { storage, setLoggedIn } from '@/constants/storageUtils';

const login = () => {
    const nav = useNavigation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [loading, setLoading] = useState(false);

    const clearFields = () => {
        setEmail('');
        setPassword('');
    }

    const handleLogin = async () => {
        if (!email || !password) {
            ToastAndroid.show("All fields are required", ToastAndroid.SHORT);

            return;
        }
        try {
            setLoading(true);
            const data = {
                email: email,
                password: password
            }
            const response = await axios.post(loginUser, data);
            console.log(response.data.isFound);
            if (response.data.isFound) {
                ToastAndroid.show(response.data.message, ToastAndroid.SHORT);
                setLoggedIn(response.data.isFound);
                storage.set('user', JSON.stringify(response.data.user));
                storage.set('userId', JSON.stringify(response.data.user.id));
                nav.goBack();
                clearFields();
                nav.jumpTo('index');
            }

        } catch (error) {
            // console.log(error.response.data.message);
            ToastAndroid.show(error.response.data.message, ToastAndroid.SHORT);
        } finally {
            setLoading(false);

            // nav.jumpTo('index')
            // clearFields();
        }
    }

    return (
        <View className='flex-1 items-center'>
            <View className='justify-center items-center mt-20 w-[100%]'>
                <Text className='text-6xl font-extrabold text-[#368EEF] my-10'>Login Here</Text>
                <Text className='text-3xl font-semibold text-gray-900 text-center text-wrap w-[75%] my-5'>Welcome back! Please login to your account.</Text>
            </View>
            <ScrollView className='w-full h-[80%]' showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1, justifyContent: 'flex-start', alignItems: 'center', marginTop: '15%' }}>
                <View className='flex w-[90%]'>
                    <View className='flex flex-col my-5'>
                        <TextInput className='w-full h-[4.5rem] border-2 border-gray-300 rounded-xl px-3 py-1' placeholder='Email' keyboardType='email-address' value={email} onChangeText={setEmail} />
                    </View>
                    <View className='flex flex-row my-5 justify-center items-center'>
                        <TextInput className='w-full h-[4.5rem] border-2 border-gray-300 rounded-xl px-3 py-1 pr-14' placeholder='Password' keyboardType='default' value={password} onChangeText={setPassword} secureTextEntry={!passwordVisible} />
                        <TouchableOpacity className='absolute right-0 p-4' onPress={() => setPasswordVisible(!passwordVisible)}>
                            <Ionicons name={passwordVisible ? 'eye-off' : 'eye'} size={24} color='gray' />
                        </TouchableOpacity>
                    </View>
                    
                    <View className='flex justify-center items-center mt-10'>
                        <TouchableOpacity className='w-[100%] h-[4rem] bg-[#368eef] rounded-xl justify-center items-center' onPress={() => handleLogin()}>
                            {loading ? (
                                <ActivityIndicator size='small' color='white' />
                            ) : (
                                <Text className='text-2xl font-semibold text-white'>Sign in</Text>
                            )}
                        </TouchableOpacity>
                    </View>
                    <View className='flex justify-center items-center mt-6'>
                        <TouchableOpacity onPress={()=> nav.navigate('forgotpassword')}>
                            <Text className='text-xl font-bold text-[#368EEF]'>forgot password</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>

        </View>
    )
}

export default login