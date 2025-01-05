import React, { createContext, useState, useEffect } from 'react';
import { setLoggedIn, storage } from '@/constants/storageUtils';
import { ToastAndroid } from 'react-native';

export const CartContext = createContext();

export const CartProvider = ({ userId, children }) => {
    const [cart, setCart] = useState([]);
    const [reservedTable, setReservedTable] = useState(null); // New state for reserved table

    // Use "guest" as the userId if it is null or undefined
    const resolvedUserId = userId || "guest";
    // Generate the storage key based on the user ID
    const cartKey = `cart_${resolvedUserId}`;
    const tableKey = `table_${resolvedUserId}`;
    // console.log(cart);
    // Load cart from MMKV on initial render
    useEffect(() => {
        const savedCart = storage.getString(cartKey);
        if (savedCart) {
            setCart(JSON.parse(savedCart));
        }
        const savedTable = storage.getString(tableKey);
        if (savedTable) {
            setReservedTable(JSON.parse(savedTable));
        }
    }, [userId]); // Reload cart when userId changes

    // Save cart to MMKV whenever it changes
    useEffect(() => {
        storage.set(cartKey, JSON.stringify(cart));
    }, [cart, userId, cartKey]);

    // Save reserved table to MMKV whenever it changes
    useEffect(() => {
        if (reservedTable !== null) {
            storage.set(tableKey, JSON.stringify(reservedTable));
        } else {
            storage.delete(tableKey);
        }
    }, [reservedTable, userId, tableKey]);

    const addToCart = (item) => {
        setCart((prevCart) => {
            const isItemInCart = prevCart.some(cartItem => cartItem._id === item._id);

            if (isItemInCart) {
                ToastAndroid.show('Item is already in the cart!', ToastAndroid.SHORT);
                return prevCart;
            }

            return [...prevCart, item];
        });
    };

    const removeFromCart = (itemId) => {
        setCart((prevCart) => prevCart.filter(item => item._id !== itemId));
    };

    const clearCart = () => {
        setCart([]); // Clear the cart by setting it to an empty array
        storage.delete(cartKey); // Also delete the cart from MMKV
    };

    const reserveTable = (table) => {
        setReservedTable(table); // Set the reserved table number
    };

    const clearReservation = () => {
        setReservedTable(null); // Clear the reserved table
        storage.delete(tableKey); // Also delete the table reservation from MMKV
    };

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, reservedTable, reserveTable, clearReservation }}>
            {children}
        </CartContext.Provider>
    );
};