import React, { useEffect, useRef, useState } from "react";
import { motion, useSpring, useTransform, useInView } from "framer-motion";

export const AnimatedNumber = ({
  value,
  mass = 0.8,
  stiffness = 50,
  damping = 15,
  precision = 0,
  format = (num) => num.toLocaleString(),
  onAnimationStart,
  onAnimationComplete,
  prefix = "",
  suffix = "",
  className = "",
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-10% 0px" });
  const [hasStarted, setHasStarted] = useState(false);

  // Initialize spring at 0
  const spring = useSpring(0, { mass, stiffness, damping });
  const display = useTransform(spring, (current) =>
    format(parseFloat(current.toFixed(precision)))
  );

  useEffect(() => {
    if (isInView && !hasStarted) {
      setHasStarted(true);
      if (onAnimationStart) onAnimationStart();
      
      // Animate spring to the target value
      spring.set(value);

      const unsubscribe = spring.on("change", (latest) => {
        if (latest >= value && onAnimationComplete) {
          onAnimationComplete();
        }
      });
      return () => unsubscribe();
    }
  }, [isInView, hasStarted, spring, value, onAnimationStart, onAnimationComplete]);

  return (
    <motion.span ref={ref} className={className}>
      {prefix}
      <motion.span>{display}</motion.span>
      {suffix}
    </motion.span>
  );
};

export default AnimatedNumber;
