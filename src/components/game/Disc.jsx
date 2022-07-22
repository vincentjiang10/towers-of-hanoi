import React from "react";
import * as THREE from 'three';
import { useTexture } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { useGesture } from "@use-gesture/react";
import { useSpring, a } from "@react-spring/three";
import { isValidMove } from "../../helpers/procedures";

const Disc = ({ gameState, changeGameState, scale, numDiscs, space, towerIndex, position, radius, toUrl, procedure }) => {
  // current tower state
  const towerState = gameState[towerIndex];
  // height of current tower
  const height = scale*(1.2*numDiscs/7)
  // is this the topmost disc?
  const isTop = towerState === undefined ? false : towerState.at(-1) === radius;

  // aspect ratio
  const { size, viewport } = useThree();
  const aspect = size.width / viewport.width * scale;

  // finds nearest tower index (1-indexed)
  const findTowerIndex = (currPos) => {
    let pos = JSON.stringify(currPos);
    pos = pos.substring(1, pos.length-1);
    pos = pos.split(",");
    // use x-coordinate to determine closest tower index
    const x = parseFloat(pos[0]);
    const offset = 8.1;
    return Math.round((x+offset) / space);
  }

  // sets boundaries on index (0 <= index < numTowers)
  const withinBoundary = (index) => 
    index < 0 ? 0 : index >= gameState.length ? gameState.length-1 : index;

  // finds nearest tower position
  const findTower = (currPos) => {
    // finds index (0-indexed)
    let index = withinBoundary(findTowerIndex(currPos) - 1);
    return (index+1)*space - 8.1;
  }

  const [spring, set] = useSpring(() => 
    ({ 
      position: position, 
      rotation: [Math.PI/2, 0, 0], 
      reset: true,
      config: { friction: 20, mass: radius**2} 
    })
  );

  const bind = useGesture({
    onPointerDown: (state) => {
      const event = state.event;
      event.stopPropagation();
      event.target.setPointerCapture(event.pointerId);
    },
    onDrag: ({ movement: [mx, my] }) => {
      // scale
      mx /= aspect;
      my /= aspect;
      // translation
      mx += position[0]
      my -= position[1]
      // is topmost disc in tower?
      isTop && -my <= height && set({
        position: [findTower(spring.position), Math.max(-my, position[1]), 0] 
      });
      // rotation within tower
      const withRotation = () => {set({ rotation: [Math.PI/2, 0, -mx / radius**3 / 5] })};
      // only topmost disc out of tower has no rotation
      isTop && -my > height && isTop ? set({ position: [mx, -my, 0] }) : withRotation();
    },
    onPointerUp: (state) => {
      handlePointerUp(state.event);
    }
  });

  // potential gameState mutation
  const handlePointerUp = (event) => {
    // stop propagation to other components
    event.stopPropagation();
    // convert to 0-indexed
    const to = withinBoundary(findTowerIndex(spring.position) - 1);
    const valid = () => {
      // delays setting new state until after animation
      const delaySet = async (towerIndex, to) => {
        await new Promise(() =>  {
          setTimeout(() => {changeGameState(towerIndex, to)}, 550)
        });
      }
      set({ 
        position: [(to+1)*space - 8.1, -2 - numDiscs/14 + 0.4*(gameState[to].length+1), 0],
        rotation: [Math.PI/2, 0, 0]
      });
      delaySet(towerIndex, to);
    }
    const invalid = () => {
      // TODO: set fading alert message / modal (called from Modal.jsx)
      set({ position: position });
    }
    isValidMove(gameState, procedure, towerIndex, to) ? valid() : invalid();
    // release pointer capture
    event.target.releasePointerCapture(event.pointerId);
  };

  // loading texture maps
  const textureProps = useTexture({
    map: toUrl("map"),
    aoMap: toUrl("ao"),
    metalnessMap: toUrl("metallic"),
    normalMap: toUrl("normal"),
    roughnessMap: toUrl("roughness")
  });

  // setting up circular shape
  const circle = new THREE.Shape();
  circle.moveTo( 0, radius );
  circle.quadraticCurveTo( radius, radius, radius, 0 );
	circle.quadraticCurveTo( radius, -radius, 0, -radius );
	circle.quadraticCurveTo( -radius, -radius, -radius, 0 );
  circle.quadraticCurveTo( -radius, radius, 0, radius );

  // hole
  let hole = new THREE.Path();
  hole.arc(0, 0, 0.30);
  circle.holes.push(hole);

  // extrude props
  const extrudeSettings = {
    steps: 50,
    depth: 0.2,
    bevelEnabled: true,
    bevelThickness: 0.1,
	  bevelSize: 0.1,
	  bevelOffset: 0.05,
	  bevelSegments: 7
  };
  
  // intial disc index (used by Bicolor procedure to set color)
  const discIndex = (numDiscs - 1)*(0.7 - radius)/0.38;
  const round = Math.round(discIndex);
  // add 1 to disc with similar discIndex (to reverse parity, and therefore color)
  const bicolorIndex = Math.abs(round - discIndex) < 0.001 ? round : round+1;

	return (
    <a.mesh {...spring} {...bind()}>
      <extrudeBufferGeometry args={[circle, extrudeSettings]} />
      <meshPhysicalMaterial 
        {...textureProps}  
        color={procedure === 1 ? 
          (bicolorIndex%2 === 0 ? "LightBlue" : "Cyan") : 
          "LightCyan" 
        }
        attach="material" 
      />
    </a.mesh>
  );
}

export default Disc;