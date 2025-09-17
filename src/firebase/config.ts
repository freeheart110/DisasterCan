import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { initializeAuth } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Workaround: Import getReactNativePersistence using require to avoid TS error
const { getReactNativePersistence } = require('firebase/auth');

const firebaseConfig = {
  apiKey: "AIzaSyCySmTTnFoKviqX7qRlwovNKwp7Pu0Bl64",
  authDomain: "disastercan-e27b4.firebaseapp.com",
  projectId: "disastercan-e27b4",
  storageBucket: "disastercan-e27b4.appspot.com",
  messagingSenderId: "180585567267",
  appId: "1:180585567267:web:034b6ef26dd5fcf2cb4d96",
  measurementId: "G-S04PF3XCK7"
};

const app = initializeApp(firebaseConfig);

const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

const db = getFirestore(app);

export { app, auth, db };