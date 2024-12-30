import { StyleSheet, TouchableOpacity, ScrollView } from 'react-native'
import React, { useEffect } from 'react'
import Header from '@/components/header';
import axios from 'axios';
import { fetchAllTables } from '@/constants/API';
import { Text, View } from 'react-native-animatable';

const tables = () => {
  const [tables, setTables] = React.useState([]);

  useEffect(() => {
    const loadTables = async () => {
      try {
        const res = await axios.get(`${fetchAllTables}`);
        setTables(res.data);
      } catch (error) {
        console.log(error)
      }
    }
    loadTables();

    const intervalId = setInterval(loadTables, 5000); // Fetch tables every 5 seconds

    return () => clearInterval(intervalId);
  }, []);
  return (
    <View className='flex-1'>
      <Header />
      <View className='relative py-8 bg-[#f4f9ff]'>
        <Text className='text-4xl font-bold text-gray-900 text-center' animation={'tada'}>Tables</Text>
      </View>
      <ScrollView showsVerticalScrollIndicator={true} style={{ maxHeight: '100%' }} contentContainerStyle={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-evenly' }}>
        {
          tables?.map((table, index) => (
            <TouchableOpacity key={index} className='bg-[#a8c2f9] p-4 rounded-lg m-2 w-[45%] h-[14rem]'>
              <View className='bg-[#7c91bc] p-10'>
                <Text className='text-center font-bold text-7xl text-[#f4f9ff]'>{table.tableNumber}</Text>
              </View>
              <View>
                <Text className='text-center text-3xl font-bold' style={{ color: table.status === 'available' ? '#008a61' : table.status === 'reserved' ? '#b18521' : table.status === 'occupied' ? '#f15a44' : null }}>{table.status}</Text>
              </View>
            </TouchableOpacity>
          ))
        }
      </ScrollView>
    </View>
  )
}

export default tables

const styles = StyleSheet.create({})