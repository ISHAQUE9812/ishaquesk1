"use client";

import React, { useRef, useState } from "react";
import { motion, useSpring } from "framer-motion";
import { staggerContainer, maskRevealLine, fadeUpSubtle } from "@/lib/animations";

export default function AnimatedHeading() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // States & Mouse Maths
  const [isHovered, setIsHovered] = useState(false);
  
  // Spring settings mapping strict resistance (High stiffness, proper damping prevents shaking)
  const springConfig = { stiffness: 120, damping: 20, mass: 0.2 };
  const smoothX = useSpring(0, springConfig);
  const smoothY = useSpring(0, springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const { clientX, clientY } = e;
    const { left, top, width, height } = containerRef.current.getBoundingClientRect();
    
    // Normalize mapping from center (-1 to 1) then multiplied by 8px maximum magnet distance
    const centerX = width / 2;
    const centerY = height / 2;
    const x = ((clientX - left - centerX) / centerX) * 8; 
    const y = ((clientY - top - centerY) / centerY) * 8;
    
    smoothX.set(x);
    smoothY.set(y);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    smoothX.set(0);
    smoothY.set(0);
  };

  return (
    <motion.div 
      variants={staggerContainer} 
      initial="hidden" 
      animate="visible" 
      className="flex flex-col items-start gap-0 md:gap-2 mt-20"
    >
      
      {/* 1. Subtle Subtext Line */}
      <div className="overflow-hidden pb-2 mb-2">
        <motion.p 
          variants={maskRevealLine} 
          className="text-gray-400 font-mono text-[10px] md:text-xs uppercase tracking-[0.3em] opacity-80 pl-2"
        >
          — Hi, I'm
        </motion.p>
      </div>

      {/* 2. Magnetic Interactive Master Name */}
      <motion.div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        style={{ x: smoothX, y: smoothY }}
        // Subtle magnetic overall scale 1.02 applied here using variants directly bound to isHovered
        animate={{ scale: isHovered ? 1.02 : 1 }}
        transition={{ type: "spring", stiffness: 100, damping: 15 }}
        className="relative group cursor-crosshair pb-4"
      >
        {/* FAUX LIQUID/RIPPLE EFFECT BACKLIGHT */}
        {/* Only appears on hover using pure CSS blur overlapping instead of SVG filters */}
        <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-1000 ease-out flex items-center justify-center -z-10 mix-blend-screen">
          <div className="absolute w-[110%] h-[150%] bg-gold/15 rounded-[100%] blur-[40px] animate-liquid-rotate" />
          <div className="absolute w-[80%] h-[120%] bg-gold-light/10 rounded-[100%] blur-[30px] animate-[liquid_7s_linear_infinite_reverse]" />
        </div>

        {/* The Text Layout Container (For Overflow Masking on Load) */}
        <div className="overflow-hidden">
          <motion.div variants={maskRevealLine} className="relative z-10 leading-[0.9]">
            
            {/* BASE LAYER: Shimmering Gold Foreground */}
            <span 
               className="block font-display text-[4rem] sm:text-[6rem] lg:text-[8rem] font-bold tracking-tighter bg-[linear-gradient(110deg,#d4a762,45%,#fce5b5,55%,#d4a762)] bg-[length:250%_100%] bg-clip-text text-transparent animate-gold-shimmer"
               style={{ 
                 opacity: isHovered ? 0 : 1, // Fades OUT when white hovers in
                 transition: 'opacity 0.4s ease-out'
               }}
            >
               Shaikh Mohammed <br className="hidden md:block"/>
               Ishaque.
            </span>

            {/* HOVER LAYER: Brilliant Glowing White Inverse (Placed exactly over the first one using Absolute positioning overlay) */}
            <span 
              aria-hidden="true" 
              className="absolute inset-0 font-display text-[4rem] sm:text-[6rem] lg:text-[8rem] font-bold tracking-tighter text-white"
              style={{
                 textShadow: "0px 0px 40px rgba(255,255,255,0.4), 0px 0px 80px rgba(212,167,98,0.2)",
                 opacity: isHovered ? 1 : 0, // Fades IN on hover
                 transition: 'opacity 0.5s ease-out'
              }}
            >
               Shaikh Mohammed <br className="hidden md:block"/>
               Ishaque.
            </span>
            
          </motion.div>
        </div>
      </motion.div>

      {/* 3. Subtle Detail Section at the Bottom */}
      <div className="overflow-hidden max-w-2xl mt-4">
        <motion.h2 
           variants={fadeUpSubtle}
           className="text-gray-400 font-sans text-xl lg:text-3xl font-light leading-snug tracking-tight"
        >
          Frontend Developer bridging the gap between sophisticated aesthetics and raw performance using <strong className="font-semibold text-white">React.js & Next.js</strong>.
        </motion.h2>
      </div>

    </motion.div>
  );
}