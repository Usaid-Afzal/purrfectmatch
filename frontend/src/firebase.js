import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getAuth } from 'firebase/auth';


const firebaseConfig = {
    apiKey: "AIzaSyBN5okbgMVwB3fHOnNLqf-TREbdTh3Bm0k",
    authDomain: "purrfectmatch-chat.firebaseapp.com",
    projectId: "purrfectmatch-chat",
    storageBucket: "purrfectmatch-chat.firebasestorage.app",
    messagingSenderId: "692188913943",
    appId: "1:692188913943:web:bffebb0cb2c2bf9fb25752",
    measurementId: "G-S4D5R0WLRV"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getDatabase(app);