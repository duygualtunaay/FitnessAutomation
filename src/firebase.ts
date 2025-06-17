import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";


const firebaseConfig = {
    apiKey: "AIzaSyACdxsrBAMiCc3KGtjcnUQRg2DOmjiDFd4",
    authDomain: "fitnessautomation-99449.firebaseapp.com",
    projectId: "fitnessautomation-99449",
    storageBucket: "fitnessautomation-99449.firebasestorage.app",
    messagingSenderId: "217777801567",
    appId: "1:217777801567:web:03c2b86c602a207b3dceea",
    measurementId: "G-FH89WGMYXQ"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];


export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);