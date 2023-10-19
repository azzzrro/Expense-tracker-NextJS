// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBlinP4OKeZSEOWusffjQrBxJXdMg9RerY",
  authDomain: "expense-tracker-409ce.firebaseapp.com",
  projectId: "expense-tracker-409ce",
  storageBucket: "expense-tracker-409ce.appspot.com",
  messagingSenderId: "435373115986",
  appId: "1:435373115986:web:b5e9f14a420c13db5b6d8b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app)