import { View, Text, TextInput, TouchableOpacity, ScrollView, ToastAndroid, ActivityIndicator } from 'react-native'
import React, { useState } from 'react'
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { createUser } from '@/constants/API';

const register = () => {
    const nav = useNavigation();
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
    const emailPattern = /^[^\s@]+@(gmail\.com|yahoo\.com|outlook\.com|hotmail\.com)$/;
    const [loading, setLoading] = useState(false);

    const clearFields = () => {
        setFirstName('');
        setLastName('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
    }

    const handleSignup = async () => {
        if (!firstName || !lastName || !email || !password || !confirmPassword) {
            ToastAndroid.show("All fields are required", ToastAndroid.SHORT)
            return;
        }
        if (emailPattern.test(email) === false) {
            ToastAndroid.show("We only accept gmail, yahoo, outlook and hotmail", ToastAndroid.SHORT)
            return;
        }
        if (password.length < 8) {
            ToastAndroid.show("Password must be at least 8 characters", ToastAndroid.SHORT)
            return;
        }
        if (password !== confirmPassword) {
            ToastAndroid.show("Password does'nt match", ToastAndroid.SHORT, ToastAndroid.TOP)
            return;
        }

        try {
            setLoading(true);
            const data = {
                first_name: firstName,
                last_name: lastName,
                email: email,
                password: password
            }

            const response = await axios.post(createUser, data);
            // console.log(response.data.message);
            if(response.data.isCreated){
                ToastAndroid.show(response.data.message, ToastAndroid.SHORT);
                nav.goBack();
                clearFields();
                nav.navigate('index');
            }
            
            
        } catch (error) {
            // console.log(error.response.data.message);
            ToastAndroid.show(error.response.data.message, ToastAndroid.SHORT)
        } finally {
            setLoading(false);
            clearFields();
        }
    }


    return (
        <View className='flex-1 items-center'>
            <View className='justify-center items-center mt-12 w-[100%]'>
                <Text className='text-6xl font-extrabold text-[#368EEF] my-8'>Create Account</Text>
                <Text className='text-3xl font-semibold text-gray-900 text-center text-wrap w-[80%]'>Create Account for easy access to our services.</Text>
            </View>
            <ScrollView className='w-full h-[80%]' showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center' }}>
                <View className='flex flex-col w-[90%]'>
                    <View className='flex flex-col my-5'>
                        <TextInput className='w-full h-[4.5rem] border-2 border-gray-300 rounded-xl px-3 py-1' placeholder='First Name' keyboardType='default' value={firstName} onChangeText={setFirstName} />
                    </View>
                    <View className='flex flex-col my-5'>
                        <TextInput className='w-full h-[4.5rem] border-2 border-gray-300 rounded-xl px-3 py-1' placeholder='Last Name' keyboardType='default' value={lastName} onChangeText={setLastName} />
                    </View>
                    <View className='flex flex-col my-5'>
                        <TextInput className='w-full h-[4.5rem] border-2 border-gray-300 rounded-xl px-3 py-1 ' placeholder='Email' keyboardType='email-address' value={email} onChangeText={setEmail} />
                    </View>
                    <View className='flex flex-row my-5 justify-center items-center'>
                        <TextInput className='w-full h-[4.5rem] border-2 border-gray-300 rounded-xl px-3 py-1 pr-14' placeholder='Password' keyboardType='default' secureTextEntry={!passwordVisible} value={password} onChangeText={setPassword} />
                        <TouchableOpacity className='absolute right-0 p-4' onPress={() => setPasswordVisible(!passwordVisible)}>
                            <Ionicons name={passwordVisible ? 'eye-off' : 'eye'} size={24} color='gray' />
                        </TouchableOpacity>
                    </View>
                    <View className='flex flex-col my-5 justify-center items-center'>
                        <TextInput className='w-full h-[4.5rem] border-2 border-gray-300 rounded-xl px-3 py-1 pr-14' placeholder='Confirm Password' keyboardType='default' secureTextEntry={!confirmPasswordVisible} value={confirmPassword} onChangeText={setConfirmPassword} />
                        <TouchableOpacity className='absolute right-0 p-4' onPress={() => setConfirmPasswordVisible(!confirmPasswordVisible)}>
                            <Ionicons name={confirmPasswordVisible ? 'eye-off' : 'eye'} size={24} color='gray' />
                        </TouchableOpacity>
                    </View>
                    <View className='flex justify-center items-center mt-5'>
                        <TouchableOpacity className='w-[100%] h-[4rem] bg-[#368eef] rounded-xl justify-center items-center' onPress={() => handleSignup()}>
                            {loading ? (
                                <ActivityIndicator size='small' color='white' />
                            ) : (
                                <Text className='text-2xl font-semibold text-white'>Sign up</Text>
                            )}
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </View>
    )
}

export default register