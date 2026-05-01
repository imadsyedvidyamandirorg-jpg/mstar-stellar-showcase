import { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, Environment, Float } from "@react-three/drei";
import { Group } from "three";

useGLTF.preload("/models/drone.glb");

const Drone = () => {
  const ref = useRef<Group>(null!);
  const { scene } = useGLTF("/models/drone.glb") as any;

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.getElapsedTime();
    // Gentle hover rotation around Y, slight tilt
    ref.current.rotation.y = Math.sin(t * 0.4) * 0.6;
    ref.current.rotation.z = Math.sin(t * 0.8) * 0.05;
    ref.current.rotation.x = Math.cos(t * 0.6) * 0.05;
  });

  return (
    <Float speed={2} rotationIntensity={0} floatIntensity={1.2} floatingRange={[-0.15, 0.15]}>
      <group ref={ref} scale={0.9} position={[0, -0.2, 0]}>
        <primitive object={scene} />
      </group>
    </Float>
  );
};

const DroneModel = ({ className = "" }: { className?: string }) => {
  return (
    <div className={className}>
      <Canvas
        camera={{ position: [3.5, 1.5, 4.5], fov: 38 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 5, 5]} intensity={1.4} />
        <directionalLight position={[-3, 2, -2]} intensity={0.6} color="#ff3344" />
        <pointLight position={[0, -2, 2]} intensity={0.4} color="#ffffff" />
        <Suspense fallback={null}>
          <Drone />
          <Environment preset="city" />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default DroneModel;
