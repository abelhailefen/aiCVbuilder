// Import the functions you need from the Firebase SDKs
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, User } from "firebase/auth";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getFirestore, doc, setDoc } from "firebase/firestore";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC1JXAQhlQiqICGZJ4btMvC1svtpsmEnNg",
  authDomain: "aicvauth.firebaseapp.com",
  projectId: "aicvauth",
  storageBucket: "aicvauth.firebasestorage.app",
  messagingSenderId: "794376736062",
  appId: "1:794376736062:web:1ae974345d36febfb9306f",
  measurementId: "G-Z90JMR2LPC",
};

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);

// ✅ Initialize Firebase services
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const db = getFirestore(app);

// ✅ Function to create a user document in Firestore
const createUserInFirestore = async (user: User) => {
  if (!user) return;

  const userRef = doc(db, "users", user.uid);
  try {
    await setDoc(userRef, {
      displayName: user.displayName,
      email: user.email,
      photoURL: user.photoURL,
      createdAt: new Date(),
    });
  } catch (error) {
    console.error("Error creating user document:", error);
  }
};

// ✅ Initialize Analytics (only if running in the browser)
let analytics;
if (typeof window !== "undefined") {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  });
}

// ✅ Export everything correctly
export { auth, googleProvider, db, createUserInFirestore, analytics };
