import { initializeApp } from "firebase/app";
import { getFirestore, getDoc, doc, setDoc } from "firebase/firestore";
import { 
  getAuth, 
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from "firebase/auth";

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

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

const provider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
  signInWithPopup(auth, provider)
    .then(async (cred) => {
      const userDocRef = doc(db, "users", cred.user.uid);
      const userDocSnap = await getDoc(userDocRef);
      userDocSnap.exists() || 
      // initialize document if it doesn't exist
      setDoc(userDocRef, {
        standard: [],
        bicolor: [],
        adjacent: []
      });
    })
    .catch((error) => {
      console.log(error);
    });
}

export const signOutOfGoogle = () => {
  signOut(auth);
}