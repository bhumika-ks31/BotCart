// src/utils/Firebase.js

import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// ✅ Firebase config from .env
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: "loginbotcart.firebaseapp.com",
  projectId: "loginbotcart",
  storageBucket: "loginbotcart.appspot.com",
  messagingSenderId: "197185428720",
  appId: "1:197185428720:web:296c30234ca43026893635",
  measurementId: "G-M75CRVRR04"
};

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider };
