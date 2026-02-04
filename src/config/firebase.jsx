// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDgO5doQYJWWPNxqpUXHm6Czt9Ib3RmIzc",
  authDomain: "banking-app-001.firebaseapp.com",
  projectId: "banking-app-001",
  storageBucket: "banking-app-001.firebasestorage.app",
  messagingSenderId: "1093407095182",
  appId: "1:1093407095182:web:2ecf4529c02c4067090cdf",
  measurementId: "G-SQQWJWZ35N"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const auth = getAuth(app)
const firestore = getFirestore(app)
const db = getFirestore(app)

export { analytics, auth, firestore, db}