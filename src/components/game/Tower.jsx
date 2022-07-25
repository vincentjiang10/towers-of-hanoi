import React from "react";
import { useTexture } from "@react-three/drei";

// Tower component to be rendered and used in GameLogic
const Tower = ({ position, toUrl, numDisks }) => {
  // loading texture maps
  const textureProps = useTexture({
    map: toUrl("map"),
    aoMap: toUrl("ao"),
    metalnessMap: toUrl("metallic"),
    normalMap: toUrl("normal"),
    roughnessMap: toUrl("roughness")
  });

  return (
    <group>
      <mesh position={position}>
        <cylinderBufferGeometry args={[0.15, 0.15, 1.2 + 2.4*numDisks/7]} />
        <meshPhysicalMaterial {...textureProps} roughness={1} attach="material" />
      </mesh>
      <mesh position={position.map((x,i) => i === 1 ? x-1 - numDisks/14 : x)}>
        <cylinderBufferGeometry args={[0.9, 1, 0.2, 50]} />
        <meshPhysicalMaterial {...textureProps} roughness={1} attach="material" />
      </mesh>
    </group>
  );
}

export default Tower;