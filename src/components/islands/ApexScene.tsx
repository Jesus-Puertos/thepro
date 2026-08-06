import { useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * Escena 3D decorativa del hero.
 *
 * Toda la geometría se genera en código —chevrons extruidos y un campo de
 * esquirlas—, sin ningún modelo externo. Hay dos `.glb` en `assets/` que
 * deliberadamente no se usan; el porqué está en `THIRD_PARTY_ASSETS.md` §6.
 *
 * Este módulo solo se descarga mediante `import()` desde `HeroExperience.tsx`,
 * así que three.js nunca entra en el bundle inicial.
 */

/** Chevron inspirado en una "A": punta arriba, base abierta. */
function useChevronGeometry(): THREE.ExtrudeGeometry {
  return useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(-1, -0.62);
    shape.lineTo(0, 0.78);
    shape.lineTo(1, -0.62);
    shape.lineTo(0.58, -0.62);
    shape.lineTo(0, 0.16);
    shape.lineTo(-0.58, -0.62);
    shape.closePath();

    const geometry = new THREE.ExtrudeGeometry(shape, {
      depth: 0.16,
      bevelEnabled: true,
      bevelThickness: 0.02,
      bevelSize: 0.02,
      bevelSegments: 1,
      curveSegments: 1,
    });
    geometry.center();
    return geometry;
  }, []);
}

interface ChevronProps {
  geometry: THREE.ExtrudeGeometry;
  scale: number;
  /** Desfase temporal, para que las tres capas no respiren al unísono. */
  phase: number;
  emissive: number;
  opacity: number;
}

/**
 * El chevron se queda en pie, como un logotipo: nunca rota sobre su eje Z.
 * Solo respira — un balanceo mínimo en Y/X, una flotación corta y un pulso de
 * escala— para que la escena esté viva sin convertirse en un molinillo.
 */
function Chevron({ geometry, scale, phase, emissive, opacity }: ChevronProps) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const mesh = ref.current;
    if (!mesh) return;

    const t = clock.elapsedTime;
    mesh.rotation.y = Math.sin(t * 0.3 + phase) * 0.13;
    mesh.rotation.x = Math.sin(t * 0.22 + phase) * 0.045;
    mesh.position.y = Math.sin(t * 0.36 + phase) * 0.05;
    mesh.scale.setScalar(scale * (1 + Math.sin(t * 0.45 + phase) * 0.014));
  });

  return (
    <mesh ref={ref} geometry={geometry} scale={scale}>
      <meshStandardMaterial
        color="#151515"
        metalness={0.88}
        roughness={0.34}
        emissive="#d92d27"
        emissiveIntensity={emissive}
        transparent={opacity < 1}
        opacity={opacity}
      />
    </mesh>
  );
}

const SHARD_COUNT = 22;

/** Campo de esquirlas finas que deriva lentamente al fondo. */
function Shards() {
  const ref = useRef<THREE.InstancedMesh>(null);

  const transforms = useMemo(() => {
    // Semilla fija: la composición es idéntica en cada carga.
    let seed = 7;
    const random = (): number => {
      seed = (seed * 16807) % 2147483647;
      return seed / 2147483647;
    };

    return Array.from({ length: SHARD_COUNT }, () => ({
      position: new THREE.Vector3(
        (random() - 0.5) * 7.5,
        (random() - 0.5) * 5,
        -1.2 - random() * 3.4,
      ),
      rotation: new THREE.Euler(0, 0, (random() - 0.5) * Math.PI),
      scale: 0.16 + random() * 0.42,
      phase: random() * Math.PI * 2,
    }));
  }, []);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame(({ clock }) => {
    const mesh = ref.current;
    if (!mesh) return;

    const t = clock.elapsedTime;
    transforms.forEach((item, index) => {
      dummy.position.set(
        item.position.x,
        item.position.y + Math.sin(t * 0.2 + item.phase) * 0.11,
        item.position.z,
      );
      dummy.rotation.copy(item.rotation);
      // Oscilación mínima: las esquirlas acompañan, no giran.
      dummy.rotation.z += Math.sin(t * 0.09 + item.phase) * 0.07;
      dummy.scale.set(item.scale, item.scale * 0.1, 0.04);
      dummy.updateMatrix();
      mesh.setMatrixAt(index, dummy.matrix);
    });
    mesh.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, SHARD_COUNT]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#1d1d1d" metalness={0.7} roughness={0.5} />
    </instancedMesh>
  );
}

/** Parallax suave siguiendo el puntero, con retorno amortiguado. */
function Rig({ children }: { children: React.ReactNode }) {
  const group = useRef<THREE.Group>(null);
  const { pointer } = useThree();

  useFrame((_, delta) => {
    const node = group.current;
    if (!node) return;

    // Contenido: el chevron ya se balancea por su cuenta y las dos rotaciones
    // se suman. Esto aporta profundidad al mover el ratón, no giro.
    const damping = Math.min(delta * 2.2, 1);
    node.rotation.y += (pointer.x * 0.14 - node.rotation.y) * damping;
    node.rotation.x += (-pointer.y * 0.09 - node.rotation.x) * damping;
  });

  return <group ref={group}>{children}</group>;
}

function Composition() {
  const geometry = useChevronGeometry();

  return (
    <Rig>
      <Chevron geometry={geometry} scale={1.15} phase={0} emissive={0.5} opacity={1} />
      <Chevron geometry={geometry} scale={1.85} phase={1.1} emissive={0.16} opacity={0.72} />
      <Chevron geometry={geometry} scale={2.7} phase={2.3} emissive={0.05} opacity={0.4} />
      <Shards />
    </Rig>
  );
}

export default function ApexScene() {
  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ position: [0, 0.35, 5.2], fov: 38 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      // Sin sombras: coste alto y aquí no aportan nada visible.
      shadows={false}
      style={{ width: '100%', height: '100%' }}
    >
      <ambientLight intensity={0.38} />
      {/* Luz roja lateral: el color de acción de la marca. */}
      <directionalLight position={[-4.5, 1.6, 3]} intensity={3.4} color="#d92d27" />
      {/* Rim light dorada: el acento "Prime". */}
      <pointLight position={[3.6, 2.6, 1.8]} intensity={22} distance={14} color="#d6a62c" />
      {/* Relleno frío muy tenue para que el metal no se apague del todo. */}
      <pointLight position={[0, -2.4, 4]} intensity={9} distance={12} color="#f1efe8" />

      <Composition />
    </Canvas>
  );
}
