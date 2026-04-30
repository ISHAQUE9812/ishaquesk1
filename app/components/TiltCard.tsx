"use client";
import React, { useRef, useState } from 'react';

export default function TiltCard({ children, className = '' }: { children: React.ReactNode, className?: string }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    // Calculate rotation (-15 to 15 degrees)
    const rotateX = ((y - centerY) / centerY) * -12; 
    const rotateY = ((x - centerX) / centerX) * 12;
    
    setRotation({ x: rotateX, y: rotateY });
  };

  const handleMouseEnter = () => setIsHovering(true);
  const handleMouseLeave = () => {
    setIsHovering(false);
    setRotation({ x: 0, y: 0 });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        perspective: '1000px',
        transformStyle: 'preserve-3d',
        height: '100%'
      }}
    >
      <div 
        className={className}
        style={{ 
          transform: isHovering 
            ? `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) translateZ(20px) scale(1.02)` 
            : `rotateX(0deg) rotateY(0deg) translateZ(0px) scale(1)`,
          transition: isHovering ? 'transform 0.1s cubic-bezier(0.25, 0.46, 0.45, 0.94)' : 'transform 0.5s ease',
          transformStyle: 'preserve-3d',
          height: '100%'
        }}
      >
        {children}
      </div>
    </div>
  );
}
