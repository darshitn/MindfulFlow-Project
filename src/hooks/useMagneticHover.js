import { useState, useRef, useEffect } from 'react';
import { useAnimation } from 'framer-motion';

export const useMagneticHover = (strength = 0.5) => {
  const ref = useRef(null);
  const controls = useAnimation();
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!ref.current) return;
      
      const { clientX, clientY } = e;
      const { left, top, width, height } = ref.current.getBoundingClientRect();
      const centerX = left + width / 2;
      const centerY = top + height / 2;

      // Distance from center
      const distanceX = clientX - centerX;
      const distanceY = clientY - centerY;

      // If mouse is within a certain radius, apply magnetic pull
      const distance = Math.sqrt(distanceX ** 2 + distanceY ** 2);
      const pullRadius = width * 1.5; // Radius of effect

      if (distance < pullRadius) {
        if (!isHovering) setIsHovering(true);
        // Calculate offset
        const x = distanceX * strength;
        const y = distanceY * strength;
        
        controls.start({ x, y, transition: { type: 'spring', stiffness: 150, damping: 15, mass: 0.1 } });
      } else {
        if (isHovering) {
          setIsHovering(false);
          controls.start({ x: 0, y: 0, transition: { type: 'spring', stiffness: 150, damping: 15, mass: 0.1 } });
        }
      }
    };

    const handleMouseLeave = () => {
      setIsHovering(false);
      controls.start({ x: 0, y: 0, transition: { type: 'spring', stiffness: 150, damping: 15, mass: 0.1 } });
    };

    window.addEventListener('mousemove', handleMouseMove);
    
    // Cleanup
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [controls, isHovering, strength]);

  return { ref, controls, isHovering };
};
