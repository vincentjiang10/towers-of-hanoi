import React, { useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { signInWithGoogle, signOutOfGoogle } from "../helpers/firebase";

// to be placed on the top right
// include Towers of Hanoi title and sign in/out option with dropdown menu (downwards arrow) on the title if on sign in

const Header = () => {
  const auth = getAuth();
  const [user, setUser] = useState(auth.currentUser);
  onAuthStateChanged(auth, (user) => {setUser(user)});

  return (
    <button
      onClick={user ? signOutOfGoogle : signInWithGoogle}>
      {user ? "Sign Out" : "Sign In"}
    </button>
  )
}

export default Header;