import React, { useState, useRef, useEffect } from "react";
import useSound from "use-sound";
import { Canvas } from "@react-three/fiber";
import { FaChevronUp, FaChevronDown } from "react-icons/fa";
import { PerspectiveCamera } from "@react-three/drei";
import { winCondition } from "../helpers/procedures";
import getAnimationSteps from "../helpers/animation";
import Disk from "./game/Disk";
import Tower from "./game/Tower";

const GameLogic = ({ procedure, numTowers, numDisks, source, destination, texture, animate, playRate }) => {
  // gameState is an array whose elements represent individual tower states
  // maintained as an array, similating stack, of Disk sizes (unique identifier)
  const [gameState, setGameState] = useState([]);
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const [screenHeight, setScreenHeight] = useState(window.innerHeight);
  const path = `${process.env.PUBLIC_URL}/assets/sounds/`;
  const [click] = useSound(`${path}click.mp3`);
  const [winSound] = useSound(`${path}win.mp3`);
  const [sound] = useSound(`${path}${texture}.mp3`);
  const numRenders = useRef(0);
  // animationSteps will be an array containing steps in the form [from, to] 
  const animationSteps = useRef([[]]);
  // set to 0 whenever play is called and increments by one after each animation step when animate === true
  const animationIndex = useRef(0);

  // resets gameState
  useEffect(() => {
    // initial disk state (ordered least to small)
    const initDisks = [...Array(numDisks)].map((_, index) => 0.7-0.38*index/(numDisks-1));
    // initial game state
    const initGameState = [...Array(numTowers)].map((_, index) => 
      index === source ? initDisks : 
      (
        // bicolor procedure check
        procedure === 1 && 
        (source < numTowers-1 ? index === source+1 : index === numTowers-2)
      )
      ? initDisks.map(x => x-0.001) : []
    );
    // TODO dropDown animation
    setGameState(initGameState);
  }, [numDisks, source, numTowers, procedure]);

  // click sound effect played upon sidebar state change
  useEffect(() => {numRenders.current++ < 3 || click()}, 
    [procedure, texture, animate, destination, click]);

  // gameState mutation effects
  useEffect(() => {
    // update animation information
    animate && animationIndex.current++;
    if (!animate) animationSteps.current = getAnimationSteps(procedure, gameState, numDisks, destination);
    // TODO: import from Modal.jsx
    const winModal = () => {

    }
    // checking for win condition
    winCondition(procedure, numDisks, gameState[source], gameState[destination]) ? 
      winSound() && winModal() : 
      (animate && animationIndex.current <= 2) || sound();
  }, [gameState]);

  // solution animation
  useEffect(() => {
    if (!animate) animationIndex.current = 0;
    // if animate, call play() with args of current gameState, else call pause()
    // animate ? play() : pause()
    // calling pause will bring disk back to original position before leave
  }, [animate]);

  // --- Positioning ---
  // spacing
  const space = 17 / (numTowers+1);

  // returns x-coordinate relative to Canvas
  const width = (start, index) => start + space*(index+1);

  // scale factors
  const scale = 1 + 1/20 * (7-numTowers);
  const coef = 60.75*scale*screenHeight/500;

  // offset from screen bottom 
  const bottom = screenHeight/10 - 10*(7-numTowers);
  // offset from screen left
  const leftSource = screenWidth/2 + coef*width(-8.35, source);
  const leftDest = screenWidth/2 + coef*width(-8.35, destination);

  // window resize event listener
  window.onresize = () => {
    setScreenWidth(window.innerWidth);
    setScreenHeight(window.innerHeight);
  }

  // --- Methods passed as Disk props ---
  // gameState mutation (called by Disk components)
  const changeGameState = (from, to) => {
    // identity
    const newState = gameState.map(x => x);
    const radius = newState[from].pop();
    newState[to].push(radius);
    setGameState(newState);
  }

  // path to load texture maps
  const toUrl = (type) => `${process.env.PUBLIC_URL}/assets/textures/${texture}/${type}.png`;
  
  // --- Animation ---
  // current animation step
  const animationStep = animationSteps.current[animationIndex.current];
  const from = animationStep ? animationStep[0] : -1;
  const to = animationStep ? animationStep[1] : -1;

  // display the disks and towers acoording to gameState
  return (
    <>
      <div className="content">
        <Canvas>
          <spotLight position={[30, -20, -20]} intensity={0.8}/>
          <spotLight position={[-30, 20, 20]} intensity={0.8} />
          <spotLight position={[-50, -40, 20]} intensity={0.8} />
          <spotLight position={[50, 40, 20]} intensity={0.8} />          
          <PerspectiveCamera makeDefault fov={45} aspect={0.5} position={[0,0,10]} near={1} far={20} />
          <group scale={scale}>
            {/* initial Tower rendering */
              [...Array(numTowers)].map((_, index) =>
                <Tower
                  key={index}
                  position={[width(-8.1, index), -1, 0]} 
                  toUrl={toUrl}
                  numDisks={numDisks}
                />
              )
            }
          </group>
          {/* Disk rendering (dependent on gameState) */
            gameState.map((tower, towerIndex) => 
              <group key={towerIndex} scale={scale}>
                {tower.map((radius, diskIndex) => 
                  <Disk
                    key={radius}
                    gameState={gameState}
                    changeGameState={changeGameState}
                    playRate={playRate}
                    animateTo={animate && diskIndex === tower.length-1 && towerIndex === from ? to : -1}
                    scale={scale}
                    numDisks={numDisks}
                    space={space}
                    towerIndex={towerIndex}
                    position={[width(-8.1, towerIndex), -2 - numDisks/14 + 0.4*(diskIndex+1), 0]}
                    radius={radius}
                    toUrl={toUrl}
                    procedure={procedure}
                  />
                )}
              </group>
            )
          }
        </Canvas>
      </div>
      {/* labels source and destination tower */ }
      <div className="icon" style={{ color: "LightSeaGreen", bottom: bottom, left: leftSource}}>
        <FaChevronUp size={`${2*coef/60.75}em`}/>
      </div>   
      <div className="icon" style={{ color: "LightSeaGreen", bottom: bottom, left: leftDest}}>
        <FaChevronDown size={`${2*coef/60.75}em`}/>
      </div>
      <div>
        <h4>{JSON.stringify(gameState)}</h4>
      </div>
    </>
  );
}

export default GameLogic;