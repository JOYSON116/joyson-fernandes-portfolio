import { Canvas, useFrame } from "@react-three/fiber";
import { Line, Points, PointMaterial } from "@react-three/drei";
import { useMemo, useRef } from "react";
import * as THREE from "three";
const stages = ["CAMERA", "FACE", "MATCH", "CONFIRM", "RESULT"];
const modes = {
  top: { scale: 1, rotation: 0.08 },
  about: { scale: 0.82, rotation: 0.04 },
  skills: { scale: 0.93, rotation: 0.06 },
  work: { scale: 1.05, rotation: 0.025 },
  journey: { scale: 0.72, rotation: 0.03 },
  achievements: { scale: 0.65, rotation: 0.02 },
  contact: { scale: 0.88, rotation: 0.05 },
};
function Pipeline({ mode }) {
  const root = useRef(),
    signal = useRef();
  const spec = modes[mode] || modes.top;
  const dust = useMemo(
    () =>
      Float32Array.from(
        { length: 90 },
        (_, i) => ((i % 3) - 1.4) * Math.random() * 3.5,
      ),
    [],
  );
  useFrame(({ clock, pointer }) => {
    const t = clock.getElapsedTime();
    if (root.current) {
      root.current.rotation.y = THREE.MathUtils.lerp(
        root.current.rotation.y,
        pointer.x * 0.12 + t * spec.rotation,
        0.025,
      );
      root.current.rotation.x = THREE.MathUtils.lerp(
        root.current.rotation.x,
        pointer.y * 0.09,
        0.025,
      );
      root.current.scale.setScalar(
        THREE.MathUtils.lerp(root.current.scale.x, spec.scale, 0.04),
      );
    }
    if (signal.current) {
      const p = (t * 0.18) % 1;
      signal.current.position.set(
        -1.55 + p * 3.1,
        Math.sin(p * Math.PI) * 0.18,
        0,
      );
      signal.current.scale.setScalar(0.75 + Math.sin(t * 4) * 0.2);
    }
  });
  return (
    <group ref={root}>
      <Line
        points={[
          [-1.55, 0, 0],
          [-0.78, 0.34, 0],
          [0, -0.1, 0],
          [0.78, 0.3, 0],
          [1.55, 0, 0],
        ]}
        color="#778a4d"
        lineWidth={1}
        transparent
        opacity={0.5}
      />
      {stages.map((stage, i) => {
        const x = -1.55 + i * 0.775;
        const y = [0, 0.34, -0.1, 0.3, 0][i];
        const active = mode === "work" || mode === "top";
        return (
          <group key={stage} position={[x, y, 0]}>
            <mesh>
              <sphereGeometry args={[i === 2 ? 0.25 : 0.16, 28, 28]} />
              <meshStandardMaterial
                color={i === 2 ? "#e9efdf" : "#b8e766"}
                emissive="#6f941e"
                emissiveIntensity={active ? 1.25 : 0.4}
                metalness={0.35}
                roughness={0.28}
              />
            </mesh>
            {i === 2 && (
              <mesh scale={1.5}>
                <sphereGeometry args={[0.16, 16, 16]} />
                <meshBasicMaterial
                  color="#beff45"
                  wireframe
                  transparent
                  opacity={0.28}
                />
              </mesh>
            )}
          </group>
        );
      })}
      <mesh ref={signal}>
        <sphereGeometry args={[0.075, 18, 18]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
      <Points positions={dust} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          color="#d4e7aa"
          size={0.014}
          sizeAttenuation
          depthWrite={false}
          opacity={0.48}
        />
      </Points>
    </group>
  );
}
export default function DigitalCore({ mode, className = "" }) {
  return (
    <div
      className={"digital-core " + className}
      aria-label="Conceptual visualisation of the face recognition processing journey"
    >
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 4.2], fov: 42 }}
        gl={{ alpha: true, antialias: true }}
      >
        <ambientLight intensity={0.8} />
        <pointLight
          position={[1, 2, 3]}
          intensity={16}
          color="#d8ff9c"
          distance={7}
        />
        <pointLight
          position={[-2, -1, 2]}
          intensity={4}
          color="#7c88e8"
          distance={6}
        />
        <Pipeline mode={mode} />
      </Canvas>
      <div className="pipeline-labels" aria-hidden="true">
        {stages.map((stage, i) => (
          <span
            key={stage}
            className={mode === "work" && i === 2 ? "active" : ""}
          >
            {String(i + 1).padStart(2, "0")}
            <b>{stage}</b>
          </span>
        ))}
      </div>
    </div>
  );
}
