const localServer = 'http://192.168.1.10:2412';
const cloudServer = 'https://orderingserver-1.onrender.com';
const ApiServer = cloudServer;

export const fetchItemByCategory = `${ApiServer}/mobile/fetchItemsByCategory`;
export const fetchAllTables = `${ApiServer}/mobile/fetchAllTables`;

export const createUser = `${ApiServer}/mobile/createUser`;
export const loginUser = `${ApiServer}/mobile/loginUser`;

export const insertOrder = `${ApiServer}/mobile/insertOrder`;
export const getOrderStatus = `${ApiServer}/mobile/getOrderStatus`;