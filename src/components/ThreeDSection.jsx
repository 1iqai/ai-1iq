import { useRef, Suspense, useEffect, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { ToneMapping, Bloom, DepthOfField, EffectComposer, Noise, Vignette, DotScreen, SSAO } from '@react-three/postprocessing'
import { Sky, Wireframe } from "@react-three/drei";
import React from "react";
import { useGLTF, PerspectiveCamera, useAnimations, Environment } from "@react-three/drei";
import * as THREE from 'three';
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "../ThreeDSection.scss";

// Custom hook to track native page scroll
gsap.registerPlugin(ScrollTrigger);


// scroll fix on chrome 44121 gsap forum
// ScrollTrigger.normalizeScroll(true);
// function usePageScroll() {
//   const [scroll, setScroll] = useState(0);

//   useEffect(() => {
//     const handleScroll = () => {
//       const scrollTop = window.pageYOffset;
//       const docHeight = document.documentElement.scrollHeight - window.innerHeight;
//       const scrollPercent = scrollTop / docHeight;
//       setScroll(Math.min(Math.max(scrollPercent, 0), 1)); // Clamp between 0 and 1
//     };

//     // Set initial scroll position
//     handleScroll();

//     window.addEventListener('scroll', handleScroll, { passive: true });
//     return () => window.removeEventListener('scroll', handleScroll);
//   }, []);

//   return scroll;
// }

// Scroll Cards Component with pillar-style animation
function ScrollCards() {
  const cardsContainerRef = useRef(null);
  const cardsRef = useRef([]);
  const activeCardRef = useRef(0);

  const cards = [
    {
      title: "The Real Cost of Running a Job",
      description: "A senior PM on a $50M project shouldn't be rebuilding a schedule at 10pm because a sub didn't show. They shouldn't be pulling together a status deck on Sunday so the Monday meeting looks good. But almost every one of them is. That's not a people problem. It's what happens when the tools haven't kept up with the work.",
    },
    {
      title: "831 Hours. Returned.",
      description: "When the admin runs itself, your PMs get back 21 weeks a year. At $68/hr fully loaded, that's $71,397 in recovered value per PM, before you count a single delay avoided or rework prevented.",
    },
    {
      title: "One More Project Per PM. Every Year.",
      description: "When your PMs aren't buried in paperwork, they have capacity for another job. A $5M project at 7% margin is $350k in new gross profit, per PM, per year. No new hires. No overtime. Just capacity that was already there.",
    },
    {
      title: "More Projects. Fewer Errors. No Extra Headcount.",
      description: "When AI handles the scheduling, reporting, and admin automatically, your PMs operate at a different level. Faster decisions, greater precision, and the bandwidth to take on more work simultaneously. That's not just efficiency. That's how your firm scales revenue without scaling costs.",
    },
    {
      title: "5 PMs. $2.1M. Year One.",
      description: "For a team of five project managers, the net benefit is $2.1M in Year 1. That's 4,156 hours recovered and $25 million in new project capacity unlocked. From a tool that was already in your budget.",
    }
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      const cardElements = cardsRef.current.filter(Boolean);
      if (!cardElements.length || !cardsContainerRef.current) return;

      // Set initial states - all cards hidden, positioned to the left
      gsap.set(cardElements, { autoAlpha: 0, x: -500 });
      gsap.set(cardElements[0], { autoAlpha: 1, x: 0 });
      activeCardRef.current = 0;

      const getScrollDistance = () => {
        return window.innerHeight * Math.max(cards.length - 1, 1) * 0.5;
      };

      const totalSteps = Math.max(cards.length - 1, 1);

      const animateToCard = (nextIndex) => {
        const currentIndex = activeCardRef.current;
        if (nextIndex === currentIndex) return;

        const direction = nextIndex > currentIndex ? 1 : -1;
        const currentCard = cardElements[currentIndex];
        const nextCard = cardElements[nextIndex];
        if (!currentCard || !nextCard) return;

        gsap.killTweensOf([currentCard, nextCard]);

        const tl = gsap.timeline();
        tl.to(currentCard, {
          autoAlpha: 0,
          x: -100 * direction,
          duration: 1.5,
          ease: 'power2.out'
        }).fromTo(
          nextCard,
          { autoAlpha: 0, x: -100 },
          {
            autoAlpha: 1,
            x: 0,
            duration: 1.2,
            ease: 'power2.out'
          },
          0.3
        );

        activeCardRef.current = nextIndex;
      };

      ScrollTrigger.create({
        trigger: document.querySelector('.three-d-section'),
        start: 'top top',
        end: '+=1500%',
        scrub: false,
        onUpdate: (self) => {
          const rawProgress = self.progress;

          if (cardElements.length <= 1) return;

          // Equal distribution: Each card stays for exactly 20% of the scroll
          // Card transitions: 0→1 at 20%, 1→2 at 40%, 2→3 at 60%, 3→4 at 80%
          let nextIndex = 0;
          if (rawProgress < 0.20) nextIndex = 0;
          else if (rawProgress < 0.40) nextIndex = 1;
          else if (rawProgress < 0.60) nextIndex = 2;
          else if (rawProgress < 0.80) nextIndex = 3;
          else nextIndex = 4;

          if (nextIndex !== activeCardRef.current) {
            animateToCard(nextIndex);
          }
        }
      });
    }, cardsContainerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={cardsContainerRef} className="scroll-cards-container">
      <div className="scroll-cards-wrapper">
        {cards.map((card, index) => (
          <div
            key={index}
            ref={(el) => {
              cardsRef.current[index] = el;
            }}
            className="scroll-card"
          >
            <div className="scroll-card-content">
              <p className="scroll-card-label">{String(index + 1).padStart(2, '0')}</p>
              <h3 className="scroll-card-title">{card.title}</h3>
              <p className="scroll-card-description">{card.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
export function Model({ scrollProgressRef, ...props }) {
  const group = React.useRef();
  const cityRef = useRef();
  const { nodes, cameras, animations } = useGLTF(
    "/assets/models/buildings_spiral_animation.glb"
  );
  const { actions, mixer } = useAnimations(animations, group);

  useEffect(() => {
    if (actions.CameraFly) {
      actions.CameraFly.play().paused = true;
    }
  }, [actions, cameras]);

  useFrame((state, delta) => {
    if (!actions.CameraFly || scrollProgressRef?.current === undefined) return;

    const action = actions.CameraFly;
    // Convert scroll progress (0-1) to animation time
    const targetTime = action.getClip().duration * scrollProgressRef.current;
    action.time = THREE.MathUtils.damp(action.time, targetTime, 10, delta);
  });
  return (
    <group ref={group} {...props} dispose={null}>
      <group name="Scene">
        <PerspectiveCamera
          name="Camera"
          makeDefault={true}
          far={cameras[0].far}
          near={cameras[0].near}
          fov={cameras[0].fov}
          position={cameras[0].position}
          rotation={cameras[0].rotation}
        />
        {/* <OrthographicCamera
          name="Camera"
          makeDefault={true}
          position={cameras[0].position}
          rotation={cameras[0].rotation}
          left={cameras[0].left}
          right={cameras[0].right}
          top={cameras[0].top}
          bottom={cameras[0].bottom}
          near={cameras[0].near}
          far={cameras[0].far}
          
        /> */}
        <Sky distance={450000} sunPosition={[0, 1, 0]} inclination={0} azimuth={0.25} {...props} />
        <mesh name="City" geometry={nodes.City.geometry} material={nodes.City.material} rotation={[Math.PI / 2, 0, 0]}>
          {/* <Wireframe 
          simplify={true}  
          dashInvert={true}  
          fill={"#EDEADE"} 
          stroke={"#000000"}
          dashLength={0.5}
          />  */}
        </mesh>

      </group>

    </group>
  );
}

const ThreeDSection = () => {
  const sectionRef = useRef(null);
  const scrollProgressRef = useRef(0);
  const timelineRef = useRef(null);
  // Create GSAP ScrollTrigger for this section
  useEffect(() => {
    if (!sectionRef.current) return;

    // Create GSAP ScrollTrigger for this section
    const ctx = gsap.context(() => {
      const dummy = { value: 0 };
      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top", // When section top hits viewport top
          end: "+=1500%", // Extended scroll for slower, more synchronized animation
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
          markers: false,
        },
      });

      timeline.to(dummy, {
        value: 1,
        duration: 1,
        ease: "none",
        onUpdate: () => {
          scrollProgressRef.current = dummy.value;
        },
      });

      timelineRef.current = timeline;
    }, sectionRef);

    return () => {
      // Cleanup on unmount
      timelineRef.current?.scrollTrigger?.kill();
      timelineRef.current?.kill();
      timelineRef.current = null;
      ctx.revert();
    };
  }, []);

  return (
    <section ref={sectionRef} className="three-d-section relative h-screen w-full bg-gradient-to-b from-white to-gray-100">
      {/* React Three Fiber Canvas */}
      <Canvas shadows dpr={[1, 2]} className="three-d-section__canvas w-full h-full">
        {/* Lighting */}
        <ambientLight intensity={0.5} />
        <directionalLight
          position={[10, 10, 5]}
          intensity={1}
          castShadow
          shadow-mapSize={[1024, 1024]}
        />
        <pointLight position={[-10, -10, -5]} intensity={0.5} />

        {/* Environment for reflections */}
        <Environment preset="city" />

        {/* 3D Model with scroll-based animations */}
        <Suspense fallback={null}>
          <Model scrollProgressRef={scrollProgressRef} />
        </Suspense>

        {/* Post-processing effects */}
        {/* <EffectComposer enableNormalPass={true}> */}

        {/* <ToneMapping adaptive={true} resolution={1024} /> */}
        {/* <Bloom
            intensity={0.5}           // Strength of the bloom effect
            luminanceThreshold={0.3}  // Minimum brightness to bloom
            luminanceSmoothing={0.9}  // Smoothness of the transition
            height={300}              // Resolution of the bloom effect
          /> */}

        {/* </EffectComposer> */}

      </Canvas>

      {/* Transparent Scroll Cards */}

      <ScrollCards />
    </section>
  );
};

useGLTF.preload("/assets/models/buildings_spiral_animation.glb");
export default ThreeDSection;
