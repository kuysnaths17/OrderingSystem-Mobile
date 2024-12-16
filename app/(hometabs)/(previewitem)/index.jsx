import { View, Text, TouchableOpacity, Image, ScrollView, Modal, StyleSheet } from 'react-native'
import React, { useEffect, useState, useContext } from 'react'
import { useRoute } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import { Link } from 'expo-router';
import { fetchItemByCategory } from '@/constants/API';
import axios from 'axios';
import Header from '@/components/header';
import { CartContext } from '@/constants/cartContext';


const index = () => {
    const nav = useNavigation();
    const route = useRoute();
    const { category, categoryTitle } = route.params;
    console.log(category)

    const { addToCart } = useContext(CartContext);

    const [items, setItems] = React.useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);

    const returnBack = () => {
        nav.navigate('items')
    }

    // const [backPressCount, setBackPressCount] = useState(0);
    // const [exitTimeout, setExitTimeout] = useState(null);

    // useEffect(() => {
    //     const backAction = () => {
    //         if (backPressCount === 0) {
    //             setBackPressCount(1);
    //             ToastAndroid.show('Press back again to exit the app', ToastAndroid.SHORT);

    //             // Reset backPressCount after 2 seconds
    //             setExitTimeout(setTimeout(() => {
    //                 setBackPressCount(0);
    //             }, 2000));

    //             return true; // Prevent default behavior
    //         } else if (backPressCount === 1) {
    //             clearTimeout(exitTimeout); // Clear the timeout
    //             // BackHandler.exitApp(); // Exit the app
    //             returnBack();
    //             return true; // Prevent default behavior
    //         }
    //     };

    //     const backHandler = BackHandler.addEventListener(
    //         'hardwareBackPress',
    //         backAction
    //     );

    //     // Cleanup the event listener and timeout on component unmount
    //     return () => {
    //         backHandler.remove();
    //         clearTimeout(exitTimeout);
    //     };
    // }, [backPressCount, exitTimeout]);

    useEffect(() => {
        const loadItems = async () => {
            try {
                const res = await axios.get(`${fetchItemByCategory}/${category}`);
                setItems(res.data.items);
            } catch (error) {
                console.log(error)
            }
        }
        loadItems();
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
        closeModal();
        addToCart(selectedItem);
    };

    return (
        <View className='flex-1'>
            <Header />
            <View className='relative py-10 bg-[#f4f9ff]'>
                <Text className='text-4xl font-bold text-gray-900 text-center' animation={'tada'}>{categoryTitle}</Text>
            </View>
            <ScrollView showsVerticalScrollIndicator={true} style={{ maxHeight: '100%' }} contentContainerStyle={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 30, padding: 20 }}>
                {items?.map((item, index) => {
                    return (
                        <TouchableOpacity key={index} className='bg-[#fff] rounded-xl elevation-md w-[12rem] h-[14rem] items-center overflow-hidden' onPress={() => openModal(item)}>
                            <View>
                                <Image source={{ uri: item.photoUrl }} className='w-[12rem] h-[12rem]' />
                            </View>
                            <View className='w-[100%] bg-[#368eef] items-center'>
                                <Text className='text-2xl font-semibold text-white'>{item.name}</Text>
                            </View>
                        </TouchableOpacity>
                    )
                })}
            </ScrollView>
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
                                <TouchableOpacity style={[styles.closeButton, {backgroundColor:'#2ec193'}]} onPress={()=>addItemToCart(selectedItem)}>
                                    <Text style={styles.closeButtonText}>Add to list</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.closeButton, {backgroundColor:'#e65d82'}]} onPress={closeModal}>
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