import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, ScrollView, ToastAndroid } from 'react-native'
import React, { useState, useContext, useEffect } from 'react'
import { CartContext } from '@/constants/cartContext'
import { useMMKVBoolean, useMMKVObject, useMMKVString } from 'react-native-mmkv';
import { storage } from '@/constants/storageUtils';
import { useNavigation } from '@react-navigation/native';

import axios from 'axios';
import QRCodeStyled from 'react-native-qrcode-styled';
import { getOrderStatus } from '@/constants/API';
const paymongoAPIKey = 'sk_test_zJeMvh98kvsqEmh4YNz1FdEg';

const index = () => {
    const navigation = useNavigation();
    const { cart, removeFromCart, clearCart, reservedTable, clearReservation } = useContext(CartContext);
    const [quantities, setQuantities] = useState({});
    const [islogged, setIsLogged] = useMMKVBoolean('isLoggedIn');
    const [qrOrderID, setQrOderID] = useMMKVObject('QRorderID');

    // storage.delete('QRorderID');
    // console.log(qrOrderID);
    // const QRID = qrOrderID.qrid;
    const QRID = qrOrderID?.qrid;
    const [orderStatus, setOrderStatus] = useState(null);

    const checkOrderStatus = async () => {
        try {
            if (qrOrderID) {
                const response = await axios.get(`${getOrderStatus}/${qrOrderID?.tableID}`);
                // console.log(response.data.order.orderStatus);
                setOrderStatus(response.data.order.orderStatus);
                if (response.data.order.orderStatus === 'complete') {
                    Alert.alert(
                        'Order Completed',
                        'Thank you for dining in with us',
                        [
                            {
                                text: 'OK',
                                onPress: () => {
                                    storage.delete('QRorderID');
                                    navigation.jumpTo('index');
                                }
                            }
                        ]
                    )
                    return;
                }
            }
        } catch (error) {
            ToastAndroid.show(error.response.data.message, ToastAndroid.SHORT);
        }
    }

    useEffect(() => {

        checkOrderStatus();
        if (orderStatus !== 'complete') {
            const intervalId = setInterval(checkOrderStatus, 5000); // Fetch items every 5 seconds
            return () => clearInterval(intervalId);
        }

    }, [qrOrderID?.tableID, orderStatus]);

    useEffect(() => {
        if (!qrOrderID) {
            Alert.alert(
                'Information',
                'Please always check your item quantity before proceeding to checkout',
            )
        }
    }, [])

    const handleDelete = (itemId) => {
        Alert.alert(
            "Confirm Delete",
            "Are you sure you want to remove this item from your cart?",
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                {
                    text: "OK",
                    onPress: () => {
                        removeFromCart(itemId);
                        // Remove the quantity for the deleted item
                        setQuantities(prev => {
                            const newQuantities = { ...prev };
                            delete newQuantities[itemId];
                            return newQuantities;
                        });
                    }
                }
            ]
        );
    };

    // const order = async () => {
    //     const data = {
    //         customerId: JSON.parse(storage.getString('userId')),
    //         tableID: reservedTable.tableID,
    //         items: cart.map(item => ({
    //             itemId: item._id,
    //             itemImage: item.photoUrl,
    //             itemName: item.name,
    //             itemTotalPrice: item.price * (quantities[item._id] || 1),
    //             quantity: quantities[item._id] || 1
    //         })),
    //         totalPrice: cart.reduce((acc, item) => acc + (item.price * (quantities[item._id] || 1)), 0),
    //     }
    //     console.log(data);
    //     try {
    //         const response = await axios.post(insertOrder, data);
    //         if (response.data.isCompleted) {
    //             ToastAndroid.show(response.data.message, ToastAndroid.SHORT);
    //             // ToastAndroid.show(response.data.newOrder._id, ToastAndroid.SHORT);
    //             const qrInfo = {
    //                 qrid: response.data.newOrder._id,
    //                 tableID: response.data.newOrder.tableID
    //             }
    //             storage.set('QRorderID', JSON.stringify(qrInfo));
    //             clearCart();
    //             clearReservation();
    //         }
    //     } catch (error) {
    //         ToastAndroid.show(error.response.data.message, ToastAndroid.SHORT);
    //     }
    // }

    const createPaymentLink = async () => {
        try {
            const res = await axios.post('https://api.paymongo.com/v1/links', {
                data: {
                    attributes: {
                        amount: 10000,
                        description: 'Thank you for dining in with us',
                    }
                }
            }, {
                headers: {
                    Authorization: `Basic ${btoa(paymongoAPIKey + ':')}`,
                    'Content-Type': 'application/json'
                }
            });
            // console.log(res.data);
            const paymentInfos = {
                paymentLinkID: res.data.data.id,
                paymentLinkUrl: res.data.data.attributes.checkout_url
            }
            // console.log(paymentInfos);
            return paymentInfos;
        } catch (err) {
            console.error(err);
        }
    }


    const handlePayment = () => {
        if (!reservedTable) {
            Alert.alert(
                'Error',
                'Please reserve a table first before proceeding to payment',
                [
                    {
                        text: 'OK',
                        onPress: () => {
                            navigation.navigate('tables');
                        }
                    }
                ]
            )
            return;
        }
        if (cart.length === 0) {
            Alert.alert(
                'Error',
                'Your cart is empty. Please add items to your cart before proceeding to payment.',
            )
            return;
        }

        // order();
        createPaymentLink().then(res => {
            // console.log(res);
            navigation.navigate('paymentwebview', { paymentLink: res, quantities: quantities });
        });

    }

    const handleClearCart = () => {
        Alert.alert(
            "Confirm Clear Cart",
            "Are you sure you want to clear all items from your cart?",
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                {
                    text: "OK",
                    onPress: () => {
                        clearCart(); // Call the clearCart function
                        clearReservation(); // Clear the reserved table
                        setQuantities({}); // Reset quantities
                    }
                }
            ]
        );
    };

    const handleQuantityChange = (itemId, quantity) => {
        setQuantities(prev => ({
            ...prev,
            [itemId]: quantity
        }));
    };


    return (

        orderStatus === 'pending' ? (
            <View className='flex-1 justify-center items-center'>
                <QRCodeStyled
                    data={QRID}
                    style={styles.svg}
                    padding={25}
                    pieceSize={12}
                    pieceBorderRadius={[0, 6, 0, 6]}
                    isPiecesGlued
                    gradient={{
                        type: 'linear',
                        options: {
                            start: [0, 0],
                            end: [1, 1],
                            colors: ['#368eef', '#404756'],
                            locations: [0, 1],
                        },
                    }}
                />
                <Text className='text-3xl font-bold text-[#368eef] text-center w-[75%]'>Scan This to the counter to claim your order</Text>
                {/* <Text className='text-2xl font-bold text-[#368eef] text-center w-[75%]'>{QRID}</Text> */}
            </View>
        ) : (
            <View style={styles.container}>
                <View>
                    <Text style={styles.title}>Reserved Table</Text>
                    <View className='flex flex-row justify-center items-center gap-10 border-b-2 border-[#368eef]'>
                        <Text className='font-extrabold text-3xl'>Table Number : </Text>
                        <Text className='font-extrabold text-3xl'>{reservedTable?.tableNumber || 'N/A'}</Text>
                    </View>
                </View>
                <Text style={styles.title}>Cart Items</Text>
                <View style={{ flex: 1 }}>
                    <ScrollView>
                        {cart?.length === 0 || !islogged ? (
                            <Text style={styles.emptyText}>Your cart is empty.</Text>
                        ) : (
                            cart?.map((item, index) => {
                                const quantity = quantities[item._id] || 1; // Default to 1 if not set
                                const totalPrice = item.price * quantity; // Calculate total price based on quantity
                                return (
                                    <View style={styles.row} key={item._id}>
                                        <Text style={styles.cell}>{item.name}</Text>
                                        <Text style={styles.cell}>₱{totalPrice}.00</Text>
                                        <View style={styles.quantityContainer}>
                                            <TouchableOpacity onPress={() => handleQuantityChange(item._id, Math.max(1, quantity - 1))} style={styles.adjustButton}>
                                                <Text style={styles.adjustButtonText}>-</Text>
                                            </TouchableOpacity>
                                            <TextInput
                                                style={styles.quantityInput}
                                                keyboardType="numeric"
                                                value={String(quantity)} // Ensure the value is a string for TextInput
                                                onChangeText={(text) => {
                                                    const newQuantity = parseInt(text) || 1; // Convert to number or set to 1
                                                    handleQuantityChange(item._id, newQuantity); // Update quantity in cart
                                                }}
                                            />
                                            <TouchableOpacity onPress={() => handleQuantityChange(item._id, quantity + 1)} style={styles.adjustButton}>
                                                <Text style={styles.adjustButtonText}>+</Text>
                                            </TouchableOpacity>
                                        </View>
                                        <TouchableOpacity onPress={() => handleDelete(item._id)} style={styles.deleteButton}>
                                            <Text style={styles.deleteButtonText}>Delete</Text>
                                        </TouchableOpacity>
                                    </View>
                                )
                            })
                        )}
                    </ScrollView>
                </View>
                <TouchableOpacity onPress={handlePayment} style={styles.paymentButton}>
                    <Text style={styles.clearButtonText}>Proceed to Payment</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleClearCart} style={styles.clearButton}>
                    <Text style={styles.clearButtonText}>Clear All</Text>
                </TouchableOpacity>
            </View>
        )

    )
}

export default index

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#f5f5f5',
        borderRadius: 8,
        marginTop: 16,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        alignItems: 'center'
    },
    cell: {
        flex: 1,
        textAlign: 'left',
        fontSize: 16,
    },
    deleteButton: {
        backgroundColor: '#e65d82',
        borderRadius: 5,
        padding: 10,
    },
    deleteButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    emptyText: {
        textAlign: 'center',
        fontSize: 16,
        color: '#888',
    },
    quantityInput: {
        width: 50, // Set a fixed width for the input
        borderColor: '#ccc', // Border color
        borderWidth: 1, // Border width
        borderRadius: 5, // Rounded corners
        padding: 5, // Padding inside the input
        textAlign: 'center', // Center the text
        fontSize: 16, // Font size
    },
    quantityContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    adjustButton: {
        backgroundColor: '#ccc',
        borderRadius: 5,
        padding: 5,
        marginHorizontal: 5,
    },
    adjustButtonText: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    clearButton: {
        backgroundColor: '#e65d82',
        borderRadius: 5,
        padding: 10,
        marginTop: 20,
        alignItems: 'center',
    },
    clearButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    paymentButton: {
        backgroundColor: '#008a61',
        borderRadius: 5,
        padding: 10,
        marginTop: 20,
        alignItems: 'center',
    },
    svg: {
        backgroundColor: 'white',
        borderRadius: 16,
        overflow: 'hidden',
    },
});
