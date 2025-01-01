// import SessionStorage from 'react-native-session-storage';
import { MMKV } from "react-native-mmkv";
export const storage = new MMKV();

export const getUser = async () => {
    return storage.getString('user');
}

export const checkLoggedIn = async () => {
    return storage.getString('isLoggedIn');
}

export const setLoggedIn = async (state) => {
    if (typeof state !== 'boolean') {
        console.error('setLoggedIn: Expected a boolean value');
        return;
    }

    // Update the isLoggedIn state in MMKV storage
    storage.set('isLoggedIn', JSON.stringify(state));
}

export const deleteUser = async () => {
    return storage.delete('user');
}