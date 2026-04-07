"use client";
import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { OrbitControls, Float, Edges, Trail, Sparkles, Html } from '@react-three/drei';
import { MotionValue, useTransform, motion } from 'framer-motion';
import * as THREE from 'three';

// CSS variables fail in ThreeJS basic materials. These MUST be raw Hex codes.
const BG_COLOR = "#003645"; // Deep Sea
const STROKE_COLOR = "#faf8ef"; // Ivory Oasis
const CYAN_COLOR = "#29c8c1"; // Sky Mist
const RED_COLOR = "#f43a4f"; // Scorched Rose

function TurbineModel({ mwValue, isMobile, isHovered }: { mwValue: MotionValue<number>, isMobile: boolean, isHovered: boolean }) {
  const logoTexture = useLoader(THREE.TextureLoader, '/worley-imprint.svg');
  const bladesRef = useRef<THREE.Group>(null);
  const gearsRef = useRef<THREE.Group>(null);
  const turbineRootRef = useRef<THREE.Group>(null);
  const motorGradientRef = useRef<THREE.MeshBasicMaterial>(null);
  const structuralGroup = useRef<THREE.Group>(null);
  const accumulatedPhase = useRef(0);

  const redIntensity = useTransform(mwValue, [7, 10], [0.2, 1.0]);

  // Independent vector tracking enables smooth mechanical realignment back to base zero
  const pointerTrack = useRef({ x: 0, y: 0 });
  const permanentPhaseOffset = useRef(0); // Bakes abandoned rotational momentum permanently to prevent backwards snap-back

  useFrame((state, delta) => {
    const mwToRender = mwValue.get();
    // Target speeds dynamically generated: 
    // 8 MW = 1 rotation / 4s => Math.PI / 2 rads per sec
    // 10 MW = 1 rotation / 2s => Math.PI rads per sec
    // Using linear formula: y = m(x - 8) + c  -->  (PI/4)*(mw - 8) + PI/2
    const clampedMW = Math.max(7, Math.min(10, mwToRender));
    const targetVelocity = (Math.PI / 4) * (clampedMW - 8) + (Math.PI / 2);
    
    // Accumulate the rotational phase mathematically based on delta time
    const rotationIncrement = targetVelocity * delta;
    accumulatedPhase.current += rotationIncrement;

    // Apply the absolute phase straight to the Z-axis of the physical parts
    if (bladesRef.current) {
        bladesRef.current.rotation.z = -accumulatedPhase.current;
    }
    if (gearsRef.current) {
        gearsRef.current.rotation.z = -accumulatedPhase.current * 2.5;
    }

    if (motorGradientRef.current) {
      motorGradientRef.current.opacity = redIntensity.get();
    }
    
    // Desktop Tracking - Anchor at the base and swing the entire tower like a joystick! 
    if (!isMobile && turbineRootRef.current) {
      
      // If the mouse is physically engaged in the frame, aggressively follow the coordinates.
      // If abandoned, mechanically drift the internal mathematical tracking back to absolute zero (vertical center)
      if (isHovered) {
         pointerTrack.current.x = THREE.MathUtils.lerp(pointerTrack.current.x, state.pointer.x, 0.1);
         pointerTrack.current.y = THREE.MathUtils.lerp(pointerTrack.current.y, state.pointer.y, 0.1);
      } else {
         const oldX = pointerTrack.current.x;
         pointerTrack.current.x = THREE.MathUtils.lerp(pointerTrack.current.x, 0, 0.03);
         pointerTrack.current.y = THREE.MathUtils.lerp(pointerTrack.current.y, 0, 0.03);
         
         // Harvest the collapsing horizontal X tracking coordinate and permanently inject it into the constant phase engine!
         // This literally guarantees that as the pointer resets to 0, the tower NEVER rotates backward. It just keeps gracefully spinning forward from its exact abandoned angle!
         const xLoss = oldX - pointerTrack.current.x;
         permanentPhaseOffset.current += xLoss * 0.8;
      }

      // Create a smooth continuous baseline rotation like OrbitControls autoRotate (Slowed 10% per user request)
      const absoluteAutoRotate = state.clock.getElapsedTime() * 0.22;
      
      // Pointer offset gives the user interactive localized control over the continuous rotation
      const targetYaw = absoluteAutoRotate + (pointerTrack.current.x * 0.8) + permanentPhaseOffset.current; 
      const targetPitch = pointerTrack.current.y * -0.08; // Structural pitch centers effortlessly to 0 when abandoned
      const targetRoll = pointerTrack.current.x * -0.04; 
      
      turbineRootRef.current.rotation.y += (targetYaw - turbineRootRef.current.rotation.y) * 0.08;
      turbineRootRef.current.rotation.x += (targetPitch - turbineRootRef.current.rotation.x) * 0.08;
      turbineRootRef.current.rotation.z += (targetRoll - turbineRootRef.current.rotation.z) * 0.08;
    }
  });

  const scale = isMobile ? 1.1 : 1.35;
  const posY = isMobile ? -2.2 : -3.8;

  return (
    // Attach the ref directly to the master root structure. The 0,0,0 local origin maps flawlessly to the floor socket!
    <group ref={turbineRootRef} position={[0, posY, 0]} scale={scale}>
      {/* High speed air speckles floating off the whole structure - heavily intensified per user request */}
      <Sparkles count={150} scale={[8, 8, 10]} position={[0, 4, 0]} size={3.5} speed={0.8} noise={0.2} color={CYAN_COLOR} opacity={0.65} />

      {/* Tower - Made translucent so the HUD trunk line glows through from behind */}
      <mesh position={[0, 2.0, 0]}>
        <cylinderGeometry args={[0.25, 0.45, 4.0, 16]} />
        <meshBasicMaterial color={BG_COLOR} transparent opacity={0.65} />
        <Edges color={STROKE_COLOR} threshold={15} />
      </mesh>

      {/* Tower Base Socket */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.6, 0.8, 0.4, 16]} />
        <meshBasicMaterial color={BG_COLOR} transparent opacity={0.65} />
        <Edges color={STROKE_COLOR} threshold={15} />
      </mesh>

      {/* Hub & Nacelle */}
      <group position={[0, 4.2, 0.4]}>

        {/* Nacelle Main Body (Front Half) - Sky Mist */}
        <mesh position={[0, 0, -0.6]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.55, 0.55, 1.2, 24]} />
          <meshBasicMaterial color={CYAN_COLOR} transparent opacity={0.65} />
          <Edges color={STROKE_COLOR} />
        </mesh>

        {/* Internal Mechanical Gears inside Nacelle */}
        <group ref={gearsRef} position={[0, 0, -0.6]}>
          <mesh position={[0, 0, 0.2]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.3, 0.3, 0.1, 12]} />
            <meshBasicMaterial color={STROKE_COLOR} wireframe />
          </mesh>
          <mesh position={[0, 0, -0.1]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.4, 0.4, 0.1, 16]} />
            <meshBasicMaterial color={STROKE_COLOR} wireframe />
          </mesh>
        </group>

        {/* Nacelle Main Body (Rear Half) - Scorched Rose Fluctuation */}
        <mesh position={[0, 0, -1.6]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.55, 0.45, 0.8, 24]} />
          <meshBasicMaterial ref={motorGradientRef} color={RED_COLOR} transparent />
          <Edges color={STROKE_COLOR} />
          
          {/* Precision mapped Worley imprint Texture mapped onto a physical Circle Geometry capping the rear cylinder face */}
          <mesh position={[0, -0.402, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[0.26, 32]} />
            <meshBasicMaterial map={logoTexture} transparent opacity={0.9} color="#FFFFFF" />
          </mesh>
        </mesh>

        {/* Nose Dome Bulb */}
        <mesh position={[0, 0, 0.5]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.01, 0.45, 0.6, 24]} />
          <meshBasicMaterial color={CYAN_COLOR} />
          <Edges color={STROKE_COLOR} threshold={15} />
        </mesh>

        {/* Rotating Blades */}
        <group ref={bladesRef} position={[0, 0, 0.3]}>
          {[0, 120, 240].map((angle, i) => (
            <group key={i} rotation={[0, 0, (angle * Math.PI) / 180]}>

              {/* Main Aerodynamic Blade - Smooth transition */}
              <mesh position={[0, 1.4, 0]} scale={[1, 1, 0.25]}>
                <cylinderGeometry args={[0.02, 0.25, 2.6, 16]} />
                <meshBasicMaterial color={BG_COLOR} />
                <Edges color={STROKE_COLOR} threshold={10} />

                {/* Visual Air Movement Trails emitting from the blade tip - Heavily thickened and lengthened */}
                <Trail width={1.2} length={3} color={CYAN_COLOR} attenuation={(t) => t} local={false}>
                  <mesh position={[0, 1.3, 0]}>
                    <boxGeometry args={[0.01, 0.01, 0.01]} />
                    <meshBasicMaterial transparent opacity={0} />
                  </mesh>
                </Trail>
              </mesh>

            </group>
          ))}
        </group>
      </group>
    </group>
  );
}

// Complex Pipeline SVG Overlay
function FlowLines({ mwValue }: { mwValue: MotionValue<number> }) {
  const routeColor = useTransform(mwValue, [7, 9.5], ["#29c8c1", "#f43a4f"]);

  return (
    <div className="absolute inset-0 pointer-events-none z-[-1] flex justify-center items-end opacity-90 overflow-visible">
      {/* Use viewBox to strictly control bounds, and apply a radial mask so the energy vines fade out naturally into the background rather than hard-clipping */}
      <svg
        width="1000"
        height="650"
        viewBox="0 0 1000 650"
        className="absolute bottom-0"
        preserveAspectRatio="xMidYMax slice"
        style={{
          maskImage: 'radial-gradient(circle at 50% 75%, black 10%, transparent 65%)',
          WebkitMaskImage: 'radial-gradient(circle at 50% 75%, black 10%, transparent 65%)'
        }}
      >
        <defs>
          <filter id="neonGlow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <g filter="url(#neonGlow)">
          {/* THE MAIN THICK TRUNK - Dropped origin from 200 to 280 to prevent poking out */}
          <motion.path d="M 500,280 L 500,480" fill="none" strokeWidth="12" stroke={routeColor} />
          <motion.circle cx="500" cy="480" r="15" fill="none" strokeWidth="4" stroke={routeColor} />

          {/* Branches dispersing from the base */}
          <motion.g fill="none" strokeWidth="2" stroke={routeColor} opacity="0.6">
            <path d="M 500,480 C 420,500 200,480 0,550" />
            <path d="M 500,480 C 440,520 250,530 -50,650" />
            <path d="M 500,480 C 460,550 350,560 200,700" />
            <path d="M 500,480 C 480,560 450,600 350,700" />
            <path d="M 500,480 C 500,560 500,600 500,750" />
            <path d="M 500,480 C 520,560 550,600 650,700" />
            <path d="M 500,480 C 540,550 650,560 800,700" />
            <path d="M 500,480 C 560,520 750,530 1050,650" />
            <path d="M 500,480 C 580,500 850,490 1050,580" />
            <path d="M 500,480 C 600,490 700,470 1000,500" />
          </motion.g>
        </g>

        <motion.g fill={routeColor} filter="url(#neonGlow)">
          {Array.from({ length: 10 }).map((_, i) => (
            <circle key={i} r="4">
              <animateMotion dur={`${1.2 + (i * 0.2)}s`} repeatCount="indefinite" begin={`${(i * 0.15) % 1}s`}
                path={[
                  "M 500,280 L 500,480 C 420,500 200,480 0,550",
                  "M 500,280 L 500,480 C 440,520 250,530 -50,650",
                  "M 500,280 L 500,480 C 460,550 350,560 200,700",
                  "M 500,280 L 500,480 C 480,560 450,600 350,700",
                  "M 500,280 L 500,480 C 500,560 500,600 500,750",
                  "M 500,280 L 500,480 C 520,560 550,600 650,700",
                  "M 500,280 L 500,480 C 540,550 650,560 800,700",
                  "M 500,280 L 500,480 C 560,520 750,530 1050,650",
                  "M 500,280 L 500,480 C 580,500 850,490 1050,580",
                  "M 500,280 L 500,480 C 600,490 700,470 1000,500"
                ][i]} />
            </circle>
          ))}
        </motion.g>
      </svg>
    </div>
  );
}

export const Turbine = ({ mwValue }: { mwValue: MotionValue<number> }) => {
  const [isMobile, setIsMobile] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const interactionTimeoutRef = useRef<NodeJS.Timeout>(null);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handlePointerEnter = () => {
    if (interactionTimeoutRef.current) clearTimeout(interactionTimeoutRef.current);
    setIsHovered(true);
  };

  const handlePointerLeave = () => {
    // Inject a 3-second mechanical hold delay before gravity correction engages
    interactionTimeoutRef.current = setTimeout(() => {
      setIsHovered(false);
    }, 3000);
  };

  return (
    <div 
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      className={`relative w-full h-[500px] lg:h-[750px] flex flex-col items-center justify-center ${isMobile ? 'cursor-grab active:cursor-grabbing' : ''}`}
    >
      {/* Background ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-[var(--cyan-primary)] rounded-full blur-[140px] opacity-10 pointer-events-none z-0" />

      {/* 3D Canvas Context */}
      <Canvas camera={{ position: [10, 3, 11], fov: 45 }} style={{ zIndex: 10 }}>
        <ambientLight intensity={1} />
        <React.Suspense fallback={null}>
           <Float speed={1.5} rotationIntensity={0.05} floatIntensity={0.1}>
             <TurbineModel mwValue={mwValue} isMobile={isMobile} isHovered={isHovered} />
           </Float>
        </React.Suspense>
        
        {/* Strictly inject tactile OrbitControls natively back on Mobile grids for swipe functionality! */}
        {isMobile && (
          <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.3} maxPolarAngle={Math.PI / 2.1} minPolarAngle={Math.PI / 3.5} />
        )}
      </Canvas>

      <FlowLines mwValue={mwValue} />
    </div>
  );
}
