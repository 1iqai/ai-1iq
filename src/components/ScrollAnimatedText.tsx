
import React from 'react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

interface ScrollAnimatedTextProps {
  children: React.ReactNode;
  className?: string;
  speed?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
  as?: keyof JSX.IntrinsicElements;
}

const ScrollAnimatedText = ({ 
  children, 
  className = '', 
  speed = 0.5, 
  direction = 'up',
  as: Component = 'div'
}: ScrollAnimatedTextProps) => {
  const scrollY = useScrollAnimation();
  
  const getTransform = () => {
    const offset = scrollY * speed;
    switch (direction) {
      case 'up':
        return `translateY(-${offset}px)`;
      case 'down':
        return `translateY(${offset}px)`;
      case 'left':
        return `translateX(-${offset}px)`;
      case 'right':
        return `translateX(${offset}px)`;
      default:
        return `translateY(-${offset}px)`;
    }
  };

  return (
    <Component
      className={className}
      style={{
        transform: getTransform(),
        transition: 'transform 0.1s ease-out',
      }}
    >
      {children}
    </Component>
  );
};

export default ScrollAnimatedText;
