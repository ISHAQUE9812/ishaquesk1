'use client';

import { useState, useRef, useEffect, ReactNode, MouseEvent } from 'react';
import { motion, AnimatePresence, useSpring, useTransform } from 'framer-motion';

// --- ANIMATION VARIANTS ---
const cinematicEase = [0.16, 1, 0.3, 1] as const;

const textReveal = {
  hidden: { y: "120%", opacity: 0, rotateZ: 3 },
  visible: { 
    y: "0%", 
    opacity: 1, 
    rotateZ: 0, 
    transition: { duration: 1.2, ease: cinematicEase } 
  }
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: cinematicEase } }
};

// --- MAGNETIC BUTTON COMPONENT ---
const MagneticButton = ({ children, onClick, type = "button", className = "" }: any) => {
  const ref = useRef<HTMLButtonElement>(null);
  const x = useSpring(0, { stiffness: 150, damping: 15, mass: 0.1 });
  const y = useSpring(0, { stiffness: 150, damping: 15, mass: 0.1 });

  const handleMouse = (e: MouseEvent<HTMLButtonElement>) => {
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current!.getBoundingClientRect();
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    x.set(middleX * 0.2); // Magnetic pull strength
    y.set(middleY * 0.2);
  };

  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.button
      ref={ref}
      type={type}
      onClick={onClick}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      style={{ x, y }}
      whileTap={{ scale: 0.95 }}
      className={`relative overflow-hidden rounded-full group ${className}`}
    >
      <div className="absolute inset-0 bg-gold translate-y-[100%] rounded-full group-hover:translate-y-[0%] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] z-0" />
      <span className="relative z-10 flex items-center justify-center gap-2 group-hover:text-dark transition-colors duration-500">
        {children}
      </span>
    </motion.button>
  );
};

export default function Contact() {
  const [formState, setFormState] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [time, setTime] = useState<string>('');

  // Clock for the "Agency" feel
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', timeZoneName: 'short' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate submission delay for premium feel
    setTimeout(() => setSubmitted(true), 1500);
  };

  return (
    <section className="relative min-h-screen py-32 bg-dark overflow-hidden flex items-center">
      {/* Background subtle noise/glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gold/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-12 gap-16 lg:gap-8 items-start">
          
          {/* === LEFT COLUMN: MASSIVE TYPOGRAPHY === */}
          <div className="lg:col-span-7 flex flex-col justify-between h-full">
            <div>
              <div className="overflow-hidden mb-2">
                <motion.p 
                  variants={textReveal} initial="hidden" whileInView="visible" viewport={{ once: true }}
                  className="text-gold uppercase tracking-[0.3em] text-sm md:text-base font-semibold"
                >
                  Got an idea?
                </motion.p>
              </div>
              
              <h2 className="text-6xl md:text-[7rem] lg:text-[8.5rem] leading-[0.9] font-bold font-syne text-white tracking-tighter">
                <div className="overflow-hidden pb-4">
                  <motion.div variants={textReveal} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                    Let&apos;s build
                  </motion.div>
                </div>
                <div className="overflow-hidden pb-4">
                  <motion.div variants={textReveal} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ delay: 0.1 }}>
                    together<span className="text-gold">.</span>
                  </motion.div>
                </div>
              </h2>
            </div>

            {/* Micro-info (Time & Status) */}
            <motion.div 
              variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ delay: 0.4 }}
              className="mt-16 lg:mt-32 flex flex-col sm:flex-row gap-8 sm:gap-16 text-gray-400 text-sm uppercase tracking-widest"
            >
              <div>
                <p className="text-gray-600 mb-2">Local Time</p>
                <p className="text-white font-medium">{time || 'Loading...'}</p>
              </div>
              <div>
                <p className="text-gray-600 mb-2">Availability</p>
                <p className="text-white font-medium flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  Accepting new projects
                </p>
              </div>
            </motion.div>
          </div>

          {/* === RIGHT COLUMN: OVERSIZED FORM === */}
          <div className="lg:col-span-5 w-full max-w-lg lg:ml-auto">
            <AnimatePresence mode="wait">
              {!submitted ? (
                <motion.form
                  key="form"
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
                  transition={{ duration: 0.8, ease: cinematicEase }}
                  viewport={{ once: true }}
                  onSubmit={handleSubmit}
                  className="space-y-12"
                >
                  {/* Premium Form Fields */}
                  {[
                    { id: 'name', type: 'text', label: 'What is your name?', placeholder: 'Ishaque Shaikh *' },
                    { id: 'email', type: 'email', label: 'What is your email?', placeholder: 'ishaques9812 *' },
                  ].map((field, idx) => (
                    <div key={field.id} className="relative group">
                      <p className="text-gray-500 text-sm mb-4 transition-colors group-hover:text-gold">0{idx + 1} // {field.label}</p>
                      <input
                        type={field.type}
                        id={field.id}
                        required
                        value={(formState as any)[field.id]}
                        onChange={(e) => setFormState({ ...formState, [field.id]: e.target.value })}
                        onFocus={() => setFocusedField(field.id)}
                        onBlur={() => setFocusedField(null)}
                        className="w-full bg-transparent text-2xl md:text-3xl font-light text-white placeholder-gray-700 border-none outline-none pb-4"
                        placeholder={field.placeholder}
                      />
                      {/* Animated underline */}
                      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gray-800">
                        <motion.div 
                          initial={{ scaleX: 0 }}
                          animate={{ scaleX: focusedField === field.id || (formState as any)[field.id] ? 1 : 0 }}
                          transition={{ duration: 0.5, ease: cinematicEase }}
                          className="w-full h-[2px] bg-gold origin-left"
                        />
                      </div>
                    </div>
                  ))}

                  {/* Message Field */}
                  <div className="relative group">
                    <p className="text-gray-500 text-sm mb-4 transition-colors group-hover:text-gold">03 // Tell me about your project</p>
                    <textarea
                      id="message"
                      rows={3}
                      required
                      value={formState.message}
                      onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                      onFocus={() => setFocusedField('message')}
                      onBlur={() => setFocusedField(null)}
                      className="w-full bg-transparent text-2xl md:text-3xl font-light text-white placeholder-gray-700 border-none outline-none pb-4 resize-none"
                      placeholder="Hi Ishaque, I need a..."
                    />
                    <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gray-800">
                      <motion.div 
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: focusedField === 'message' || formState.message ? 1 : 0 }}
                        transition={{ duration: 0.5, ease: cinematicEase }}
                        className="w-full h-[2px] bg-gold origin-left"
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-4">
                    <MagneticButton type="submit" className="w-full py-6 rounded-full border border-gray-700 text-xl font-medium text-white">
                      Send Message
                      <svg className="w-5 h-5 -rotate-45" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </MagneticButton>
                  </div>
                </motion.form>

              ) : (
                /* === SUCCESS STATE === */
                <motion.div
                  key="success"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, ease: cinematicEase }}
                  className="flex flex-col items-center justify-center text-center py-20 bg-dark/50 rounded-3xl border border-white/5 backdrop-blur-md"
                >
                  <motion.div 
                    initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", delay: 0.2 }}
                    className="w-24 h-24 bg-gold text-dark rounded-full flex items-center justify-center mb-8"
                  >
                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </motion.div>
                  <h3 className="text-4xl font-bold font-syne text-white mb-4">Message Sent</h3>
                  <p className="text-gray-400 text-lg max-w-xs mx-auto">
                    Thank you for reaching out. I&apos;ll get back to you within 24 hours.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* === BOTTOM TYPOGRAPHIC SOCIALS === */}
        <motion.div 
          variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ delay: 0.6 }}
          className="mt-32 pt-8 border-t border-white/10 flex flex-wrap gap-8 justify-between items-center text-sm uppercase tracking-widest font-medium text-gray-400"
        >
          <a href="mailto:ishaques9812@gmail.com" className="hover:text-gold transition-colors duration-300">
            ishaques9812@gmail.com
          </a>
          <div className="flex gap-8">
            {[
              { name: 'GitHub', url: 'https://github.com/ISHAQUE9812' },
              { name: 'LinkedIn', url: 'https://www.linkedin.com/in/ishaque-shaikh-129a94211/' }
            ].map((link) => (
              <a 
                key={link.name} 
                href={link.url} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="group relative hover:text-white transition-colors duration-300"
              >
                {link.name} <span className="text-gold opacity-0 group-hover:opacity-100 transition-opacity">↗</span>
                <span className="absolute -bottom-2 left-0 w-0 h-[1px] bg-gold group-hover:w-full transition-all duration-500 ease-out" />
              </a>
            ))}
          </div>
        </motion.div>

      </div>
    </section>
  );
}