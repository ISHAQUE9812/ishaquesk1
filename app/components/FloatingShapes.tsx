'use client';

import { motion } from 'framer-motion';

const shapes = [
  { size: 200, left: '10%', top: '20%', delay: 0, duration: 20 },
  { size: 150, left: '70%', top: '60%', delay: 2, duration: 25 },
  { size: 100, left: '40%', top: '80%', delay: 1, duration: 18 },
  { size: 250, left: '80%', top: '30%', delay: 3, duration: 22 },
];

export default function FloatingShapes() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {shapes.map((shape, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-gold/5 blur-3xl"
          style={{
            width: shape.size,
            height: shape.size,
            left: shape.left,
            top: shape.top,
          }}
          animate={{
            x: [0, 30, -30, 0],
            y: [0, -30, 30, 0],
          }}
          transition={{
            duration: shape.duration,
            repeat: Infinity,
            delay: shape.delay,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}