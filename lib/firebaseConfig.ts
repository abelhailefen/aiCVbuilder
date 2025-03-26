// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getAnalytics, isSupported } from 'firebase/analytics';

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC1JXAQhlQiqICGZJ4btMvC1svtpsmEnNg",
  authDomain: "aicvauth.firebaseapp.com",
  projectId: "aicvauth",
  storageBucket: "aicvauth.firebasestorage.app",
  messagingSenderId: "794376736062",
  appId: "1:794376736062:web:1ae974345d36febfb9306f",
  measurementId: "G-Z90JMR2LPC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);




export const auth = getAuth(app);

export const googleProvider = new GoogleAuthProvider();

let analytics;
if (typeof window !== 'undefined') {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  });
}

export { analytics };