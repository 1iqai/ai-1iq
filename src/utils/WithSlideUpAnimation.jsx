import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const WithSlideUpAnimation = ({children}) => {
    const animationRef = useRef(null);
    useEffect(() => {
      if (animationRef.current) {
        gsap.from(animationRef.current, {
          y: 50,
          opacity: 0,
          duration: 1,
          ease: 'power3.out',
          delay: 0.2,
        },);
      }
    }, []); 

    return (
        <div ref={animationRef}>
            {children}
        </div>
    );
};

export default WithSlideUpAnimation;