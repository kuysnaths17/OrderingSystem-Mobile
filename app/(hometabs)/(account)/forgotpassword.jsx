import { View, Text, TextInput, TouchableOpacity, ScrollView, ToastAndroid, ActivityIndicator, Dimensions } from 'react-native'
import React, { useState } from 'react'
import axios from 'axios';
const { width, height } = Dimensions.get('window');
import { findUserByEmail, updatePassword } from '@/constants/API';
import { Ionicons } from '@expo/vector-icons';
import { useMMKVString } from 'react-native-mmkv';
import { useNavigation } from 'expo-router';


const forgotpassword = () => {

    function resetCode(length) {
        let result = "";
        // const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        const charactersLength = characters.length;
        let counter = 0;
        while (counter < length) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
            counter += 1;
        }
        return result;
    }
    const nav = useNavigation();
    const [userId, setUserId] = useMMKVString("userId");
    const [email, setEmail] = React.useState('');
    const [otp, setOtp] = React.useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
    const [loading, setLoading] = React.useState(false);
    const [code, setCode] = React.useState(resetCode(5));
    const [page, setPage] = React.useState('GetCode');



    const handleGetcode = async () => {
        if (email === '') {
            ToastAndroid.show('Please enter your email', ToastAndroid.SHORT);
            return;
        }

        try {
            setLoading(true);
            const res = await axios.post(`${findUserByEmail}`, { email: email, code: code });

            if (res.data.isFound) {
                setPage('CodeVerify');
                setLoading(false);
            }

        } catch (error) {
            // console.log(error.response.data.message);
            ToastAndroid.show(error.response.data.message, ToastAndroid.SHORT);
            setPage('GetCode');
            setLoading(false);
        }
    }

    const handleVerify = async () => {
        if (!otp) {
            ToastAndroid.show('Please enter your OTP', ToastAndroid.SHORT);
            return;
        }
        if (otp !== code) {
            console.log(otp, code)
            ToastAndroid.show('Invalid OTP', ToastAndroid.SHORT);
            return;
        }
        setPage('Resetpass');
    }

    const handleSave = async () => {
        if(!password || !confirmPassword){
            ToastAndroid.show('Please enter your password', ToastAndroid.SHORT);
            return;
        }
        if(password !== confirmPassword){
            ToastAndroid.show('Passwords do not match', ToastAndroid.SHORT);
            return;
        }
        try {
            const res = await axios.put(`${updatePassword}/${email}`, { newPassword: password });
            if (res.data.isUpdated) {
                ToastAndroid.show('Password updated successfully', ToastAndroid.SHORT);
                
                nav.goBack();
            }
        } catch (error) {
            ToastAndroid.show(error.response.data.message, ToastAndroid.SHORT);
            setPage('Resetpass');
        }
    }

    return (
        <View className='flex-1 items-center'>
            {
                page === 'GetCode' ? (
                    <>
                        <View className='justify-center items-center mt-20 w-[100%]'>
                            <Text className='text-4xl font-extrabold text-[#368EEF] my-10'>Reset Password</Text>
                            <Text className='text-3xl font-semibold text-gray-900 text-center text-wrap w-[75%] my-5'>Enter your email to send reset code</Text>
                        </View>
                        <ScrollView className='w-full h-[80%]' showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1, justifyContent: 'flex-start', alignItems: 'center', marginTop: '15%' }}>
                            <View className='flex w-[90%]'>
                                <View className='flex flex-col my-5'>
                                    <TextInput className='w-full h-[4.5rem] border-2 border-gray-300 rounded-xl px-3 py-1' placeholder='Email' keyboardType='email-address' value={email} onChangeText={setEmail} />
                                </View>


                                <View className='flex justify-center items-center mt-10'>
                                    <TouchableOpacity className='w-[100%] h-[4rem] bg-[#368eef] rounded-xl justify-center items-center' onPress={() => handleGetcode()}>
                                        {loading ? (
                                            <ActivityIndicator size='small' color='white' />
                                        ) : (
                                            <Text className='text-2xl font-semibold text-white'>Get Code</Text>
                                        )}
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </ScrollView>
                    </>
                ) : page === 'CodeVerify' ? (
                    <>
                        <View className='justify-center items-center mt-20 w-[100%]'>
                            <Text className='text-4xl font-extrabold text-[#368EEF] my-10'>Reset Password</Text>
                            <Text className='text-3xl font-semibold text-gray-900 text-center text-wrap w-[75%] my-5'>Enter code sent from your email</Text>
                        </View>
                        <ScrollView className='w-full h-[80%]' showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1, justifyContent: 'flex-start', alignItems: 'center', marginTop: '15%' }}>
                            <View className='flex w-[90%]'>
                                <View className='flex flex-col my-5'>
                                    <TextInput className='w-full h-[4.5rem] border-2 border-gray-300 rounded-xl px-3 py-1' placeholder='XXXXX' keyboardType='default' value={otp} onChangeText={setOtp} />
                                </View>


                                <View className='flex justify-center items-center mt-10'>
                                    <TouchableOpacity className='w-[100%] h-[4rem] bg-[#368eef] rounded-xl justify-center items-center' onPress={() => { handleVerify() }}>
                                        {loading ? (
                                            <ActivityIndicator size='small' color='white' />
                                        ) : (
                                            <Text className='text-2xl font-semibold text-white'>Verify</Text>
                                        )}
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </ScrollView>
                    </>
                ) : page === 'Resetpass' ? (
                    <>
                        <View className='justify-center items-center mt-28 w-[100%]'>
                            <Text className='text-4xl font-extrabold text-[#368EEF]'>Reset Password</Text>
                        </View>
                        <ScrollView className='w-full h-[80%]' showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center' }}>
                            <View className='flex flex-col w-[90%]'>
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
                                    <TouchableOpacity className='w-[100%] h-[4rem] bg-[#368eef] rounded-xl justify-center items-center' onPress={() => handleSave()}>
                                        {loading ? (
                                            <ActivityIndicator size='small' color='white' />
                                        ) : (
                                            <Text className='text-2xl font-semibold text-white'>Save</Text>
                                        )}
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </ScrollView>
                    </>
                ) : (
                    setPage('GetCode')
                )

            }

        </View>
    )
}

export default forgotpassword