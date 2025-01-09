const localServer = 'http://192.168.1.10:2412';
const cloudServer = 'https://orderingsystem-server.onrender.com';
const ApiServer = cloudServer;

export const fetchItemByCategory = `${ApiServer}/mobile/fetchItemsByCategory`;
export const fetchAllTables = `${ApiServer}/mobile/fetchAllTables`;

export const createUser = `${ApiServer}/mobile/createUser`;
export const loginUser = `${ApiServer}/mobile/loginUser`;
export const findUserByEmail = `${ApiServer}/mobile/findUserByEmail`;
export const updatePassword = `${ApiServer}/mobile/updatePassword`;

export const insertOrder = `${ApiServer}/mobile/insertOrder`;
export const getOrderStatus = `${ApiServer}/mobile/getOrderStatus`;