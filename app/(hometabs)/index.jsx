import { StyleSheet, Text, View, BackHandler, Alert } from 'react-native'
import React, { useEffect, useContext, useRef } from 'react'
import Header from '@/components/header';
import { CartContext } from '@/constants/cartContext'
import { useNavigation } from 'expo-router';

const index = () => {
  const { clearCart } = useContext(CartContext);
  const backPressCount = useRef(0); // To keep track of back presses
  const backPressTimeout = useRef(null); // To store the timeout reference
  const nav = useNavigation();
  useEffect(() => {
    const backAction = () => {
      backPressCount.current += 1; // Increment the back press count

      if (backPressCount.current === 1) {
        if(nav.canGoBack()){
          nav.goBack();
        }
        backPressTimeout.current = setTimeout(() => {
          backPressCount.current = 0; // Reset count after timeout
        }, 600);
      } else if (backPressCount.current === 2) {
         Alert.alert(
          "Confirm Exit",
          "Exiting the app will delete current cart.",
          [
            {
              text: "Cancel",
              onPress: () => {
                backPressCount.current = 0; // Reset count if canceled
              },
              style: "cancel"
            },
            {
              text: "OK",
              onPress: () => {
                clearCart(); // Clear the cart
                BackHandler.exitApp(); // Exit the app
              }
            }
          ]
        );
      }

      return true; // Prevent default behavior
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    // Cleanup function to remove the listener and clear timeout
    return () => {
      backHandler.remove(); // Remove the listener
      clearTimeout(backPressTimeout.current); // Clear the timeout
    };
  }, []);
  return (
    <View className='flex-1'>
      <Header />
      <Text>index</Text>
      <View>

      </View>
    </View>
  )
}

export default index

const styles = StyleSheet.create({})