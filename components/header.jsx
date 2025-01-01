import { Text, View, Pressable, Image } from 'react-native'
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import { storage, getUser} from '@/constants/storageUtils';
import React, { useEffect, useState } from 'react';


const header = () => {
  const nav = useNavigation();
  const [sessionUser, setSessionUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const user = await getUser();
      if (user) {
        const userdata = JSON.parse(user);
        const userSess = userdata.first_name + ' ' + userdata.last_name;
        setSessionUser(userSess);
      }
    }
    fetchUser()
  }, [])


  const handleUser = () => {
    nav.navigate('(account)')
  }

  const handleMonitor = () => {
    nav.navigate('(mycart)')
  }

  return (
    <>
      <View className='relative w-full h-[70px] bg-[#368EEF] flex-row justify-between items-center px-2'>
        <View>
          <Pressable onPress={handleUser}>
            <FontAwesome5 name="user-circle" size={50} color="white" />
          </Pressable>
          {/* <Link to='/(account)/index'>
            <FontAwesome5 name="user-circle" size={50} color="white" />
          </Link> */}
        </View>
        <View >
          <Text className='text-[white] text-3xl font-bold'>{sessionUser || 'Prethegem'}</Text>
        </View>
        <View>
          <Pressable onPress={handleMonitor}>
            <MaterialCommunityIcons name="cart-variant" size={50} color="white" />
          </Pressable>
        </View>
      </View>
    </>
  )
}

export default header