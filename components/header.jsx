import { StyleSheet, Text, View, Pressable } from 'react-native'
import React from 'react'
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';

const header = () => {



  return (
    <View>
      <View>
        <Pressable onPress={() => { }}>
          <FontAwesome5 name="user-circle" size={52} color="black" />
        </Pressable>
      </View>
      <View>
        <Text>Mang JolliDo's KFC</Text>
      </View>
    </View>
  )
}

export default header

const styles = StyleSheet.create({})