import React from "react";
import * as THREE from 'three';
import { useTexture } from "@react-three/drei";

// Tower component to be rendered and used in GameLogic
const Tower = ({ position, toUrl, numDisks }) => {
  // loading texture maps with error handling
  const textureProps = useTexture({
    map: toUrl("map"),
    aoMap: toUrl("ao"),
    metalnessMap: toUrl("metallic"),
    normalMap: toUrl("normal"),
    roughnessMap: toUrl("roughness")
  }, (textures) => {
    // Ensure textures are properly loaded
    Object.entries(textures).forEach(([key, texture]) => {
      console.log(`Loading texture: ${key}`);
      texture.needsUpdate = true;
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.minFilter = THREE.LinearFilter;
      texture.magFilter = THREE.LinearFilter;
    });
  }, (error) => {
    console.error('Error loading textures:', error);
  });

  const materialProps = {
    map: textureProps.map,
    color: "#ffffff",
    roughness: 0.3,
    metalness: 0.2,
    emissive: "#000000",
    emissiveIntensity: 0,
    attach: "material"
  };

  return (
    <group>
      <mesh position={position}>
        <cylinderGeometry args={[0.15, 0.15, 1.2 + 2.4 * numDisks / 7]} />
        <meshStandardMaterial {...materialProps} />
      </mesh>
      <mesh position={position.map((x, i) => i === 1 ? x - 1 - numDisks / 14 : x)}>
        <cylinderGeometry args={[0.9, 1, 0.2, 50]} />
        <meshStandardMaterial {...materialProps} />
      </mesh>
    </group>
  );
}

export default Tower;