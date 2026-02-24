'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { staggerContainer, scaleIn } from '@/lib/animations';
import ProjectModal from './ProjectModal';

const companyProjects = [
  {
    title: 'SellXStock — B2B Marketplace',
    stack: 'Next.js, Node.js, Express, MongoDB, Docker, JWT',
    description: 'Built a scalable marketplace platform with advanced search filters, product image uploads, and containerized deployment.',
    github: 'https://github.com/ISHAQUE9812/sellxstock',
    live: 'https://www.sellxstock.com',
    featured: true,
  },
  {
    title: 'eSourcing — Industrial B2B Platform',
    stack: 'Next.js, TypeScript, Tailwind CSS',
    description: 'Contributed to frontend development, built reusable UI components, integrated REST APIs, optimized performance and SEO.',
    github: 'https://github.com/ISHAQUE9812/esourcing',
    live: 'https://www.esourcing.in',
  },
  {
    title: 'Compress India — HVAC Services',
    stack: 'Next.js, TypeScript, Tailwind CSS',
    description: 'Developed production-ready frontend with responsive architecture, SEO optimization, and performance improvements.',
    github: 'https://github.com/ISHAQUE9812/compress-india',
    live: 'https://www.compressindia.in',
  },
];

const personalProjects = [
  {
    title: 'CaterServ — Animated Catering Website',
    stack: 'Next.js, TypeScript, Tailwind, Framer Motion',
    description: 'Designed immersive UI with smooth scroll animations and reusable component architecture.',
    github: 'https://github.com/ISHAQUE9812/caterserv',
    live: 'https://caterserv.vercel.app',
  },
  {
    title: 'Refokus Clone — Creative Agency UI',
    stack: 'Next.js, Tailwind, Framer Motion',
    description: 'Modern animated website inspired by creative agencies, focusing on premium transitions and smooth interactions.',
    github: 'https://github.com/ISHAQUE9812/refokus-clone',
    live: 'https://refokus-clone.vercel.app',
  },
  {
    title: 'Sundown Clone — Interactive Experience',
    stack: 'React, SCSS, Framer Motion',
    description: 'Immersive, responsive UI experience with modern layout techniques and smooth animations.',
    github: 'https://github.com/ISHAQUE9812/sundown-clone',
    live: 'https://sundown-clone.vercel.app',
  },
  {
    title: 'Two Good Co Clone — Brand Website',
    stack: 'Next.js, Tailwind CSS',
    description: 'Pixel-perfect responsive website focusing on typography, layout precision, and clean UI implementation.',
    github: 'https://github.com/ISHAQUE9812/twogood-clone',
    live: 'https://twogood-clone.vercel.app',
  },
];

const allProjects = [...companyProjects, ...personalProjects];

export default function Projects() {
  const [selectedProject, setSelectedProject] = useState<null | typeof allProjects[0]>(null);

  return (
    <section className="py-32 container mx-auto px-6">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-4xl font-bold text-center mb-16"
      >
        Featured <span className="text-gold">Projects</span>
      </motion.h2>

      {/* Company Projects */}
      <div className="mb-16">
        <h3 className="text-2xl font-semibold text-gold mb-8">Company Projects</h3>
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {companyProjects.map((project) => (
            <ProjectCard key={project.title} project={project} onClick={() => setSelectedProject(project)} />
          ))}
        </motion.div>
      </div>

      {/* Personal Projects */}
      <div>
        <h3 className="text-2xl font-semibold text-gold mb-8">Personal Projects</h3>
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {personalProjects.map((project) => (
            <ProjectCard key={project.title} project={project} onClick={() => setSelectedProject(project)} />
          ))}
        </motion.div>
      </div>

      <AnimatePresence>
        {selectedProject && (
          <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
        )}
      </AnimatePresence>
    </section>
  );
}

function ProjectCard({ project, onClick }: { project: any; onClick: () => void }) {
  return (
    <motion.div
      variants={scaleIn}
      whileHover={{ scale: 1.02, y: -10 }}
      onClick={onClick}
      className="glass rounded-2xl p-6 cursor-pointer border border-white/10 hover:border-gold/50 transition-colors"
    >
      {project.featured && (
        <span className="inline-block px-3 py-1 mb-2 text-xs font-semibold bg-gold text-dark rounded-full">
          Featured
        </span>
      )}
      <h3 className="text-2xl font-semibold text-gold mb-2">{project.title}</h3>
      <p className="text-sm text-gray-400 mb-3">{project.stack}</p>
      <p className="text-gray-300 mb-4 line-clamp-2">{project.description}</p>
      <div className="flex gap-4">
        <a
          href={project.github}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="text-sm hover:text-gold transition-colors"
        >
          GitHub →
        </a>
        <a
          href={project.live}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="text-sm hover:text-gold transition-colors"
        >
          Live Demo →
        </a>
      </div>
    </motion.div>
  );
}