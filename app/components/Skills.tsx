'use client';

import { motion } from 'framer-motion';
import { staggerContainer, scaleIn } from '@/lib/animations';

const skills = {
  Frontend: ['React.js', 'Next.js', 'TypeScript', 'JavaScript', 'Tailwind CSS', 'Framer Motion'],
  Backend: ['Node.js', 'Express.js', 'MongoDB', 'REST APIs', 'JWT Authentication'],
  Tools: ['Git', 'GitHub', 'Docker', 'AWS', 'Vercel'],
};

export default function Skills() {
  return (
    <section className="py-32 container mx-auto px-6">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-4xl font-bold text-center mb-16"
      >
        Technical <span className="text-gold">Skills</span>
      </motion.h2>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="grid md:grid-cols-3 gap-8"
      >
        {Object.entries(skills).map(([category, items]) => (
          <motion.div
            key={category}
            variants={scaleIn}
            whileHover={{
              scale: 1.05,
              rotateX: 5,
              rotateY: 5,
              boxShadow: '0 20px 40px rgba(212, 167, 98, 0.2)',
              borderColor: '#d4a762',
            }}
            transition={{ type: 'spring', stiffness: 300 }}
            className="glass rounded-2xl p-6 border border-white/10 hover:border-gold/50"
          >
            <h3 className="text-xl font-semibold text-gold mb-4">{category}</h3>
            <ul className="space-y-2">
              {items.map((skill) => (
                <motion.li
                  key={skill}
                  whileHover={{ x: 5, color: '#d4a762' }}
                  className="text-gray-300 transition-colors"
                >
                  {skill}
                </motion.li>
              ))}
            </ul>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}