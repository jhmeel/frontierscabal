import localforage from 'localforage';

class LocalForageProvider {
  static setAuthToken = async (token: string): Promise<void> => {
    if (await localforage.getItem('FC:USER:AUTH:TOKEN')) {
      await localforage.removeItem('FC:USER:AUTHTOKEN');
    }
    await localforage.setItem('FC:USER:AUTH:TOKEN', token);
  };

  static getAuthToken = async (): Promise<string | null> => {
    try {
      const token = await localforage.getItem<string>('FC:USER:AUTH:TOKEN');
      return token;
    } catch (error) {
      console.error('Error while getting auth token:', error);
      return null;
    }
  };

  static removeAuthToken = async (): Promise<void> => {
    await localforage.removeItem('FC:USER:AUTH:TOKEN');
  };

  static setItem = async <T>(key: string, value: T): Promise<T> => {
    if (await localforage.getItem(key)) {
      await localforage.removeItem(key);
    }
    return await localforage.setItem(key, value);
  };

  static removeItem = async (key: string): Promise<void> => {
    return await localforage.removeItem(key);
  };

  static getItem = async <T>(key: string, callBack?: (err: any, value: T) => void): Promise<T | null> => {
    const cb = callBack || function () {};
    return await localforage.getItem<T>(key, cb);
  };
}

export default LocalForageProvider;
