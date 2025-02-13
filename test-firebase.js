import { initializeApp } from 'firebase/app';
import { getDatabase, ref, get } from 'firebase/database';

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

async function testFirebaseConnection() {
  try {
    console.log('Initializing Firebase...');
    const app = initializeApp(firebaseConfig);
    const database = getDatabase(app);
    
    console.log('Testing connection...');
    // Test connection by trying to read from root
    const dbRef = ref(database, '/');
    const snapshot = await get(dbRef);

    console.log('Connection test result:');
    console.log('------------------------');
    console.log('✓ Successfully connected to Firebase!');
    console.log('Data available:', snapshot.exists() ? 'Yes' : 'No');
    if (snapshot.exists()) {
      console.log('Data:', snapshot.val());
    }
    
  } catch (error) {
    console.error('✗ Error connecting to Firebase:');
    console.error(error);
  } finally {
    process.exit();
  }
}

testFirebaseConnection();