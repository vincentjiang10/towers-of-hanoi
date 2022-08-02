import React, { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { signInWithGoogle, signOutOfGoogle, auth, db } from "../helpers/firebase";
import { IconContext } from "react-icons";
import { FcGoogle } from "react-icons/fc";
import { FaChevronDown, FaChevronRight } from "react-icons/fa";
import useSound from "use-sound";

const Header = ({ procedure, setNumTowers, setNumDisks, handlePause }) => {
  // clicking sound effect
  const [click] = useSound(`${process.env.PUBLIC_URL}/assets/sounds/click.mp3`);
  const [user, setUser] = useState(auth.currentUser);
  // reference to user document in db
  const [userData, setUserData] = useState([]);
  const [dropDown, setDropDown] = useState(false);

  useEffect(() => {
    // update userData on change to user document
    const userDocRef = user && doc(db, "users", auth.currentUser.uid);
    const unsub = user && onSnapshot(userDocRef, (doc) => {
      setUserData(doc.data());
    });
    user || setUserData(false);
    return () => {user && unsub()};
  }, [user])

  // updates user on auth state change
  onAuthStateChanged(auth, (newUser) => {
    const delaySet = async () => {
      await new Promise(() => {
        setTimeout(() => {
          setUser(newUser);
        }, 0);
      })
    }
    delaySet();
  });

  return (
    <div className="header">
      <img className="headerImage" src={`${process.env.PUBLIC_URL}/favicon.ico`} alt="Logo" />

      <div className="headerText">
        TOWERS OF HANOI
      </div>
      <button className="button"
        onClick={user ? signOutOfGoogle : signInWithGoogle}
      >
        <div className="buttonText">
          <FcGoogle size="1.2em"/>
          <div style={{ padding: "2px 5px" }}>
            {user ? "Sign Out" : "Sign In"}
          </div>
        </div>
      </button>

      <button className="button"
        onClick={() => {
          setDropDown(!dropDown);
          click();
        }}
      >
        <div className="buttonText">
          <div style={{ padding: "2px 5px" }}>
            Levels
          </div>
          <IconContext.Provider value={{ color: "LightSeaGreen", size: "1.3em" }}>
            {dropDown ? <FaChevronDown /> : <FaChevronRight />}
          </IconContext.Provider>
        </div>
      </button>
      
      <Levels 
        userData={userData ? userData[procedure.toLowerCase()] : []} 
        dropDown={dropDown} 
        procedure={procedure}
        setNumTowers={setNumTowers}
        setNumDisks={setNumDisks}
        handlePause={handlePause}
        click={click}
      /> 
    </div>
  )
}

const Levels = ({ 
  userData, 
  dropDown,
  procedure, 
  setNumTowers, 
  setNumDisks,
  handlePause,
  click
}) => {
  let currIndex = -1;
  // array: level[0] = number of disks, level[1] = number of towers, level[2] = number of moves
  let level = [0,0,0];
  // updates level and returns number of moves
  const updateLevel = () => {
    const moves = level[2];
    currIndex++;
    level = !userData || currIndex === userData.length ? [-1, -1] : userData[currIndex]; 
    return moves;
  }
  updateLevel();
  // button style if level completed
  const completedButton = () => {
    return {
      color: "#3d3d3d",
      backgroundColor: "lightseagreen"
    }
  }

  return (
    <div className="levels" 
      style={{ 
        display: "block", 
        transform: dropDown ? "scaleY(1)" : "scaleY(0)",
        opacity: dropDown ? "1" : "0"
      }}
    >
      {/* clickable grid */}
      <div className="levelsGridHoriz">
        Number of Moves Taken
      </div>
      <div className="levelsGrid">
        <div className="levelsGridVert">
          Number of Disks
        </div>
        <div className="levelsGridVertLabels">
          {[...Array(5)].map((_, diskIndex) => 
            <div key={diskIndex}>
              {7 - diskIndex}
            </div>
          )}
        </div>
        <div style={{ display: "grid", padding: "15px 25px 0px 5px", height: "200px", width: "400px" }}>
          {[...Array(5)].map((_, diskIndex) => 
            <div className="levelsGridRow" key={diskIndex} >
              {[...Array(5)].map((_, towerIndex) => 
                <button className="levelsGridButton"
                  key={towerIndex}
                  onClick={() => {
                    click();
                    handlePause();
                    setNumDisks(7-diskIndex);
                    setNumTowers(towerIndex+3);
                  }}
                  style={7-diskIndex !== level[0] || towerIndex+3 !== level[1] ? {} : completedButton()}
                >
                  <div>
                    {
                      7-diskIndex !== level[0] || towerIndex+3 !== level[1] ? 
                      "N/A" :
                      updateLevel()
                    }
                  </div>
                </button>
              )}
            </div>
          )}
        </div>
        {/* procedure (vertical, right) */}
        <div className="levelsGridProcedure">
          <b>{procedure.toUpperCase()}</b>
        </div>
      </div>
      <div className="levelsGridHorizLabels">
        {[...Array(5)].map((_, towerIndex) => 
          <div key={towerIndex}>
            {towerIndex+3}
          </div>
        )}
      </div>
      <div className="levelsGridHoriz">
        Number of Towers
      </div>
    </div>
  );
}

export default Header;