import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, ScrollView } from 'react-native'
import React, { useState, useContext } from 'react'
import { CartContext } from '@/constants/cartContext'


const index = () => {
    const { cart, removeFromCart, clearCart } = useContext(CartContext);
    const [quantities, setQuantities] = useState({});

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
        <View style={styles.container}>

            <Text style={styles.title}>Cart Items</Text>
            <View style={{ flex: 1 }}>
                <ScrollView>
                    {cart?.length === 0 ? (
                        <Text style={styles.emptyText}>Your cart is empty.</Text>
                    ) : (
                        cart?.map((item, index) => {
                            const quantity = quantities[item._id] || 1; // Default to 1 if not set
                            const totalPrice = item.price * quantity; // Calculate total price based on quantity
                            return (
                                <View style={styles.row} key={index}>
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
            <TouchableOpacity onPress={handleClearCart} style={styles.clearButton}>
                <Text style={styles.clearButtonText}>Clear All</Text>
            </TouchableOpacity>
        </View>
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
});