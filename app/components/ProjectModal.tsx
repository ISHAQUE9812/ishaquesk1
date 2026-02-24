'use client';

import { motion } from 'framer-motion';

interface ProjectModalProps {
  project: {
    title: string;
    stack: string;
    description: string;
    github: string;
    live: string;
  };
  onClose: () => void;
}

export default function ProjectModal({ project, onClose }: ProjectModalProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <motion.div
        layoutId={`project-${project.title}`}
        onClick={(e) => e.stopPropagation()}
        className="bg-dark border border-gold/30 rounded-2xl max-w-2xl w-full p-8 shadow-2xl"
      >
        <motion.h2 className="text-3xl font-bold text-gold mb-2">{project.title}</motion.h2>
        <motion.p className="text-gray-400 mb-4">{project.stack}</motion.p>
        <motion.p className="text-gray-300 mb-6">{project.description}</motion.p>
        <div className="flex gap-4">
          <a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-2 bg-gold text-dark font-semibold rounded-full hover:bg-gold/80 transition"
          >
            GitHub
          </a>
          <a
            href={project.live}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-2 border border-gold text-gold font-semibold rounded-full hover:bg-gold/10 transition"
          >
            Live Demo
          </a>
        </div>
        <motion.button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl"
        >
          &times;
        </motion.button>
      </motion.div>
    </motion.div>
  );
}