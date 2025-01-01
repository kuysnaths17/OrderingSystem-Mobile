const localServer = 'http://192.168.1.10:2412';
const cloudServer = '';
const ApiServer = localServer;

export const fetchItemByCategory = `${ApiServer}/mobile/fetchItemsByCategory`;
export const fetchAllTables = `${ApiServer}/mobile/fetchAllTables`;

export const createUser = `${ApiServer}/mobile/createUser`;
export const loginUser = `${ApiServer}/mobile/loginUser`;

export const insertOrder = `${ApiServer}/mobile/insertOrder`;