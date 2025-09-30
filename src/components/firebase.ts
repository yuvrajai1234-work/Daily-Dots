// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCF7NShzw6d-NEBbmyaIQo_HUg8iYWkrjg",
  authDomain: "dailydots-ac408.firebaseapp.com",
  projectId: "dailydots-ac408",
  storageBucket: "dailydots-ac408.firebasestorage.app",
  messagingSenderId: "218983838677",
  appId: "1:218983838677:web:e123dcd38137ab8740c35c",
  measurementId: "G-1N71YEZFY5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);