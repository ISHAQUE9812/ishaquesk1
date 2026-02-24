'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';
import { useRef } from 'react';

// Word reveal animation for paragraphs
const wordReveal = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.6, -0.05, 0.01, 0.99] as const }
  }
};

// Stagger container for words
const staggerWords = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.3,
    }
  }
};

export default function About() {
  const sectionRef = useRef(null);
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, -50]);

  // Split paragraph into words for animation
  const paragraphs = [
    "Results-driven Frontend Developer with 1+ year experience building responsive and scalable applications using React.js, Next.js, TypeScript, and Tailwind CSS.",
    "Focused on clean architecture, performance optimization, reusable components, and modern frontend engineering principles.",
    "I believe in creating digital experiences that are not only functional but also delightful and immersive."
  ];

  return (
    <section ref={sectionRef} className="py-32 container mx-auto px-6">
      <div className="grid md:grid-cols-2 gap-12 items-center">
        {/* Text Column */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
          }}
        >
          {/* Animated Heading */}
          <motion.h2 
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 }
            }}
            className="text-4xl font-bold mb-6"
          >
            <span className="text-gold">About</span> Me
          </motion.h2>

          {/* Animated Paragraphs with word stagger */}
          <div className="space-y-4 text-gray-300">
            {paragraphs.map((para, idx) => (
              <motion.div
                key={idx}
                variants={staggerWords}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="overflow-hidden"
              >
                <p className="inline-block">
                  {para.split(' ').map((word, i) => (
                    <motion.span
                      key={i}
                      variants={wordReveal}
                      className="inline-block mr-1"
                    >
                      {word}
                    </motion.span>
                  ))}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Optional small stats / highlight */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="mt-8 flex gap-6"
          >
            <div>
              <p className="text-3xl font-bold text-gold">1+</p>
              <p className="text-sm text-gray-400">Years Experience</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-gold">10+</p>
              <p className="text-sm text-gray-400">Projects Completed</p>
            </div>
          </motion.div>
        </motion.div>

        {/* Image Column with enhanced animation */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          style={{ y }}
          className="relative h-[400px] rounded-2xl overflow-hidden group"
        >
          {/* Animated gradient border */}
          <motion.div
            className="absolute inset-0 rounded-2xl p-[2px] bg-gradient-to-r from-gold via-gold/50 to-gold"
            animate={{
              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: 'linear',
            }}
            style={{ backgroundSize: '200% 200%' }}
          >
            <div className="w-full h-full bg-dark rounded-2xl overflow-hidden">
              {/* Image with hover scale and parallax */}
              <motion.div
                className="relative w-full h-full"
                whileHover={{ scale: 1.05 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                {/* Replace with actual image */}
                <div className="absolute inset-0 bg-gradient-to-br from-gold/20 to-transparent mix-blend-overlay" />
                <Image
                  src="/placeholder-about.jpg" // Replace with your image path
                  alt="Shaikh Mohammed Ishaque"
                  fill
                  className="object-cover object-center"
                  priority
                />
              </motion.div>
            </div>
          </motion.div>

          {/* Floating badge */}
          <motion.div
            className="absolute bottom-4 left-4 bg-dark/80 backdrop-blur-sm px-4 py-2 rounded-full border border-gold/30 text-sm text-gold"
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
          >
            ✦ Open to opportunities
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}