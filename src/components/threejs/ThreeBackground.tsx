'use client';
import React, { useEffect, useRef } from 'react';

export default function ThreeBackground() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    let camera: any, scene: any, renderer: any, mixer: any, controls: any, clock: any;
    let animationFrameId: number;
    let cleanupFn: (() => void) | null = null;

    const init = async () => {
      const THREE = (window as any).THREE;
      
      console.log('Initializing scene with THREE:', THREE);
      
      // Initialize clock after THREE is loaded
      clock = new THREE.Clock();
      
      // Camera - Adjusted for better viewing angle
      camera = new THREE.PerspectiveCamera(
        35, // Reduced FOV for more cinematic look
        window.innerWidth / window.innerHeight,
        1,
        2000
      );
      camera.position.set(150, 180, 400); // Better positioning

      // Scene with elegant gradient background
      scene = new THREE.Scene();
      
      // Create gradient background
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 512;
      const context = canvas.getContext('2d')!;
      
      // Professional gradient matching your theme
      const gradient = context.createLinearGradient(0, 0, 0, 512);
      gradient.addColorStop(0, '#1a1a2e'); // Deep navy
      gradient.addColorStop(0.3, '#16213e'); // Darker blue
      gradient.addColorStop(0.7, '#0f3460'); // Professional blue
      gradient.addColorStop(1, '#533483'); // Subtle purple
      
      context.fillStyle = gradient;
      context.fillRect(0, 0, 512, 512);
      
      const texture = new THREE.CanvasTexture(canvas);
      scene.background = texture;
      
      // Subtle fog for depth
      scene.fog = new THREE.Fog(0x1a1a2e, 300, 1200);

      // Professional lighting setup
      const ambientLight = new THREE.AmbientLight(0x404040, 0.6); // Soft ambient
      scene.add(ambientLight);

      // Key light (main)
      const keyLight = new THREE.DirectionalLight(0xffffff, 1.2);
      keyLight.position.set(200, 300, 200);
      keyLight.castShadow = true;
      keyLight.shadow.mapSize.width = 2048;
      keyLight.shadow.mapSize.height = 2048;
      keyLight.shadow.camera.top = 200;
      keyLight.shadow.camera.bottom = -200;
      keyLight.shadow.camera.left = -200;
      keyLight.shadow.camera.right = 200;
      keyLight.shadow.camera.near = 1;
      keyLight.shadow.camera.far = 1000;
      keyLight.shadow.bias = -0.0001;
      scene.add(keyLight);

      // Fill light (softer, opposite side)
      const fillLight = new THREE.DirectionalLight(0x7c4dff, 0.4);
      fillLight.position.set(-100, 200, -100);
      scene.add(fillLight);

      // Rim light (for silhouette)
      const rimLight = new THREE.DirectionalLight(0xa7727d, 0.6);
      rimLight.position.set(0, 100, -200);
      scene.add(rimLight);

      // Professional ground with subtle reflection
      const groundGeometry = new THREE.PlaneGeometry(2000, 2000);
      const groundMaterial = new THREE.MeshLambertMaterial({
        color: 0x2a2a3e,
        transparent: true,
        opacity: 0.8
      });
      const ground = new THREE.Mesh(groundGeometry, groundMaterial);
      ground.rotation.x = -Math.PI / 2;
      ground.receiveShadow = true;
      scene.add(ground);

      // Elegant grid with your theme colors
      const grid = new THREE.GridHelper(2000, 40, 0xa7727d, 0x4a4a5e);
      grid.material.opacity = 0.15;
      grid.material.transparent = true;
      scene.add(grid);

      // Add subtle particles for atmosphere
      const particlesGeometry = new THREE.BufferGeometry();
      const particlesCount = 100;
      const posArray = new Float32Array(particlesCount * 3);
      
      for(let i = 0; i < particlesCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 1000;
      }
      
      particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
      const particlesMaterial = new THREE.PointsMaterial({
        size: 2,
        color: 0xeddbc7,
        transparent: true,
        opacity: 0.3
      });
      
      const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
      scene.add(particlesMesh);

      // Renderer with enhanced settings
      renderer = new THREE.WebGLRenderer({ 
        antialias: true, 
        alpha: true,
        powerPreference: "high-performance"
      });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap; // Softer shadows
      renderer.outputEncoding = THREE.sRGBEncoding;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.2;
      containerRef.current?.appendChild(renderer.domElement);

      // CRITICAL FIX: Wait for OrbitControls to be available
      const waitForOrbitControls = () => {
        return new Promise<void>((resolve) => {
          const checkControls = () => {
            if ((window as any).THREE?.OrbitControls) {
              resolve();
            } else {
              setTimeout(checkControls, 100);
            }
          };
          checkControls();
        });
      };

      await waitForOrbitControls();

      // Orbit Controls - Enhanced
      const OrbitControls = (window as any).THREE.OrbitControls;
      controls = new OrbitControls(camera, renderer.domElement);
      controls.target.set(0, 100, 0);
      controls.enableDamping = true;
      controls.dampingFactor = 0.08;
      controls.minDistance = 200;
      controls.maxDistance = 800;
      controls.maxPolarAngle = Math.PI * 0.75; // Prevent going under ground
      controls.autoRotate = true;
      controls.autoRotateSpeed = 0.5; // Subtle auto-rotation
      controls.update();

      // Load FBX - FIXED: Don't mess with materials!
      const FBXLoader = (window as any).THREE.FBXLoader;
      const loader = new FBXLoader();
      
      loader.load(
        'https://threejs.org/examples/models/fbx/Samba Dancing.fbx',
        (object: any) => {
          console.log('FBX loaded successfully', object);
          
          // CRITICAL: Set up animation FIRST before touching materials
          mixer = new THREE.AnimationMixer(object);
          const action = mixer.clipAction(object.animations[0]);
          action.play();
          
          // Now safely modify appearance without breaking animation
          object.traverse((child: any) => {
            if (child.isMesh) {
              child.castShadow = true;
              child.receiveShadow = true;
              
              // SAFE material modification - only change color, keep original material type
              if (child.material) {
                // Don't replace the material, just modify its properties
                if (child.material.color) {
                  // Apply theme colors based on material names or randomly
                  const colors = [0xa7727d, 0xeddbc7, 0xf8ead8];
                  const randomColor = colors[Math.floor(Math.random() * colors.length)];
                  child.material.color.setHex(randomColor);
                }
                
                // Enhance existing material properties
                if (child.material.shininess !== undefined) {
                  child.material.shininess = 30;
                }
              }
            }
          });

          // Scale and position the character
          object.scale.setScalar(1.2);
          object.position.y = 0;
          
          scene.add(object);
        },
        (xhr: any) => {
          console.log((xhr.loaded / xhr.total * 100) + '% loaded');
        },
        (error: any) => {
          console.error('Error loading FBX:', error);
        }
      );

      // Handle resize
      const handleResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      };
      window.addEventListener('resize', handleResize);

      // Enhanced animation loop
      const animate = () => {
        animationFrameId = requestAnimationFrame(animate);
        const delta = clock.getDelta();
        
        // CRITICAL: Make sure mixer updates!
        if (mixer) {
          mixer.update(delta);
        }
        
        if (controls) controls.update();
        
        // Animate particles
        if (particlesMesh) {
          particlesMesh.rotation.y += 0.001;
        }
        
        renderer.render(scene, camera);
      };
      animate();

      cleanupFn = () => {
        window.removeEventListener('resize', handleResize);
        cancelAnimationFrame(animationFrameId);
        if (renderer && containerRef.current?.contains(renderer.domElement)) {
          containerRef.current.removeChild(renderer.domElement);
        }
      };
    };

    // Load Three.js and dependencies
    const loadScript = (src: string, id: string): Promise<void> => {
      return new Promise((resolve, reject) => {
        const existingScript = document.querySelector(`script[data-script-id="${id}"]`);
        if (existingScript) {
          resolve();
          return;
        }

        const script = document.createElement('script');
        script.src = src;
        script.setAttribute('data-script-id', id);
        
        script.onload = () => resolve();
        script.onerror = (e) => reject(new Error(`Failed to load ${id}`));
        
        document.head.appendChild(script);
      });
    };

    const loadAll = async () => {
      try {
        await loadScript('https://cdn.jsdelivr.net/npm/fflate@0.7.4/umd/index.js', 'fflate');
        await loadScript('https://cdn.jsdelivr.net/npm/three@0.128.0/build/three.min.js', 'three');
        await loadScript('https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/controls/OrbitControls.js', 'orbit-controls');
        await loadScript('https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/loaders/FBXLoader.js', 'fbx-loader');
        
        await new Promise(resolve => setTimeout(resolve, 500));
        await init();
      } catch (error) {
        console.error('Failed to load Three.js:', error);
      }
    };

    loadAll();

    return () => {
      if (cleanupFn) cleanupFn();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0"
      style={{ 
        zIndex: 0, 
        pointerEvents: 'auto'
      }}
    />
  );
}