'use client';

import { useRef, useState } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import Link from 'next/link';

// ==========================================
// ADVANCED AGENCY-LEVEL CUSTOM EASING
// ==========================================
const customEase = [0.16, 1, 0.3, 1] as const; // Ultra-smooth Apple-like easing

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const maskRevealVariants = {
  hidden: { y: '120%', rotate: 2 },
  visible: { 
    y: '0%', 
    rotate: 0,
    transition: { duration: 1.2, ease: customEase } 
  },
};

const fadeUpVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 1, ease: customEase } 
  },
};

// ==========================================
// REUSABLE MAGNETIC BUTTON COMPONENT (Pro-Level Trick)
// ==========================================
const MagneticButton = ({ children, className }: { children: React.ReactNode, className?: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouse = (e: React.MouseEvent<HTMLDivElement>) => {
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current!.getBoundingClientRect();
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    setPosition({ x: middleX * 0.2, y: middleY * 0.2 });
  };

  const reset = () => setPosition({ x: 0, y: 0 });

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
      className={`relative cursor-pointer ${className}`}
    >
      {children}
    </motion.div>
  );
};

// ==========================================
// MAIN HERO COMPONENT
// ==========================================
export default function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  
  // Smoothing scroll outputs to avoid jidder on 60+ Hz displays
  const smoothY = useSpring(scrollYProgress, { stiffness: 50, damping: 20 });
  const y = useTransform(smoothY, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(smoothY, [0, 0.8], [1, 0]);
  const blur = useTransform(smoothY, [0, 1], ["blur(0px)", "blur(10px)"]);

  return (
    <motion.section
      ref={heroRef}
      style={{ opacity, filter: blur }}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#0f0f0f]"
    >
      {/* ----- CINEMATIC AMBIENT BACKGROUND ----- */}
      {/* 1. Base Grid (Subtle developer vibe) */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] z-0"></div>
      
      {/* 2. Floating Deep Glows */}
      <motion.div 
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }} 
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }} 
        className="absolute -top-32 -left-32 w-[600px] h-[600px] bg-[#d4a762] rounded-full mix-blend-screen filter blur-[150px] opacity-30 z-0 pointer-events-none"
      />
      <motion.div 
        animate={{ scale: [1, 1.3, 1], opacity: [0.1, 0.3, 0.1] }} 
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }} 
        className="absolute top-[20%] right-[-10%] w-[500px] h-[500px] bg-indigo-900/50 rounded-full mix-blend-screen filter blur-[120px] opacity-20 z-0 pointer-events-none"
      />

      {/* ----- HERO FOREGROUND CONTENT ----- */}
      <motion.div 
        style={{ y }} 
        className="container mx-auto px-6 z-10 pt-20"
      >
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-5xl"
        >
          {/* Tagline Reveal */}
          <div className="overflow-hidden mb-6">
            <motion.p variants={maskRevealVariants} className="text-[#d4a762] font-mono tracking-[0.2em] uppercase text-sm md:text-base font-semibold flex items-center gap-4">
              <span className="w-12 h-[2px] bg-[#d4a762]"></span> Code & Motion.
            </motion.p>
          </div>

          {/* Epic Main Headings with Line Masking (Much smoother than letters) */}
          <h1 className="text-5xl md:text-8xl lg:text-[7.5rem] font-bold text-[#ededed] tracking-tighter leading-[0.9] flex flex-col mb-8">
            <div className="overflow-hidden py-2">
              <motion.span variants={maskRevealVariants} className="block font-['Syne']">Hi, I'm Shaikh</motion.span>
            </div>
            <div className="overflow-hidden py-2">
              <motion.span variants={maskRevealVariants} className="block font-['Syne']">Mohammed <span className="text-[#d4a762] italic font-medium pr-4">Ishaque.</span></motion.span>
            </div>
          </h1>

          <div className="overflow-hidden mb-6 max-w-2xl">
            <motion.h2 variants={maskRevealVariants} className="text-2xl md:text-3xl lg:text-4xl text-gray-300 font-light leading-tight">
              Frontend Developer shaping <br />
              the future with <strong className="font-semibold text-white">React & Next.js</strong>
            </motion.h2>
          </div>

          <motion.p variants={fadeUpVariants} className="text-gray-500 max-w-xl text-lg md:text-xl font-light leading-relaxed mb-12">
            I construct scalable architectures and fuse them with hardware-accelerated animations to deliver award-winning web experiences.
          </motion.p>

          {/* ----- ADVANCED CTA BUTTONS ----- */}
          <motion.div variants={fadeUpVariants} className="flex flex-wrap items-center gap-6 mt-10">
            
            {/* Primary Button - Inner fill expansion */}
            <Link href="#projects">
              <MagneticButton>
                <div className="relative group overflow-hidden rounded-full bg-[#d4a762] text-[#0f0f0f] px-10 py-4 font-bold tracking-widest text-xs uppercase cursor-pointer">
                   <div className="absolute inset-0 bg-white transform translate-y-[100%] rounded-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)]" />
                   <span className="relative z-10">Explore Work</span>
                </div>
              </MagneticButton>
            </Link>

            {/* Secondary Button - Border expanding */}
            <Link href="#contact">
              <MagneticButton>
                <div className="relative group rounded-full border border-white/20 text-white px-10 py-4 font-bold tracking-widest text-xs uppercase cursor-pointer hover:border-[#d4a762] transition-colors duration-500">
                  <span className="relative z-10 group-hover:text-[#d4a762] transition-colors duration-300">Contact Me</span>
                </div>
              </MagneticButton>
            </Link>

            {/* External / Outline Button */}
            <a href="https://github.com/ISHAQUE9812" target="_blank" rel="noopener noreferrer">
              <MagneticButton>
                 <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all duration-300">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                 </div>
              </MagneticButton>
            </a>

          </motion.div>
        </motion.div>
      </motion.div>
    </motion.section>
  );
}