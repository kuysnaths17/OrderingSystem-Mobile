import {Text, View, Pressable } from 'react-native'
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';

const header = () => {
  const nav = useNavigation();

  const handleUser = () => {
    console.log('user')
    nav.navigate('(account)')
  }

  const handleMonitor = () => {
    console.log('monitor')
  }

  return (
    <View className='relative w-full h-[70px] bg-[#368EEF] flex-row justify-between items-center px-2'>
      <View>
        <Pressable onPress={handleUser}>
          <FontAwesome5 name="user-circle" size={50} color="white" />
        </Pressable>
      </View>
      <View >
        <Text className='text-[white] text-3xl font-bold'>Mang JolliDo's KFC</Text>
      </View>
      <View>
        <Pressable onPress={handleMonitor}>
          <MaterialCommunityIcons name="order-bool-descending-variant" size={50} color="white" />
        </Pressable>
      </View>
    </View>
  )
}

export default header