import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAKdAf6vjSySCWcCL2FNZnX9hng7yWw96E",
  authDomain: "towers-of-hanoi-4d72b.firebaseapp.com",
  projectId: "towers-of-hanoi-4d72b",
  storageBucket: "towers-of-hanoi-4d72b.appspot.com",
  messagingSenderId: "508016343685",
  appId: "1:508016343685:web:54dcf715ef4881223847ec",
  measurementId: "G-4DEHTYD4W9"
};

// initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);