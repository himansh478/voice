import React, {useLayoutEffect, useRef} from 'react';
import * as THREE from 'three';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import {ramp, seeded} from '../motion';

type Objects = {
  renderer: THREE.WebGLRenderer;
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  core: THREE.Mesh;
  wire: THREE.Mesh;
  rings: THREE.Group;
  points: THREE.Points;
  network: THREE.LineSegments;
};

export const ThreeCore: React.FC<{variant?: 'core' | 'ecosystem'; height?: number; top?: number}> = ({variant = 'core', height = 1260, top = 150}) => {
  const mount = useRef<HTMLDivElement>(null);
  const objects = useRef<Objects | null>(null);
  const frame = useCurrentFrame();
  const {width} = useVideoConfig();

  useLayoutEffect(() => {
    if (!mount.current || objects.current) return;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    const renderer = new THREE.WebGLRenderer({antialias: true, alpha: true, preserveDrawingBuffer: true, powerPreference: 'high-performance'});
    renderer.setSize(width, height);
    renderer.setPixelRatio(1);
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    mount.current.appendChild(renderer.domElement);

    const eco = variant === 'ecosystem';
    const geometry = eco ? new THREE.SphereGeometry(2.05, 32, 24) : new THREE.IcosahedronGeometry(2.05, 2);
    const material = new THREE.MeshPhysicalMaterial({
      color: eco ? 0x142f53 : 0x245d79,
      metalness: eco ? 0.55 : 0.78,
      roughness: eco ? 0.3 : 0.2,
      clearcoat: 0.8,
      clearcoatRoughness: 0.18,
      emissive: eco ? 0x071b34 : 0x062b38,
      emissiveIntensity: 0.65,
      flatShading: !eco,
      transparent: true,
      opacity: eco ? 0.92 : 1,
    });
    const core = new THREE.Mesh(geometry, material);
    scene.add(core);
    const wire = new THREE.Mesh(geometry.clone(), new THREE.MeshBasicMaterial({color: eco ? 0x55dfff : 0xd7ff4f, wireframe: true, transparent: true, opacity: eco ? 0.22 : 0.18}));
    wire.scale.setScalar(1.012);
    scene.add(wire);

    const rings = new THREE.Group();
    [2.85, 3.4, 4.05].forEach((radius, i) => {
      const torus = new THREE.Mesh(
        new THREE.TorusGeometry(radius, i === 0 ? 0.035 : 0.018, 8, 160),
        new THREE.MeshStandardMaterial({color: i === 1 ? 0xd7ff4f : 0x55dfff, emissive: i === 1 ? 0x38410b : 0x083d4c, metalness: 0.8, roughness: 0.25, transparent: true, opacity: 0.75 - i * 0.15}),
      );
      torus.rotation.set(0.75 + i * 0.43, 0.2 + i * 0.7, i * 0.8);
      rings.add(torus);
    });
    scene.add(rings);

    const positions = new Float32Array(420 * 3);
    for (let i = 0; i < 420; i++) {
      const radius = 3.1 + seeded(i * 4) * 5.7;
      const theta = seeded(i * 4 + 1) * Math.PI * 2;
      const phi = Math.acos(2 * seeded(i * 4 + 2) - 1);
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);
    }
    const pointsGeometry = new THREE.BufferGeometry();
    pointsGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const points = new THREE.Points(pointsGeometry, new THREE.PointsMaterial({color: eco ? 0x8fe9ff : 0xd7ff4f, size: 0.025, transparent: true, opacity: 0.62, sizeAttenuation: true}));
    scene.add(points);

    const linePositions: number[] = [];
    const sphereNodes: THREE.Vector3[] = [];
    for (let i = 0; i < 52; i++) {
      const y = 1 - (i / 51) * 2;
      const radius = Math.sqrt(1 - y * y);
      const theta = Math.PI * (3 - Math.sqrt(5)) * i;
      sphereNodes.push(new THREE.Vector3(Math.cos(theta) * radius, y, Math.sin(theta) * radius).multiplyScalar(2.1));
    }
    sphereNodes.forEach((node, i) => {
      [i + 1, i + 3].forEach((j) => {
        if (j < sphereNodes.length) linePositions.push(node.x,node.y,node.z,sphereNodes[j].x,sphereNodes[j].y,sphereNodes[j].z);
      });
    });
    const networkGeometry = new THREE.BufferGeometry();
    networkGeometry.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
    const network = new THREE.LineSegments(networkGeometry, new THREE.LineBasicMaterial({color: 0x55dfff, transparent: true, opacity: eco ? 0.42 : 0.08}));
    scene.add(network);

    scene.add(new THREE.AmbientLight(0x8eaaff, 1.1));
    const key = new THREE.DirectionalLight(0xc9f5ff, 5.5); key.position.set(4, 6, 6); scene.add(key);
    const rim = new THREE.PointLight(0xd7ff4f, 70, 20); rim.position.set(-4, 1, 3); scene.add(rim);
    const fill = new THREE.PointLight(0x866dff, 55, 18); fill.position.set(4, -3, 1); scene.add(fill);
    objects.current = {renderer, scene, camera, core, wire, rings, points, network};

    return () => {
      renderer.dispose();
      geometry.dispose(); material.dispose(); pointsGeometry.dispose(); networkGeometry.dispose();
      renderer.domElement.remove();
      objects.current = null;
    };
  }, [height, variant, width]);

  useLayoutEffect(() => {
    const o = objects.current;
    if (!o) return;
    const t = frame / 30;
    const eco = variant === 'ecosystem';
    const enter = eco ? ramp(frame, 2.35, 4.65, 0.12, 1) : ramp(frame, 0, 0.9, 0.15, 1);
    o.core.scale.setScalar(enter);
    o.wire.scale.setScalar(enter * 1.012);
    o.network.scale.setScalar(enter * 1.015);
    o.core.rotation.set(t * 0.12, t * (eco ? 0.22 : 0.35), t * 0.05);
    o.wire.rotation.copy(o.core.rotation);
    o.network.rotation.copy(o.core.rotation);
    o.rings.rotation.set(t * 0.07, t * 0.15, -t * 0.06);
    o.rings.scale.setScalar(eco ? ramp(frame, 2.55, 4.7, 0.08, 1) : ramp(frame, 0.15, 1.3, 0.4, 1));
    (o.points.material as THREE.PointsMaterial).opacity = eco ? ramp(frame, 2.5, 4.5, 0.05, 0.62) : 0.62;
    o.points.rotation.y = -t * 0.035;
    o.points.rotation.x = t * 0.012;
    const cameraP = ramp(frame, 0, eco ? 5.5 : 6.1);
    o.camera.position.set(Math.sin(t * 0.16) * (eco ? 0.8 : 1.4), eco ? 0.3 + cameraP * 0.45 : Math.sin(t * 0.22) * 0.5, (eco ? 10.8 : 9.4) - cameraP * (eco ? 2.3 : 2.5));
    o.camera.lookAt(0, 0, 0);
    o.renderer.render(o.scene, o.camera);
  }, [frame, variant]);

  return <div ref={mount} style={{position: 'absolute', width, height, top, left: 0, pointerEvents: 'none'}} />;
};
