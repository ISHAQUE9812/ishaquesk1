import { Variants } from "framer-motion";

const cinematicEase = [0.16, 1, 0.3, 1] as const; // Premium frictionless curve

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { 
      staggerChildren: 0.2, // Time between lines
      delayChildren: 0.1 
    }
  }
};

export const maskRevealLine: Variants = {
  hidden: { 
    y: "110%", 
    opacity: 0, 
    filter: "blur(12px)", 
    scale: 0.98,
    rotate: 2 // Gives a subtle cinematic tilt before revealing
  },
  visible: { 
    y: "0%", 
    opacity: 1, 
    filter: "blur(0px)", 
    scale: 1,
    rotate: 0,
    transition: { 
      duration: 1.4, 
      ease: cinematicEase 
    }
  }
};

export const fadeUpSubtle: Variants = {
  hidden: { opacity: 0, y: 30, filter: "blur(8px)" },
  visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 1.2, ease: cinematicEase } }
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.85, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.6, ease: cinematicEase }
  }
};

export const slideFromLeft: Variants = {
  hidden: { opacity: 0, x: -60, filter: "blur(8px)" },
  visible: {
    opacity: 1,
    x: 0,
    filter: "blur(0px)",
    transition: { duration: 0.8, ease: cinematicEase }
  }
};

export const slideFromRight: Variants = {
  hidden: { opacity: 0, x: 60, filter: "blur(8px)" },
  visible: {
    opacity: 1,
    x: 0,
    filter: "blur(0px)",
    transition: { duration: 0.8, ease: cinematicEase }
  }
};

export const blurReveal: Variants = {
  hidden: { opacity: 0, filter: "blur(16px)", scale: 0.95 },
  visible: {
    opacity: 1,
    filter: "blur(0px)",
    scale: 1,
    transition: { duration: 1.0, ease: cinematicEase }
  }
};