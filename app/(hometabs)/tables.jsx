import { StyleSheet, TouchableOpacity, ScrollView, Modal, Button } from 'react-native'
import React, { useEffect, useContext } from 'react'
import Header from '@/components/header';
import axios from 'axios';
import { fetchAllTables } from '@/constants/API';
import { Text, View } from 'react-native-animatable';
import { CartContext } from '@/constants/cartContext';
import { useNavigation } from '@react-navigation/native';


const tables = () => {
  const nav = useNavigation();
  const [tables, setTables] = React.useState([]);
  const [isModalVisible, setIsModalVisible] = React.useState(false);
  const [selectedTable, setSelectedTable] = React.useState({});

  const { reserveTable } = useContext(CartContext);


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

  const handleReserveTable = async (tbInfo) => {
    reserveTable(tbInfo);
    setIsModalVisible(false);
    nav.jumpTo('(mycart)')
  };
  
  return (
    <View className='flex-1'>
      <Header />
      <View className='relative py-8 bg-[#f4f9ff]'>
        <Text className='text-4xl font-bold text-gray-900 text-center' animation={'tada'}>Tables</Text>
      </View>
      <ScrollView showsVerticalScrollIndicator={true} style={{ maxHeight: '100%' }} contentContainerStyle={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-evenly' }}>
        {
          tables?.map((table, index) => (
            <TouchableOpacity key={index} className='bg-[#a8c2f9] p-4 rounded-lg m-2 w-[45%] h-[14rem]'
              onPress={() => {
                setSelectedTable({tableNumber: table.tableNumber, status:table.status, tableID: table._id});
                setIsModalVisible(true);
              }}
              disabled={table.status === 'reserved' || table.status === 'occupied' ? true : false}
              >
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
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View className='flex-1 justify-center items-center bg-[rgba(0,0,0,0.5)]'>
          <View className='bg-[#f4f9ff] p-10 rounded-lg w-[80%]'>
            <Text className='text-2xl font-bold text-center'>Reserve Table {selectedTable?.tableNumber}?</Text>
            <View className='flex flex-row justify-around mt-5'>
              <TouchableOpacity className='bg-[#368eef] p-2 rounded-lg w-[35%] h-[3rem] justify-center' onPress={() => handleReserveTable(selectedTable)}>
                <Text className='text-white text-center'>Yes</Text>
              </TouchableOpacity>

              <TouchableOpacity className='bg-[#e65d82] p-2 rounded-lg w-[35%] h-[3rem] justify-center' onPress={() => setIsModalVisible(false)}>
                <Text className='text-white text-center'>No</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  )
}

export default tables

const styles = StyleSheet.create({})