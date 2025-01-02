import { View, Text, BackHandler, Alert, StyleSheet, TouchableOpacity, ToastAndroid } from 'react-native'
import React, { useRef, useEffect, useContext } from 'react'
import { useRoute, useNavigation } from '@react-navigation/native'
import { WebView } from 'react-native-webview'
import axios from 'axios'
const paymongoAPIKey = 'sk_test_zJeMvh98kvsqEmh4YNz1FdEg';
import { storage } from '@/constants/storageUtils'
import { CartContext } from '@/constants/cartContext'
import { insertOrder } from '@/constants/API';
import { useMMKVBoolean, useMMKVObject, useMMKVString } from 'react-native-mmkv';


const paymentwebview = () => {
    const navigation = useNavigation()
    const router = useRoute()
    const { paymentLink, quantities } = router.params
    const { cart, removeFromCart, clearCart, reservedTable, clearReservation } = useContext(CartContext);
    const webViewRef = useRef(null);
    // console.log(paymentLink.paymentLinkUrl);


    const archivePMLink = async () => {
        try {
            console.log(paymentLink.paymentLinkID)
            const res = await axios.post(`https://api.paymongo.com/v1/links/${paymentLink.paymentLinkID}/archive`,{},{
                headers: {
                    Authorization: `Basic ${btoa(paymongoAPIKey + ':')}`,
                    'Content-Type': 'application/json'
                }
            });
            // console.log(res.data);
        } catch (error) {
            console.error('Error archiving payment link:', error);
        }
    }

    const handleBackButton = () => {
        if (webViewRef.current) {
            webViewRef.current.goBack(); // Go back in WebView history
            Alert.alert("Hold on!", "You can't go back while the payment is in progress.", [
                { text: "OK", onPress: () => null }
            ]);

            return true; // Prevent default back action
        }
    };

    useEffect(() => {
        const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackButton);

        return () => {
            backHandler.remove(); // Clean up the event listener on unmount
        };
    }, []);

    const handleCancel = () => {
        Alert.alert(
            'Cancel Payment',
            'Are you sure you want to cancel the payment?',
            [
                {
                    text: 'Yes', onPress: () => {
                        archivePMLink();
                        navigation.goBack();
                    }
                },
                { text: 'No', onPress: () => console.log('Cancel payment cancelled') },
            ],
            { cancelable: false }
        );
    };

    const order = async () => {
        try {
            const data = {
                customerId: JSON.parse(storage.getString('userId')),
                tableID: reservedTable.tableID,
                items: cart.map(item => ({
                    itemId: item._id,
                    itemImage: item.photoUrl,
                    itemName: item.name,
                    itemTotalPrice: item.price * (quantities[item._id] || 1),
                    quantity: quantities[item._id] || 1
                })),
                totalPrice: cart.reduce((acc, item) => acc + (item.price * (quantities[item._id] || 1)), 0),
            }

            const response = await axios.post(insertOrder, data);
            if (response.data.isCompleted) {
                ToastAndroid.show(response.data.message, ToastAndroid.SHORT);
                // ToastAndroid.show(response.data.newOrder._id, ToastAndroid.SHORT);
                const qrInfo = {
                    qrid: response.data.newOrder._id,
                    tableID: response.data.newOrder.tableID
                }
                storage.set('QRorderID', JSON.stringify(qrInfo));
                clearCart();
                clearReservation();
            }
            // console.log(data);
        } catch (error) {
            console.error('Error creating order:', error);
        }
        
    }
    return (
        <View className='flex-1'>
            <WebView
                ref={webViewRef}
                source={{ uri: paymentLink.paymentLinkUrl }}
                style={{ flex: 1 }}
                onNavigationStateChange={(navState) => {
                    if (navState.url.includes('success')) {
                        Alert.alert('Payment Successful', 'Your payment was successful!');
                        order();
                        navigation.goBack(); // Navigate back after success
                    } else if (navState.url.includes('cancel')) {
                        Alert.alert('Payment Cancelled', 'Your payment was cancelled.');
                        navigation.goBack(); // Navigate back after cancellation
                    }
                }}
            />
            <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
                <Text style={styles.cancelButtonText}>Cancel Payment</Text>
            </TouchableOpacity>
        </View>
    )
}

export default paymentwebview

const styles = StyleSheet.create({
    cancelButton: {
        backgroundColor: 'red',
        padding: 10,
        alignItems: 'center',
        borderRadius: 5,
        margin: 10,
    },
    cancelButtonText: {
        color: 'white',
        fontSize: 16,
    },
});