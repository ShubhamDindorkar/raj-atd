// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase, ref, set, get, child } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC47VdDc6rwIclC4QNn6xkyUSf4iAH0D54",
  authDomain: "despu-atd.firebaseapp.com",
  databaseURL: "https://despu-atd-default-rtdb.firebaseio.com",
  projectId: "despu-atd",
  storageBucket: "despu-atd.firebasestorage.app",
  messagingSenderId: "1093972872689",
  appId: "1:1093972872689:web:c4cad3ad6231c9e4eec850",
  measurementId: "G-EDQ2MP2L7T"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const database = getDatabase(app);
