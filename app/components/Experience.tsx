'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { staggerContainer, slideFromLeft } from '@/lib/animations';

const experiences = [
  {
    company: 'Uneefy Infratech Pvt Ltd',
    role: 'Frontend Developer',
    duration: '2024 – Present · 1+ year',
    points: [
      'Developed scalable and responsive web applications using Next.js, React.js, and TypeScript.',
      'Built reusable UI components using Tailwind CSS and modern frontend architecture.',
      'Integrated REST APIs and implemented authentication flows (JWT).',
      'Optimized application performance, SEO, and Core Web Vitals.',
      'Collaborated with backend developers and designers to deliver production-ready applications.',
      'Ensured cross-browser compatibility and mobile responsiveness.',
      'Participated in deployment workflows using Docker and cloud platforms.',
    ],
  },
];

export default function Experience() {
  const { scrollYProgress } = useScroll();
  const lineHeight = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  return (
    <section className="py-32 container mx-auto px-6">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-4xl font-bold text-center mb-16"
      >
        Professional <span className="text-gold">Experience</span>
      </motion.h2>

      <div className="relative max-w-3xl mx-auto">
        {/* Timeline line */}
        <motion.div
          className="absolute left-8 top-0 w-0.5 bg-gold/30 origin-top"
          style={{ height: lineHeight }}
        />

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="space-y-12"
        >
          {experiences.map((exp, index) => (
            <motion.div
              key={index}
              variants={slideFromLeft}
              className="relative pl-16"
            >
              {/* Timeline dot */}
              <div className="absolute left-6 top-2 w-4 h-4 rounded-full bg-gold ring-4 ring-gold/20" />
              
              <div className="glass rounded-2xl p-6">
                <h3 className="text-2xl font-semibold text-gold">{exp.role}</h3>
                <p className="text-gray-400 mb-2">{exp.company} • {exp.duration}</p>
                <ul className="list-disc list-inside text-gray-300 space-y-1">
                  {exp.points.map((point, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      viewport={{ once: true }}
                    >
                      {point}
                    </motion.li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}