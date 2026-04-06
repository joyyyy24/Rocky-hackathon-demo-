import { useRef } from "react";
import { Mesh } from "three";

export function WorldEnvironment() {
  const groundRef = useRef<Mesh>(null);

  return (
    <mesh ref={groundRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
      <planeGeometry args={[20, 20]} />
      <meshStandardMaterial color="#90EE90" />
    </mesh>
  );
}
