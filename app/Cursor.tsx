"use client";

import React, { useEffect, useState } from 'react';
import { motion, useSpring } from 'framer-motion';

export default function Cursor() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  // İmlecin yay (spring) fizikleri - yavaş ve akışkan takip
  const springX = useSpring(0, { stiffness: 100, damping: 25, mass: 0.1 });
  const springY = useSpring(0, { stiffness: 100, damping: 25, mass: 0.1 });

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      springX.set(e.clientX);
      springY.set(e.clientY);
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      // Eğer bir link, buton veya resim üzerine gelirse imleci büyüt
      if (target.tagName === 'A' || target.closest('a') || target.tagName === 'IMG') {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener('mousemove', moveCursor);
    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, [springX, springY]);

  return (
    <motion.div
      className="fixed top-0 left-0 w-3 h-3 bg-gray-900 rounded-full pointer-events-none z-[9999] mix-blend-difference"
      style={{
        x: springX,
        y: springY,
        translateX: "-50%",
        translateY: "-50%",
      }}
      animate={{
        scale: isHovering ? 4 : 1,
        backgroundColor: isHovering ? "rgba(255,255,255,0.8)" : "rgba(17,17,17,1)",
      }}
      transition={{ duration: 0.2 }}
    />
  );
}