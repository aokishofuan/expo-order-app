// src/firebase.ts
import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyBwno9iYFZ_-_PBNJDci4krZtkDZsWJWlY",
  authDomain: "expo-order-app.firebaseapp.com",
  projectId: "expo-order-app",
  storageBucket: "expo-order-app.firebasestorage.app",
  messagingSenderId: "249730328603",
  appId: "1:249730328603:web:739cf89fd611ac7b9df0be"
}

const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)