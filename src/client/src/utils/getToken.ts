import LocalForageProvider from "./localforage";

const getToken = async (): Promise<string | undefined> => {
  try {
    const token = await LocalForageProvider.getAuthToken();

    return token;
  } catch (error) {
    console.error("Error fetching token:", error);
    return null;
  }
};

export default getToken;
