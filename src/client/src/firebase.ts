import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import {getMessaging} from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyDhjjVtYMqQ06Etm_UpXz2AJcNt0Iev5no",
  authDomain: "frontierscabal-60fc0.firebaseapp.com",
  projectId: "frontierscabal-60fc0",
  storageBucket: "frontierscabal-60fc0.appspot.com",
  messagingSenderId: "906918820628",
  appId: "1:906918820628:web:80d2faf389a5e6cc9de001",
  measurementId: "G-GFK3K092CB"
};


export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const messaging = getMessaging(app)