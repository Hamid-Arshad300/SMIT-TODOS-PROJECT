import { initializeApp } from "https://www.gstatic.com/firebasejs/13.4.0/firebase-app.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/13.4.0/firebase-analytics.js";
import { getFirestore, collection, getDocs,addDoc,
    deleteDoc,
    doc,
    updateDoc } from 'https://www.gstatic.com/firebasejs/13.4.0/firebase-firestore.js';  
 
  const firebaseConfig = {
    apiKey: "AIzaSyBXWaL7w7uIb9KVfDXI5sUuCWJmyjKPcSg",
    authDomain: "crud-todos-82c09.firebaseapp.com",
    projectId: "crud-todos-82c09",
    storageBucket: "crud-todos-82c09.firebasestorage.app",
    messagingSenderId: "11419809698",
    appId: "1:11419809698:web:b687cb39f40b0dc096a4fb",
    measurementId: "G-P1LQDGTLSP"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);
  const db = getFirestore(app);
  export { collection, getDocs, db, addDoc, deleteDoc, doc, updateDoc}
