import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "real-estate-app-7da91.firebaseapp.com",
  projectId: "real-estate-app-7da91",
  storageBucket: "real-estate-app-7da91.appspot.com",
  messagingSenderId: "921376341519",
  appId: "1:921376341519:web:53e11d65475b8799dead7a",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
