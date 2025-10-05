import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

const Game3D = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const sceneRef = useRef<THREE.Scene | null>(null);
    const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
    const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
    const characterRef = useRef<THREE.Group | null>(null);
    const levelMarkersRef = useRef<THREE.Mesh[]>([]);
    const raycasterRef = useRef(new THREE.Raycaster());
    const mouseRef = useRef(new THREE.Vector2());
    const animationMixersRef = useRef<THREE.AnimationMixer[]>([]);
    
    const [currentLevel, setCurrentLevel] = useState(0);
    const [completedLevels, setCompletedLevels] = useState<Set<number>>(new Set([0]));
    const [showInstructions, setShowInstructions] = useState(true);
    const [showMap, setShowMap] = useState(false);
    
    const levels = [
        new THREE.Vector3(0, 1, 0),
        new THREE.Vector3(-6, 1, -6),
        new THREE.Vector3(6, 1, -6),
        new THREE.Vector3(-6, 1, 6),
        new THREE.Vector3(6, 1, 6)
    ];

    const levelNames = [
        "Home Base",
        "Forest Grove",
        "Mountain Peak",
        "Desert Oasis",
        "Final Challenge"
    ];

    const levelDetails = [
        {
            name: "Home Base",
            description: "Central command tower with red roof",
            features: ["Watch Tower", "Command Flag", "Safe Zone"],
            color: "#4ade80",
            icon: "🏠"
        },
        {
            name: "Forest Grove",
            description: "Lush woodland area with wildlife",
            features: ["6 Ancient Trees", "Mystical Mushrooms", "Hidden Paths"],
            color: "#22c55e",
            icon: "🌲"
        },
        {
            name: "Mountain Peak",
            description: "Rocky terrain with snow patches",
            features: ["Stone Formations", "Snow Drifts", "Crystal Caves"],
            color: "#64748b",
            icon: "⛰️"
        },
        {
            name: "Desert Oasis",
            description: "Water haven in sandy landscape",
            features: ["Palm Trees", "Crystal Water", "Sand Dunes"],
            color: "#f59e0b",
            icon: "🏜️"
        },
        {
            name: "Final Challenge",
            description: "Mystical crystal realm",
            features: ["Purple Crystals", "Energy Rings", "Portal Gate"],
            color: "#8b5cf6",
            icon: "💎"
        }
    ];

    const targetPositionRef = useRef(levels[0]);
    const isDraggingRef = useRef(false);
    const previousMouseRef = useRef({ x: 0, y: 0 });
    const sphericalRef = useRef({ radius: 25, theta: Math.PI / 4, phi: Math.PI / 4 });

    // Create detailed textures
    const createTextures = () => {
        const textureLoader = new THREE.TextureLoader();
        
        // Grass texture
        const grassCanvas = document.createElement('canvas');
        grassCanvas.width = 256;
        grassCanvas.height = 256;
        const grassCtx = grassCanvas.getContext('2d')!;
        grassCtx.fillStyle = '#2d5016';
        grassCtx.fillRect(0, 0, 256, 256);
        
        // Add grass details
        for (let i = 0; i < 100; i++) {
            grassCtx.fillStyle = `hsl(${90 + Math.random() * 20}, 60%, ${20 + Math.random() * 10}%)`;
            grassCtx.fillRect(Math.random() * 256, Math.random() * 256, 2, 4);
        }
        
        const grassTexture = new THREE.CanvasTexture(grassCanvas);
        grassTexture.wrapS = grassTexture.wrapT = THREE.RepeatWrapping;
        grassTexture.repeat.set(4, 4);

        return { grassTexture };
    };

    // Create detailed character
    const createDetailedCharacter = () => {
        const character = new THREE.Group();
        
        // Body with segments
        const bodyGeometry = new THREE.CylinderGeometry(0.25, 0.35, 0.8, 16);
        const bodyMaterial = new THREE.MeshStandardMaterial({ 
            color: 0xff6b35,
            roughness: 0.8,
            metalness: 0.2
        });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.position.y = 0.4;
        character.add(body);

        // Head with detailed features
        const headGeometry = new THREE.SphereGeometry(0.3, 32, 32);
        const headMaterial = new THREE.MeshStandardMaterial({ 
            color: 0xffdbac,
            roughness: 0.9,
            metalness: 0.1
        });
        const head = new THREE.Mesh(headGeometry, headMaterial);
        head.position.y = 0.85;
        character.add(head);

        // Eyes
        const eyeGeometry = new THREE.SphereGeometry(0.05, 16, 16);
        const eyeMaterial = new THREE.MeshStandardMaterial({ color: 0x000000 });
        
        const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
        leftEye.position.set(-0.1, 0.9, 0.25);
        character.add(leftEye);
        
        const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
        rightEye.position.set(0.1, 0.9, 0.25);
        character.add(rightEye);

        // Arms
        const armGeometry = new THREE.CylinderGeometry(0.08, 0.1, 0.6, 16);
        const armMaterial = new THREE.MeshStandardMaterial({ color: 0xff6b35 });
        
        const leftArm = new THREE.Mesh(armGeometry, armMaterial);
        leftArm.position.set(-0.4, 0.5, 0);
        leftArm.rotation.z = 0.3;
        character.add(leftArm);
        
        const rightArm = new THREE.Mesh(armGeometry, armMaterial);
        rightArm.position.set(0.4, 0.5, 0);
        rightArm.rotation.z = -0.3;
        character.add(rightArm);

        // Legs
        const legGeometry = new THREE.CylinderGeometry(0.1, 0.12, 0.6, 16);
        const legMaterial = new THREE.MeshStandardMaterial({ color: 0x4a4a4a });
        
        const leftLeg = new THREE.Mesh(legGeometry, legMaterial);
        leftLeg.position.set(-0.15, -0.1, 0);
        character.add(leftLeg);
        
        const rightLeg = new THREE.Mesh(legGeometry, legMaterial);
        rightLeg.position.set(0.15, -0.1, 0);
        character.add(rightLeg);

        // Hat/helmet
        const hatGeometry = new THREE.ConeGeometry(0.35, 0.2, 16);
        const hatMaterial = new THREE.MeshStandardMaterial({ color: 0x8b4513 });
        const hat = new THREE.Mesh(hatGeometry, hatMaterial);
        hat.position.y = 1.1;
        character.add(hat);

        return character;
    };

    // Create detailed level environments
    const createLevelEnvironment = (scene: THREE.Scene, levelIndex: number, position: THREE.Vector3) => {
        const group = new THREE.Group();
        
        switch (levelIndex) {
            case 0: // Home Base
                // Central tower
                const towerGeometry = new THREE.CylinderGeometry(0.5, 0.8, 3, 8);
                const towerMaterial = new THREE.MeshStandardMaterial({ color: 0x654321 });
                const tower = new THREE.Mesh(towerGeometry, towerMaterial);
                tower.position.set(position.x, position.y + 1.5, position.z);
                scene.add(tower);

                // Roof
                const roofGeometry = new THREE.ConeGeometry(0.8, 1, 8);
                const roofMaterial = new THREE.MeshStandardMaterial({ color: 0x8b0000 });
                const roof = new THREE.Mesh(roofGeometry, roofMaterial);
                roof.position.set(position.x, position.y + 3.5, position.z);
                scene.add(roof);

                // Flag
                const flagPoleGeometry = new THREE.CylinderGeometry(0.02, 0.02, 1.5, 8);
                const flagPoleMaterial = new THREE.MeshStandardMaterial({ color: 0x8b4513 });
                const flagPole = new THREE.Mesh(flagPoleGeometry, flagPoleMaterial);
                flagPole.position.set(position.x, position.y + 4.75, position.z);
                scene.add(flagPole);
                break;

            case 1: // Forest Grove
                // Trees
                for (let i = 0; i < 6; i++) {
                    const angle = (i / 6) * Math.PI * 2;
                    const radius = 2;
                    const treeX = position.x + Math.cos(angle) * radius;
                    const treeZ = position.z + Math.sin(angle) * radius;

                    // Trunk
                    const trunkGeometry = new THREE.CylinderGeometry(0.15, 0.2, 2, 8);
                    const trunkMaterial = new THREE.MeshStandardMaterial({ color: 0x8b4513 });
                    const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
                    trunk.position.set(treeX, position.y + 1, treeZ);
                    scene.add(trunk);

                    // Leaves
                    const leavesGeometry = new THREE.SphereGeometry(0.8, 16, 16);
                    const leavesMaterial = new THREE.MeshStandardMaterial({ color: 0x228b22 });
                    const leaves = new THREE.Mesh(leavesGeometry, leavesMaterial);
                    leaves.position.set(treeX, position.y + 2.5, treeZ);
                    scene.add(leaves);
                }

                // Mushrooms
                for (let i = 0; i < 4; i++) {
                    const mushroomX = position.x + (Math.random() - 0.5) * 3;
                    const mushroomZ = position.z + (Math.random() - 0.5) * 3;

                    const stemGeometry = new THREE.CylinderGeometry(0.05, 0.08, 0.3, 8);
                    const stemMaterial = new THREE.MeshStandardMaterial({ color: 0xf5f5dc });
                    const stem = new THREE.Mesh(stemGeometry, stemMaterial);
                    stem.position.set(mushroomX, position.y + 0.15, mushroomZ);
                    scene.add(stem);

                    const capGeometry = new THREE.SphereGeometry(0.15, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2);
                    const capMaterial = new THREE.MeshStandardMaterial({ color: 0xff4500 });
                    const cap = new THREE.Mesh(capGeometry, capMaterial);
                    cap.position.set(mushroomX, position.y + 0.35, mushroomZ);
                    scene.add(cap);
                }
                break;

            case 2: // Mountain Peak
                // Rocky formations
                for (let i = 0; i < 5; i++) {
                    const rockGeometry = new THREE.DodecahedronGeometry(0.3 + Math.random() * 0.4);
                    const rockMaterial = new THREE.MeshStandardMaterial({ 
                        color: 0x708090,
                        roughness: 0.9
                    });
                    const rock = new THREE.Mesh(rockGeometry, rockMaterial);
                    rock.position.set(
                        position.x + (Math.random() - 0.5) * 4,
                        position.y + Math.random() * 0.5,
                        position.z + (Math.random() - 0.5) * 4
                    );
                    rock.rotation.set(
                        Math.random() * Math.PI,
                        Math.random() * Math.PI,
                        Math.random() * Math.PI
                    );
                    scene.add(rock);
                }

                // Snow patches
                for (let i = 0; i < 8; i++) {
                    const snowGeometry = new THREE.CircleGeometry(0.2 + Math.random() * 0.3, 16);
                    const snowMaterial = new THREE.MeshStandardMaterial({ 
                        color: 0xfffafa,
                        transparent: true,
                        opacity: 0.8
                    });
                    const snow = new THREE.Mesh(snowGeometry, snowMaterial);
                    snow.position.set(
                        position.x + (Math.random() - 0.5) * 4,
                        position.y + 0.01,
                        position.z + (Math.random() - 0.5) * 4
                    );
                    snow.rotation.x = -Math.PI / 2;
                    scene.add(snow);
                }
                break;

            case 3: // Desert Oasis
                // Palm trees
                for (let i = 0; i < 3; i++) {
                    const palmX = position.x + (Math.random() - 0.5) * 3;
                    const palmZ = position.z + (Math.random() - 0.5) * 3;

                    // Trunk
                    const palmTrunkGeometry = new THREE.CylinderGeometry(0.2, 0.25, 3, 8);
                    const palmTrunkMaterial = new THREE.MeshStandardMaterial({ color: 0xdaa520 });
                    const palmTrunk = new THREE.Mesh(palmTrunkGeometry, palmTrunkMaterial);
                    palmTrunk.position.set(palmX, position.y + 1.5, palmZ);
                    scene.add(palmTrunk);

                    // Palm fronds
                    for (let j = 0; j < 6; j++) {
                        const frondGeometry = new THREE.ConeGeometry(0.1, 2, 4);
                        const frondMaterial = new THREE.MeshStandardMaterial({ color: 0x006400 });
                        const frond = new THREE.Mesh(frondGeometry, frondMaterial);
                        const angle = (j / 6) * Math.PI * 2;
                        frond.position.set(
                            palmX + Math.cos(angle) * 0.5,
                            position.y + 3.5,
                            palmZ + Math.sin(angle) * 0.5
                        );
                        frond.rotation.set(
                            Math.PI / 3,
                            angle,
                            0
                        );
                        scene.add(frond);
                    }
                }

                // Water oasis
                const waterGeometry = new THREE.CircleGeometry(1.5, 32);
                const waterMaterial = new THREE.MeshStandardMaterial({ 
                    color: 0x4169e1,
                    transparent: true,
                    opacity: 0.7,
                    roughness: 0.1,
                    metalness: 0.2
                });
                const water = new THREE.Mesh(waterGeometry, waterMaterial);
                water.position.set(position.x, position.y + 0.05, position.z);
                water.rotation.x = -Math.PI / 2;
                scene.add(water);

                // Sand dunes
                for (let i = 0; i < 4; i++) {
                    const duneGeometry = new THREE.SphereGeometry(0.8, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2);
                    const duneMaterial = new THREE.MeshStandardMaterial({ color: 0xffd700 });
                    const dune = new THREE.Mesh(duneGeometry, duneMaterial);
                    dune.position.set(
                        position.x + (Math.random() - 0.5) * 6,
                        position.y - 0.2,
                        position.z + (Math.random() - 0.5) * 6
                    );
                    scene.add(dune);
                }
                break;

            case 4: // Final Challenge
                // Crystal formations
                for (let i = 0; i < 8; i++) {
                    const crystalGeometry = new THREE.OctahedronGeometry(0.3 + Math.random() * 0.5);
                    const crystalMaterial = new THREE.MeshStandardMaterial({ 
                        color: 0x9370db,
                        transparent: true,
                        opacity: 0.8,
                        roughness: 0.1,
                        metalness: 0.8
                    });
                    const crystal = new THREE.Mesh(crystalGeometry, crystalMaterial);
                    crystal.position.set(
                        position.x + (Math.random() - 0.5) * 4,
                        position.y + 0.5 + Math.random() * 1,
                        position.z + (Math.random() - 0.5) * 4
                    );
                    crystal.rotation.set(
                        Math.random() * Math.PI,
                        Math.random() * Math.PI,
                        Math.random() * Math.PI
                    );
                    scene.add(crystal);
                }

                // Energy rings
                for (let i = 0; i < 3; i++) {
                    const ringGeometry = new THREE.TorusGeometry(1 + i * 0.5, 0.1, 8, 32);
                    const ringMaterial = new THREE.MeshStandardMaterial({ 
                        color: 0x00ffff,
                        transparent: true,
                        opacity: 0.6,
                        emissive: 0x001122,
                        emissiveIntensity: 0.5
                    });
                    const ring = new THREE.Mesh(ringGeometry, ringMaterial);
                    ring.position.set(position.x, position.y + 2 + i * 0.3, position.z);
                    ring.rotation.x = Math.PI / 2;
                    scene.add(ring);
                }
                break;
        }
    };

    // Create enhanced level markers
    const createEnhancedMarker = (position: THREE.Vector3, index: number, scene: THREE.Scene) => {
        // Base platform with details
        const platformGeometry = new THREE.CylinderGeometry(1.2, 1.4, 0.4, 32);
        const platformMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x8b5cf6,
            roughness: 0.3,
            metalness: 0.7
        });
        const platform = new THREE.Mesh(platformGeometry, platformMaterial);
        platform.position.set(position.x, position.y - 0.3, position.z);
        scene.add(platform);

        // Glowing core
        const coreGeometry = new THREE.SphereGeometry(0.3, 32, 32);
        const coreMaterial = new THREE.MeshStandardMaterial({ 
            color: index === 0 ? 0x4ade80 : 0x6b7280,
            emissive: index === 0 ? 0x002200 : 0x000000,
            emissiveIntensity: 0.3,
            transparent: true,
            opacity: 0.9
        });
        const core = new THREE.Mesh(coreGeometry, coreMaterial);
        core.position.copy(position);
        core.userData = { levelIndex: index };
        scene.add(core);

        // Floating rings around marker
        for (let i = 0; i < 3; i++) {
            const ringGeometry = new THREE.TorusGeometry(0.8 + i * 0.2, 0.05, 8, 32);
            const ringMaterial = new THREE.MeshStandardMaterial({ 
                color: 0xffffff,
                transparent: true,
                opacity: 0.4
            });
            const ring = new THREE.Mesh(ringGeometry, ringMaterial);
            ring.position.set(position.x, position.y + 0.5 + i * 0.1, position.z);
            scene.add(ring);
        }

        // Holographic number
        const numberGeometry = new THREE.BoxGeometry(0.6, 0.6, 0.1);
        const numberMaterial = new THREE.MeshStandardMaterial({ 
            color: 0xffffff,
            transparent: true,
            opacity: 0.8,
            emissive: 0x004400,
            emissiveIntensity: 0.2
        });
        const numberMesh = new THREE.Mesh(numberGeometry, numberMaterial);
        numberMesh.position.set(position.x, position.y + 0.8, position.z);
        scene.add(numberMesh);

        return core;
    };

    useEffect(() => {
        if (!containerRef.current) return;

        // Scene setup with enhanced atmosphere
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x0a0a1a);
        scene.fog = new THREE.Fog(0x0a0a1a, 10, 50);
        sceneRef.current = scene;

        // Camera setup
        const camera = new THREE.PerspectiveCamera(
            60,
            containerRef.current.clientWidth / containerRef.current.clientHeight,
            0.1,
            1000
        );
        camera.position.set(15, 15, 15);
        camera.lookAt(0, 0, 0);
        cameraRef.current = camera;

        // Enhanced renderer
        const renderer = new THREE.WebGLRenderer({ 
            antialias: true,
            alpha: true
        });
        renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.2;
        containerRef.current.appendChild(renderer.domElement);
        rendererRef.current = renderer;

        const { grassTexture } = createTextures();

        // Enhanced lighting
        const ambientLight = new THREE.AmbientLight(0x404080, 0.3);
        scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2);
        directionalLight.position.set(10, 20, 10);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 2048;
        directionalLight.shadow.mapSize.height = 2048;
        directionalLight.shadow.camera.near = 0.5;
        directionalLight.shadow.camera.far = 50;
        directionalLight.shadow.camera.left = -20;
        directionalLight.shadow.camera.right = 20;
        directionalLight.shadow.camera.top = 20;
        directionalLight.shadow.camera.bottom = -20;
        scene.add(directionalLight);

        // Multiple colored point lights
        const pointLights = [
            { color: 0xff6b35, position: [5, 8, 5] },
            { color: 0x4ade80, position: [-5, 8, -5] },
            { color: 0x8b5cf6, position: [0, 12, 0] }
        ];

        pointLights.forEach(({ color, position }) => {
            const light = new THREE.PointLight(color, 0.8, 30);
            light.position.set(position[0], position[1], position[2]);
            light.castShadow = true;
            scene.add(light);
        });

        // Enhanced ground with texture
        const groundGeometry = new THREE.BoxGeometry(25, 1, 25);
        const groundMaterial = new THREE.MeshStandardMaterial({ 
            map: grassTexture,
            roughness: 0.8,
            metalness: 0.1
        });
        const ground = new THREE.Mesh(groundGeometry, groundMaterial);
        ground.position.set(0, -0.5, 0);
        ground.receiveShadow = true;
        scene.add(ground);

        // Detailed borders with texture
        const borderMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x2a2a2a,
            roughness: 0.9,
            metalness: 0.3
        });
        const borders = [
            { pos: [12.5, 0.5, 0], size: [1, 2, 25] },
            { pos: [-12.5, 0.5, 0], size: [1, 2, 25] },
            { pos: [0, 0.5, 12.5], size: [25, 2, 1] },
            { pos: [0, 0.5, -12.5], size: [25, 2, 1] }
        ];

        borders.forEach(({ pos, size }) => {
            const geometry = new THREE.BoxGeometry(size[0], size[1], size[2]);
            const mesh = new THREE.Mesh(geometry, borderMaterial);
            mesh.position.set(pos[0], pos[1], pos[2]);
            mesh.castShadow = true;
            mesh.receiveShadow = true;
            scene.add(mesh);
        });

        // Create detailed character
        const character = createDetailedCharacter();
        character.position.copy(levels[0]);
        character.castShadow = true;
        scene.add(character);
        characterRef.current = character;

        // Create level environments and enhanced markers
        levels.forEach((pos, index) => {
            createLevelEnvironment(scene, index, pos);
            const marker = createEnhancedMarker(pos, index, scene);
            levelMarkersRef.current.push(marker);
        });

        // Particle system for atmosphere
        const particleGeometry = new THREE.BufferGeometry();
        const particleCount = 100;
        const positions = new Float32Array(particleCount * 3);

        for (let i = 0; i < particleCount * 3; i++) {
            positions[i] = (Math.random() - 0.5) * 50;
        }

        particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        const particleMaterial = new THREE.PointsMaterial({
            color: 0xffffff,
            size: 0.1,
            transparent: true,
            opacity: 0.6
        });
        const particles = new THREE.Points(particleGeometry, particleMaterial);
        scene.add(particles);

        // Mouse controls (keeping existing implementation)
        const handleMouseDown = (e: MouseEvent) => {
            isDraggingRef.current = true;
            previousMouseRef.current = { x: e.clientX, y: e.clientY };
        };

        const handleMouseMove = (e: MouseEvent) => {
            if (isDraggingRef.current) {
                const deltaX = e.clientX - previousMouseRef.current.x;
                const deltaY = e.clientY - previousMouseRef.current.y;

                sphericalRef.current.theta -= deltaX * 0.01;
                sphericalRef.current.phi -= deltaY * 0.01;
                sphericalRef.current.phi = Math.max(0.1, Math.min(Math.PI - 0.1, sphericalRef.current.phi));

                previousMouseRef.current = { x: e.clientX, y: e.clientY };
            }
        };

        const handleMouseUp = () => {
            isDraggingRef.current = false;
        };

        const handleWheel = (e: WheelEvent) => {
            e.preventDefault();
            sphericalRef.current.radius = Math.max(5, Math.min(40, sphericalRef.current.radius + e.deltaY * 0.01));
        };

        const handleClick = (e: MouseEvent) => {
            const rect = renderer.domElement.getBoundingClientRect();
            mouseRef.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
            mouseRef.current.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

            raycasterRef.current.setFromCamera(mouseRef.current, camera);
            const intersects = raycasterRef.current.intersectObjects(levelMarkersRef.current);

            if (intersects.length > 0) {
                const clickedMarker = intersects[0].object as THREE.Mesh;
                const levelIndex = clickedMarker.userData.levelIndex;
                
                if (completedLevels.has(levelIndex) || Math.abs(levelIndex - currentLevel) === 1) {
                    setCurrentLevel(levelIndex);
                    targetPositionRef.current = levels[levelIndex];
                    setCompletedLevels(prev => new Set([...prev, levelIndex]));
                }
            }
        };

        renderer.domElement.addEventListener('mousedown', handleMouseDown);
        renderer.domElement.addEventListener('mousemove', handleMouseMove);
        renderer.domElement.addEventListener('mouseup', handleMouseUp);
        renderer.domElement.addEventListener('wheel', handleWheel, { passive: false });
        renderer.domElement.addEventListener('click', handleClick);

        // Enhanced animation loop
        const clock = new THREE.Clock();
        const animate = () => {
            requestAnimationFrame(animate);
            const delta = clock.getDelta();

            // Update camera position
            const pos = new THREE.Vector3();
            pos.x = sphericalRef.current.radius * Math.sin(sphericalRef.current.phi) * Math.cos(sphericalRef.current.theta);
            pos.y = sphericalRef.current.radius * Math.cos(sphericalRef.current.phi);
            pos.z = sphericalRef.current.radius * Math.sin(sphericalRef.current.phi) * Math.sin(sphericalRef.current.theta);
            camera.position.copy(pos);
            camera.lookAt(0, 0, 0);

            // Animate particles
            const positions = particles.geometry.attributes.position.array as Float32Array;
            for (let i = 0; i < positions.length; i += 3) {
                positions[i + 1] += 0.01;
                if (positions[i + 1] > 25) {
                    positions[i + 1] = -25;
                }
            }
            particles.geometry.attributes.position.needsUpdate = true;
            particles.rotation.y += 0.001;

            // Update character position with smooth animation
            if (characterRef.current) {
                const speed = 0.05;
                const dx = targetPositionRef.current.x - characterRef.current.position.x;
                const dz = targetPositionRef.current.z - characterRef.current.position.z;
                
                if (Math.abs(dx) > 0.1 || Math.abs(dz) > 0.1) {
                    characterRef.current.position.x += dx * speed;
                    characterRef.current.position.z += dz * speed;
                    
                    // Add walking animation
                    characterRef.current.rotation.y = Math.atan2(dx, dz);
                    characterRef.current.children.forEach((child, index) => {
                        if (index > 2) { // Arms and legs
                            child.rotation.x = Math.sin(Date.now() * 0.01) * 0.3;
                        }
                    });
                }
            }

            // Animate level markers
            levelMarkersRef.current.forEach((marker, index) => {
                marker.rotation.y += 0.02;
                marker.position.y = levels[index].y + Math.sin(Date.now() * 0.003 + index) * 0.1;
                
                if (index === currentLevel) {
                    const material = marker.material as THREE.MeshStandardMaterial;
                    material.emissiveIntensity = 0.5 + Math.sin(Date.now() * 0.01) * 0.3;
                }
            });

            renderer.render(scene, camera);
        };
        animate();

        // Handle resize
        const handleResize = () => {
            if (!containerRef.current) return;
            camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
        };
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            renderer.domElement.removeEventListener('mousedown', handleMouseDown);
            renderer.domElement.removeEventListener('mousemove', handleMouseMove);
            renderer.domElement.removeEventListener('mouseup', handleMouseUp);
            renderer.domElement.removeEventListener('wheel', handleWheel);
            renderer.domElement.removeEventListener('click', handleClick);
            containerRef.current?.removeChild(renderer.domElement);
            renderer.dispose();
        };
    }, []);

    useEffect(() => {
        // Update marker colors when levels change
        levelMarkersRef.current.forEach((marker, index) => {
            const material = marker.material as THREE.MeshStandardMaterial;
            if (completedLevels.has(index)) {
                material.color.setHex(0x4ade80);
                material.emissive.setHex(0x002200);
                material.emissiveIntensity = 0.4;
            } else if (index === currentLevel) {
                material.color.setHex(0xfbbf24);
                material.emissive.setHex(0x442200);
                material.emissiveIntensity = 0.6;
            } else {
                material.color.setHex(0x6b7280);
                material.emissive.setHex(0x000000);
                material.emissiveIntensity = 0;
            }
        });
    }, [currentLevel, completedLevels]);

    const progressPercentage = (completedLevels.size / levels.length) * 100;

    return (
        <div className="w-full h-screen relative bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
            <div ref={containerRef} className="w-full h-full" />
            
            {/* Header */}
            <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20 backdrop-blur-md border-b border-white/10">
                <div className="flex items-center justify-between p-4">
                    <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                            <span className="text-white font-bold text-lg">🎮</span>
                        </div>
                        <h1 className="text-2xl font-bold text-white">AgroVerse Adventures</h1>
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className="text-white text-sm">
                            <span className="text-gray-300">Score:</span> {completedLevels.size * 100}
                        </div>
                        <button
                            onClick={() => setShowMap(!showMap)}
                            className="px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-white rounded-lg backdrop-blur-sm transition-all duration-200 flex items-center space-x-2"
                        >
                            <span>🗺️</span>
                            <span>Map</span>
                        </button>
                        <button
                            onClick={() => setShowInstructions(!showInstructions)}
                            className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg backdrop-blur-sm transition-all duration-200"
                        >
                            Help
                        </button>
                    </div>
                </div>
            </div>

            {/* Game Stats Panel */}
            <div className="absolute top-20 left-4 bg-black/40 backdrop-blur-lg rounded-2xl p-6 text-white border border-white/20 shadow-2xl">
                <div className="flex items-center space-x-2 mb-4">
                    <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-bold">⭐</span>
                    </div>
                    <h2 className="text-xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                        Mission Progress
                    </h2>
                </div>
                
                <div className="space-y-4">
                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-lg font-semibold">{levelNames[currentLevel]}</span>
                            <span className="text-sm text-gray-300">{currentLevel + 1}/5</span>
                        </div>
                        <div className="w-full bg-gray-700/50 rounded-full h-3 mb-4">
                            <div 
                                className="bg-gradient-to-r from-green-400 to-blue-500 h-3 rounded-full transition-all duration-500"
                                style={{ width: `${progressPercentage}%` }}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-5 gap-2">
                        {levels.map((_, index) => (
                            <div
                                key={index}
                                className={`relative w-12 h-12 rounded-xl flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                                    completedLevels.has(index) 
                                        ? 'bg-gradient-to-r from-green-400 to-green-600 text-white shadow-lg shadow-green-500/50' 
                                        : index === currentLevel 
                                            ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-lg shadow-yellow-500/50 animate-pulse' 
                                            : 'bg-gray-600/50 text-gray-400'
                                }`}
                                title={levelNames[index]}
                            >
                                {completedLevels.has(index) ? '✓' : index + 1}
                                {index === currentLevel && (
                                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-ping" />
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="text-xs text-gray-400 space-y-1">
                        <p>💡 Click on glowing markers to move</p>
                        <p>🖱️ Drag to rotate camera</p>
                        <p>🎯 Scroll to zoom in/out</p>
                    </div>
                </div>
            </div>

            {/* Detailed Static Map Overlay */}
            {showMap && (
                <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-gradient-to-br from-gray-900/95 to-blue-900/95 backdrop-blur-lg rounded-3xl p-8 max-w-5xl max-h-[90vh] overflow-y-auto text-white border border-white/20 shadow-2xl">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent flex items-center space-x-3">
                                <span>🗺️</span>
                                <span>AgroVerse World Map</span>
                            </h3>
                            <button
                                onClick={() => setShowMap(false)}
                                className="w-10 h-10 bg-red-500/20 hover:bg-red-500/40 rounded-full flex items-center justify-center transition-colors text-xl"
                            >
                                ✕
                            </button>
                        </div>
                        
                        {/* Interactive Map Grid */}
                        <div className="relative bg-gradient-to-br from-green-900/50 to-blue-900/50 rounded-2xl p-8 mb-6 border-2 border-white/10">
                            <div className="grid grid-cols-3 grid-rows-3 gap-4 w-full max-w-2xl mx-auto">
                                {/* Top Row */}
                                <div className="bg-gray-700/30 rounded-lg p-4 border border-gray-600/50"></div>
                                <div 
                                    className={`relative rounded-lg p-4 border-2 transition-all cursor-pointer ${
                                        currentLevel === 2 
                                            ? 'border-yellow-400 bg-gray-600/50 shadow-lg shadow-yellow-500/30' 
                                            : completedLevels.has(2)
                                                ? 'border-green-400 bg-gray-600/30'
                                                : 'border-gray-600/50 bg-gray-700/30'
                                    }`}
                                    onClick={() => {
                                        if (completedLevels.has(2) || Math.abs(2 - currentLevel) === 1) {
                                            setCurrentLevel(2);
                                        }
                                    }}
                                >
                                    <div className="text-center">
                                        <div className="text-2xl mb-2">⛰️</div>
                                        <div className="text-sm font-bold text-gray-300">Mountain Peak</div>
                                        <div className="absolute top-1 right-1 text-xs">
                                            {completedLevels.has(2) ? '✅' : currentLevel === 2 ? '📍' : '🔒'}
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-gray-700/30 rounded-lg p-4 border border-gray-600/50"></div>

                                {/* Middle Row */}
                                <div 
                                    className={`relative rounded-lg p-4 border-2 transition-all cursor-pointer ${
                                        currentLevel === 1 
                                            ? 'border-yellow-400 bg-green-700/50 shadow-lg shadow-yellow-500/30' 
                                            : completedLevels.has(1)
                                                ? 'border-green-400 bg-green-700/30'
                                                : 'border-gray-600/50 bg-gray-700/30'
                                    }`}
                                    onClick={() => {
                                        if (completedLevels.has(1) || Math.abs(1 - currentLevel) === 1) {
                                            setCurrentLevel(1);
                                        }
                                    }}
                                >
                                    <div className="text-center">
                                        <div className="text-2xl mb-2">🌲</div>
                                        <div className="text-sm font-bold text-green-300">Forest Grove</div>
                                        <div className="absolute top-1 right-1 text-xs">
                                            {completedLevels.has(1) ? '✅' : currentLevel === 1 ? '📍' : '🔒'}
                                        </div>
                                    </div>
                                </div>

                                <div 
                                    className={`relative rounded-lg p-4 border-2 transition-all cursor-pointer ${
                                        currentLevel === 0 
                                            ? 'border-yellow-400 bg-blue-600/50 shadow-lg shadow-yellow-500/30' 
                                            : completedLevels.has(0)
                                                ? 'border-green-400 bg-blue-600/30'
                                                : 'border-gray-600/50 bg-gray-700/30'
                                    }`}
                                    onClick={() => setCurrentLevel(0)}
                                >
                                    <div className="text-center">
                                        <div className="text-2xl mb-2">🏠</div>
                                        <div className="text-sm font-bold text-blue-300">Home Base</div>
                                        <div className="absolute top-1 right-1 text-xs">
                                            {completedLevels.has(0) ? '✅' : currentLevel === 0 ? '📍' : '🔒'}
                                        </div>
                                    </div>
                                </div>

                                <div 
                                    className={`relative rounded-lg p-4 border-2 transition-all cursor-pointer ${
                                        currentLevel === 4 
                                            ? 'border-yellow-400 bg-purple-600/50 shadow-lg shadow-yellow-500/30' 
                                            : completedLevels.has(4)
                                                ? 'border-green-400 bg-purple-600/30'
                                                : 'border-gray-600/50 bg-gray-700/30'
                                    }`}
                                    onClick={() => {
                                        if (completedLevels.has(4) || Math.abs(4 - currentLevel) === 1) {
                                            setCurrentLevel(4);
                                        }
                                    }}
                                >
                                    <div className="text-center">
                                        <div className="text-2xl mb-2">💎</div>
                                        <div className="text-sm font-bold text-purple-300">Final Challenge</div>
                                        <div className="absolute top-1 right-1 text-xs">
                                            {completedLevels.has(4) ? '✅' : currentLevel === 4 ? '📍' : '🔒'}
                                        </div>
                                    </div>
                                </div>

                                {/* Bottom Row */}
                                <div className="bg-gray-700/30 rounded-lg p-4 border border-gray-600/50"></div>
                                <div 
                                    className={`relative rounded-lg p-4 border-2 transition-all cursor-pointer ${
                                        currentLevel === 3 
                                            ? 'border-yellow-400 bg-orange-600/50 shadow-lg shadow-yellow-500/30' 
                                            : completedLevels.has(3)
                                                ? 'border-green-400 bg-orange-600/30'
                                                : 'border-gray-600/50 bg-gray-700/30'
                                    }`}
                                    onClick={() => {
                                        if (completedLevels.has(3) || Math.abs(3 - currentLevel) === 1) {
                                            setCurrentLevel(3);
                                        }
                                    }}
                                >
                                    <div className="text-center">
                                        <div className="text-2xl mb-2">🏜️</div>
                                        <div className="text-sm font-bold text-orange-300">Desert Oasis</div>
                                        <div className="absolute top-1 right-1 text-xs">
                                            {completedLevels.has(3) ? '✅' : currentLevel === 3 ? '📍' : '🔒'}
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-gray-700/30 rounded-lg p-4 border border-gray-600/50"></div>
                            </div>

                            {/* Character Position Indicator */}
                            <div className="absolute top-4 right-4 bg-black/60 rounded-lg p-3 border border-white/20">
                                <div className="flex items-center space-x-2">
                                    <div className="w-4 h-4 bg-orange-500 rounded-full animate-pulse"></div>
                                    <span className="text-sm text-orange-300">Your Location</span>
                                </div>
                            </div>
                        </div>

                        {/* Detailed Level Information */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {levelDetails.map((level, index) => (
                                <div 
                                    key={index}
                                    className={`bg-black/40 rounded-xl p-6 border-2 transition-all cursor-pointer hover:scale-105 ${
                                        currentLevel === index 
                                            ? 'border-yellow-400 shadow-lg shadow-yellow-500/30' 
                                            : completedLevels.has(index)
                                                ? 'border-green-400'
                                                : 'border-gray-600/50'
                                    }`}
                                    onClick={() => {
                                        if (completedLevels.has(index) || Math.abs(index - currentLevel) === 1) {
                                            setCurrentLevel(index);
                                            setShowMap(false);
                                        }
                                    }}
                                >
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center space-x-3">
                                            <div className="text-3xl">{level.icon}</div>
                                            <div>
                                                <h4 className="font-bold text-lg" style={{ color: level.color }}>
                                                    {level.name}
                                                </h4>
                                                <p className="text-xs text-gray-400">Level {index + 1}</p>
                                            </div>
                                        </div>
                                        <div className="text-2xl">
                                            {completedLevels.has(index) ? '✅' : currentLevel === index ? '📍' : '🔒'}
                                        </div>
                                    </div>
                                    
                                    <p className="text-sm text-gray-300 mb-4">{level.description}</p>
                                    
                                    <div className="space-y-2">
                                        <h5 className="font-semibold text-sm text-white">Features:</h5>
                                        <ul className="text-xs text-gray-400 space-y-1">
                                            {level.features.map((feature, featureIndex) => (
                                                <li key={featureIndex} className="flex items-center space-x-2">
                                                    <span className="w-1 h-1 bg-white rounded-full"></span>
                                                    <span>{feature}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    {/* Level Status */}
                                    <div className="mt-4 pt-4 border-t border-gray-600/50">
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs text-gray-400">Status:</span>
                                            <span className={`text-xs font-bold ${
                                                completedLevels.has(index) 
                                                    ? 'text-green-400' 
                                                    : currentLevel === index 
                                                        ? 'text-yellow-400' 
                                                        : 'text-gray-500'
                                            }`}>
                                                {completedLevels.has(index) 
                                                    ? 'Completed' 
                                                    : currentLevel === index 
                                                        ? 'Current' 
                                                        : 'Locked'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Map Legend */}
                        <div className="mt-8 bg-black/30 rounded-xl p-6 border border-white/10">
                            <h4 className="text-lg font-bold mb-4 text-white">Map Legend</h4>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                <div className="flex items-center space-x-2">
                                    <div className="w-4 h-4 bg-green-400 rounded"></div>
                                    <span className="text-gray-300">Completed</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <div className="w-4 h-4 bg-yellow-400 rounded animate-pulse"></div>
                                    <span className="text-gray-300">Current</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <div className="w-4 h-4 bg-gray-600 rounded"></div>
                                    <span className="text-gray-300">Locked</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <div className="w-4 h-4 bg-orange-500 rounded-full animate-pulse"></div>
                                    <span className="text-gray-300">Player</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Instructions Modal */}
            {showInstructions && (
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-gradient-to-br from-purple-900/90 to-blue-900/90 backdrop-blur-lg rounded-2xl p-8 max-w-md text-white border border-white/20 shadow-2xl">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                                How to Play
                            </h3>
                            <button
                                onClick={() => setShowInstructions(false)}
                                className="w-8 h-8 bg-red-500/20 hover:bg-red-500/40 rounded-full flex items-center justify-center transition-colors"
                            >
                                ✕
                            </button>
                        </div>
                        
                        <div className="space-y-4 text-sm">
                            <div className="flex items-start space-x-3">
                                <span className="text-yellow-400 text-xl">🎯</span>
                                <div>
                                    <p className="font-semibold">Navigate Levels</p>
                                    <p className="text-gray-300">Click on glowing platforms to move your character</p>
                                </div>
                            </div>
                            
                            <div className="flex items-start space-x-3">
                                <span className="text-blue-400 text-xl">📷</span>
                                <div>
                                    <p className="font-semibold">Camera Controls</p>
                                    <p className="text-gray-300">Drag to rotate view, scroll to zoom</p>
                                </div>
                            </div>
                            
                            <div className="flex items-start space-x-3">
                                <span className="text-green-400 text-xl">🏆</span>
                                <div>
                                    <p className="font-semibold">Complete Missions</p>
                                    <p className="text-gray-300">Visit all 5 detailed environments to win</p>
                                </div>
                            </div>

                            <div className="flex items-start space-x-3">
                                <span className="text-purple-400 text-xl">🗺️</span>
                                <div>
                                    <p className="font-semibold">Use the Map</p>
                                    <p className="text-gray-300">Click the Map button to see all locations and details</p>
                                </div>
                            </div>
                        </div>
                        
                        <button
                            onClick={() => setShowInstructions(false)}
                            className="w-full mt-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 rounded-lg font-semibold transition-all duration-200"
                        >
                            Start Playing
                        </button>
                    </div>
                </div>
            )}

            {/* Achievement Notification */}
            {completedLevels.size === levels.length && (
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white p-8 rounded-2xl shadow-2xl animate-bounce">
                    <div className="text-center">
                        <div className="text-6xl mb-4">🏆</div>
                        <h2 className="text-3xl font-bold mb-2">Congratulations!</h2>
                        <p className="text-lg">You've mastered all environments!</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Game3D;