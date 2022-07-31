import React, { useState } from "react";
import "../styles/App.css";
import Sidebar from "./Sidebar"

function App() {
  const images = ["beach", "bubbles", "desert", "ice", "lake", "mountains", "purple", "space", "stars", "vibrant"];
  const [image, setImage] = useState(Math.floor(images.length * Math.random()));
  const [modal, setModal] = useState(true);

  return (
    <div className="background" style={{ 
      backgroundImage: `url(${process.env.PUBLIC_URL}/assets/images/${images[image]}.jpg)`,
      backgroundSize: "cover"}}>
      <div className="overlay" style={{ display: modal ? "block" : "none" }}/>
      <div className="sidebar"> 
        <Sidebar 
          images={images} 
          onBackgroundChange={(index) => setImage(index)}
          setModal={setModal}
        />
      </div>
    </div>
  );
}

export default App;