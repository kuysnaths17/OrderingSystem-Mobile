import { View, Text, TouchableOpacity, Image, ScrollView, Modal, StyleSheet, ToastAndroid, Dimensions, ActivityIndicator } from 'react-native'
const { width, height } = Dimensions.get('window');
import React, { useEffect, useState, useContext } from 'react'
import { useRoute } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import { Link } from 'expo-router';
import { fetchItemByCategory } from '@/constants/API';
import axios from 'axios';
import Header from '@/components/header';
import { CartContext } from '@/constants/cartContext';
import { useMMKVBoolean } from 'react-native-mmkv';

const index = () => {
    const nav = useNavigation();
    const route = useRoute();
    const { category, categoryTitle } = route.params;
    const [isLoggedIn, setIsLoggedIn] = useMMKVBoolean('isLoggedIn');

    const { addToCart } = useContext(CartContext);

    const [items, setItems] = React.useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);

    useEffect(() => {
        const loadItems = async () => {
            try {
                const res = await axios.get(`${fetchItemByCategory}/${category}`);
                setItems(res.data.items);
            } catch (error) {
                setItems([]);
            }
        }
        loadItems();

        const intervalId = setInterval(loadItems, 5000); // Fetch items every 5 seconds
        return () => clearInterval(intervalId);
    }, [category])

    const openModal = (item) => {
        setSelectedItem(item);
        setModalVisible(true);
    };
    const closeModal = () => {
        setModalVisible(false);
        setSelectedItem(null);
    };

    const addItemToCart = (selectedItem) => {
        if (!isLoggedIn) {
            ToastAndroid.show("Please login/create an account to add item to cart", ToastAndroid.LONG);
            closeModal();
            return;
        }
        if (selectedItem.quantity === 0) {
            ToastAndroid.show("This item is out of stock and cannot be added to the cart", ToastAndroid.LONG);
            closeModal();
            return;
        }

        closeModal();
        addToCart(selectedItem);
    };

    return (
        <View className='flex-1'>
            <Header />
            <View className='relative py-8 bg-[#f4f9ff]'>
                <Text className='text-4xl font-bold text-gray-900 text-center' animation={'tada'}>{categoryTitle}</Text>
            </View>
            {
                !setItems ? (
                    <View className='flex flex-wrap justify-center'>
                        <ActivityIndicator size="large" color="#368eef" />
                    </View>

                ) : (
                    <ScrollView showsVerticalScrollIndicator={true} style={{ maxHeight: '100%' }} contentContainerStyle={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 30, padding: 20 }}>
                        {items?.map((item, index) => {
                            return (
                                <TouchableOpacity key={index} style={{ width: width * 0.4, height: height * 0.26 }} className='bg-[#fff] rounded-xl elevation-md items-center overflow-hidden relative' onPress={() => openModal(item)}>
                                    <View>
                                        <Image source={{ uri: item.photoUrl }} style={{ width: width * 0.5, height: height * 0.21 }} />
                                    </View>
                                    <View className='w-[100%] h-[100%] bg-[#368eef]'>
                                        <Text style={{ fontSize: width * 0.04 }} className=' font-semibold text-white text-center'>{item.name}</Text>
                                    </View>
                                </TouchableOpacity>
                            )
                        })}
                    </ScrollView>
                )
            }

            {selectedItem && (
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={closeModal}
                >
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <Image source={{ uri: selectedItem.photoUrl }} style={styles.modalImage} />
                            <View>
                                <Text style={styles.modalTitle}>{selectedItem.name}</Text>
                                <Text style={styles.modalDescription}>{selectedItem.description}</Text>
                            </View>
                            <View>

                            </View>
                            <View >
                                <Text style={styles.modalDetails}>Price(&#8369;): {selectedItem.price}.00</Text>
                                <Text style={styles.modalDetails}>Available: {selectedItem.quantity}</Text>
                            </View>
                            <View className='gap-2'>
                                <TouchableOpacity style={[styles.closeButton, { backgroundColor: '#2ec193' }]} onPress={() => addItemToCart(selectedItem)}>
                                    <Text style={styles.closeButtonText}>Add to cart</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.closeButton, { backgroundColor: '#e65d82' }]} onPress={closeModal}>
                                    <Text style={styles.closeButtonText}>Close</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
            )}

        </View>
    )
}

export default index

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
    },
    modalContent: {
        width: '85%',
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 20,
        // alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalImage: {
        width: '100%',
        height: 200,
        borderRadius: 8,
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginVertical: 10,
        textAlign: 'center'
    },
    modalDescription: {
        fontSize: 16,
        // textAlign: 'center',
        marginBottom: 20,
    },
    modalDetails: {
        fontSize: 16,
        textAlign: 'left',
        // marginBottom: 20,
    },
    closeButton: {
        // backgroundColor: '#368eef',
        borderRadius: 5,
        padding: 10,

    },
    closeButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        textAlign: 'center'
    },
});