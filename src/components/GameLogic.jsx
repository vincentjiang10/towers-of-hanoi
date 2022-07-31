import React, { useState, useRef, useEffect } from "react";
import useSound from "use-sound";
import { Canvas } from "@react-three/fiber";
import { FaChevronUp, FaChevronDown } from "react-icons/fa";
import { PerspectiveCamera } from "@react-three/drei";
import { winCondition } from "../helpers/procedures";
import getAnimationSteps from "../helpers/animation";
import Disk from "./game/Disk";
import Tower from "./game/Tower";

const GameLogic = ({ 
  procedure, 
  numTowers, 
  numDisks, 
  source, 
  destination, 
  texture, 
  animate, 
  setAnimate,
  playRate, 
  currStep,
  setCurrStep,
  setNumMoves,
  forward
}) => {
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
  // initial disk state (ordered least to small)
  const initDisks = [...Array(numDisks)].map((_, index) => 0.7-0.38*index/(numDisks-1));
  // animationSteps will be an array containing steps in the form [from, to] 
  const animationSteps = useRef([[]]);
  // set to 0 on pause and increments by one after each animation step when playing
  const animationIndex = useRef(0);
  // used when !animate and steping through animationSteps
  const animationStepsCopy = useRef([[]]);
  // stores previous move 
  const prevMove = useRef("");
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

  // click sound effect played upon sidebar state change
  useEffect(() => {numRenders.current++}, [gameState]);
  useEffect(() => {numRenders.current < 4 || click()}, [procedure, texture, animate, click]);
  useEffect(() => {currStep <= 0 || click()}, [currStep, click]);

  // resets gameState
  useEffect(() => {
    setGameState(initGameState);
    animationStepsCopy.current = getAnimationSteps(procedure, initGameState, initDisks, source, destination);
    setNumMoves(Math.max(animationStepsCopy.current.length - 1, 0));
  }, [numDisks, source, numTowers, procedure]);

  // updates animationStepsCopy on destination change
  useEffect(() => {
    animationStepsCopy.current = getAnimationSteps(procedure, initGameState, initDisks, source, destination);
    setNumMoves(Math.max(animationStepsCopy.current.length - 1, 0));
  }, [destination])

  // gameState mutation effects
  useEffect(() => {
    // update animation information
    if (!animate) {
      console.log(JSON.stringify(gameState));
      animationSteps.current = getAnimationSteps(procedure, gameState, initDisks, source, destination);
    }
    else {
      animationIndex.current++;
      animationStepsCopy.current = getAnimationSteps(procedure, gameState, initDisks, source, destination);
      animationStepsCopy.current.shift();
      setNumMoves(Math.max(animationStepsCopy.current.length - 1, 0));
    }
    // TODO: import from Modal.jsx
    const winModal = () => {

    }
    // checking for win condition
    winCondition(procedure, numDisks, gameState[source], gameState[destination]) ? 
      winSound() && winModal() : 
      (animate && animationIndex.current <= 2) || numRenders.current < 5 || sound();
  }, [gameState, destination]);

  // solution animation
  useEffect(() => {
    if (!animate) animationIndex.current = 0;
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
    setAnimate(false);
    setScreenWidth(window.innerWidth);
    setScreenHeight(window.innerHeight);
  }

  // --- Methods passed as Disk props ---
  // gameState mutation (called by Disk components)
  const changeGameState = (from, to, update) => {
    // identity
    const newState = gameState.map(x => x);
    const radius = newState[from].pop();
    newState[to].push(radius);
    if (update) {
      animationStepsCopy.current = getAnimationSteps(procedure, newState, initDisks, source, destination);
      setNumMoves(Math.max(animationStepsCopy.current.length - 1, 0));
      setCurrStep(currStep === 0 ? -1 : 0);
    }
    setGameState(newState);
  }

  // path to load texture maps
  const toUrl = (type) => `${process.env.PUBLIC_URL}/assets/textures/${texture}/${type}.png`;
  
  // --- Animation ---
  const indexShift = forward ? 0 : 1; // differentiate between forward and backward moves
  const animationStep = animate ? 
    animationSteps.current[animationIndex.current] : 
    animationStepsCopy.current[currStep + indexShift] 
  // serves as a unique id for a valid move
  const moveAsString = JSON.stringify(animationStep + indexShift + currStep);
  const initialMove = prevMove.current !== moveAsString && currStep !== 0; // checks for initial move; prevents perpetual rendering
  // current animation step
  const from = animationStep && (animate || initialMove) ? animationStep[animate ? 0 : indexShift] : -1;
  let to = animationStep && (animate || initialMove) ? animationStep[animate ? 1 : 1 - indexShift] : -1;
  if (from === to && !animate) to = -1;
  prevMove.current = moveAsString;

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
                    animateTo={diskIndex === tower.length-1 && towerIndex === from ? to : -1}
                    scale={scale}
                    numDisks={numDisks}
                    space={space}
                    towerIndex={towerIndex}
                    position={[width(-8.1, towerIndex), -2 - numDisks/14 + 0.4*(diskIndex+1), 0]}
                    radius={radius}
                    toUrl={toUrl}
                    procedure={procedure}
                    click={click}
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
    </>
  );
}

export default GameLogic;