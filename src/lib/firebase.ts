
// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  "projectId": "classzen-xii2b",
  "appId": "1:715575242272:web:caf1bc94f03c7ebfa59645",
  "storageBucket": "classzen-xii2b.firebasestorage.app",
  "apiKey": "AIzaSyDzx0Wr7MArFuc0DrSgpyk63XvFo2MRJr4",
  "authDomain": "classzen-xii2b.firebaseapp.com",
  "measurementId": "",
  "messagingSenderId": "715575242272"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
