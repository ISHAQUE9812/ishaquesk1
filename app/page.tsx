"use client";
import { useEffect, useRef } from 'react';
import TiltCard from './components/TiltCard';

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const waterCursorRef = useRef<HTMLCanvasElement>(null);

  // Water Physics Cursor
  useEffect(() => {
    const canvas = waterCursorRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let W = canvas.width = window.innerWidth;
    let H = canvas.height = window.innerHeight;

    const resize = () => {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);

    // Physics state
    let mouse = { x: W / 2, y: H / 2, vx: 0, vy: 0 };
    let lastMouse = { x: W / 2, y: H / 2 };
    let cursor = { x: W / 2, y: H / 2 };
    let isHoveringText = false;
    let currentRadius = 20;
    
    // Arrays for effects
    const particles: {x:number, y:number, vx:number, vy:number, life:number, size:number}[] = [];
    const ripples: {x:number, y:number, radius:number, alpha:number}[] = [];
    const internalRipples: {radius:number, alpha:number}[] = [];

    const handleMouseMove = (e: MouseEvent) => {
      lastMouse.x = mouse.x;
      lastMouse.y = mouse.y;
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.vx = mouse.x - lastMouse.x;
      mouse.vy = mouse.y - lastMouse.y;
      
      const target = e.target as HTMLElement;
      isHoveringText = !!target.closest('a, button, p, h1, h2, span, strong, em, .marquee-item');
    };
    
    const handleMouseClick = (e: MouseEvent) => {
      // Spawn splash particles
      for(let i=0; i<25; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 10 + 2;
        particles.push({
          x: e.clientX,
          y: e.clientY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 1,
          size: Math.random() * 12 + 4
        });
      }
      // Add ripple shockwave
      ripples.push({ x: e.clientX, y: e.clientY, radius: 10, alpha: 1 });
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseClick);

    let animFrame: number;
    function render() {
      ctx!.clearRect(0, 0, W, H);
      
      // Interpolate cursor with smooth spring physics
      cursor.x += (mouse.x - cursor.x) * 0.15;
      cursor.y += (mouse.y - cursor.y) * 0.15;

      // Calculate stretching based on velocity
      const dx = mouse.x - cursor.x;
      const dy = mouse.y - cursor.y;
      const dist = Math.sqrt(dx*dx + dy*dy);
      const angle = Math.atan2(dy, dx);
      
      const targetRadius = isHoveringText ? 35 : 20;
      currentRadius += (targetRadius - currentRadius) * 0.15;
      const stretch = Math.min(dist * 0.5, 40);

      // Add dripping trail particles when moving fast
      if (dist > 8 && Math.random() > 0.4) {
        particles.push({
          x: cursor.x - Math.cos(angle) * stretch,
          y: cursor.y - Math.sin(angle) * stretch,
          vx: (Math.random() - 0.5) * 2,
          vy: (Math.random() - 0.5) * 2,
          life: 1,
          size: Math.random() * 8 + 3
        });
      }

      ctx!.globalCompositeOperation = 'screen';
      
      // Draw main blob
      ctx!.fillStyle = '#00d9ff';
      ctx!.save();
      ctx!.translate(cursor.x, cursor.y);
      ctx!.rotate(angle);
      
      ctx!.beginPath();
      ctx!.ellipse(0, 0, currentRadius + stretch, Math.max(currentRadius - stretch * 0.3, 8), 0, 0, Math.PI * 2);
      ctx!.fill();
      
      // Draw internal ripples when hovering text
      if (isHoveringText) {
        if (Math.random() > 0.85) {
          internalRipples.push({ radius: 0, alpha: 1 });
        }
        
        ctx!.clip(); // Clip internal ripples to the blob bounds
        for (let i = internalRipples.length - 1; i >= 0; i--) {
          const ir = internalRipples[i];
          ir.radius += 2.5;
          ir.alpha -= 0.04;
          if (ir.alpha <= 0) {
            internalRipples.splice(i, 1);
            continue;
          }
          ctx!.beginPath();
          ctx!.arc(0, 0, ir.radius, 0, Math.PI * 2);
          ctx!.strokeStyle = `rgba(255, 255, 255, ${ir.alpha * 0.7})`;
          ctx!.lineWidth = 3;
          ctx!.stroke();
        }
      } else {
        internalRipples.length = 0; // clear when not hovering
      }
      
      ctx!.restore();

      // Update and draw particles (gravity + fade)
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.vy += 0.4; // Gravity
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.015; // Fade out
        p.size *= 0.96; // Shrink

        if (p.life <= 0 || p.size <= 0.5) {
          particles.splice(i, 1);
          continue;
        }

        ctx!.beginPath();
        ctx!.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(0, 217, 255, ${p.life})`;
        ctx!.fill();
      }

      // Update and draw ripples
      ctx!.globalCompositeOperation = 'source-over';
      for (let i = ripples.length - 1; i >= 0; i--) {
        const r = ripples[i];
        r.radius += 5; // Expand ripple
        r.alpha -= 0.02; // Fade out

        if (r.alpha <= 0) {
          ripples.splice(i, 1);
          continue;
        }

        ctx!.beginPath();
        ctx!.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
        ctx!.strokeStyle = `rgba(0, 217, 255, ${r.alpha})`;
        ctx!.lineWidth = 2 + r.alpha * 3;
        ctx!.stroke();
      }

      animFrame = requestAnimationFrame(render);
    }
    render();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseClick);
      cancelAnimationFrame(animFrame);
    };
  }, []);

  useEffect(() => {
    // Scroll reveal
    const reveals = document.querySelectorAll('.reveal');
    const obs = new IntersectionObserver(entries => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          setTimeout(() => e.target.classList.add('visible'), 80);
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.1 });
    reveals.forEach(el => obs.observe(el));

    // WebGL Particle Field
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext('webgl') || (canvas.getContext('experimental-webgl') as WebGLRenderingContext | null);

    let drawFrame: number;

    if (gl) {
      let W: number, H: number;
      const pts: {x: number, y: number, vx: number, vy: number, size: number}[] = [];
      const N = 180;

      const resize = () => {
        W = canvas.width = window.innerWidth;
        H = canvas.height = window.innerHeight;
        gl.viewport(0,0,W,H);
      };
      window.addEventListener('resize', resize);
      resize();

      for (let i = 0; i < N; i++) {
        pts.push({
          x: Math.random()*2-1, y: Math.random()*2-1,
          vx: (Math.random()-.5)*0.0008, vy: (Math.random()-.5)*0.0008,
          size: Math.random()*2+1
        });
      }

      const vsrc = `
        attribute vec2 pos;
        attribute float sz;
        void main(){gl_Position=vec4(pos,0,1);gl_PointSize=sz;}
      `;
      const fsrc = `
        precision mediump float;
        void main(){
          float d=length(gl_PointCoord-.5)*2.;
          float a=smoothstep(1.,0.,d);
          gl_FragColor=vec4(0.42,0.39,1.,a*0.7);
        }
      `;

      function mkShader(type: number, src: string) {
        const s = gl!.createShader(type);
        if (!s) return null;
        gl!.shaderSource(s, src); gl!.compileShader(s);
        return s;
      }
      const prog = gl!.createProgram();
      if (prog) {
        const vs = mkShader(gl!.VERTEX_SHADER, vsrc);
        const fs = mkShader(gl!.FRAGMENT_SHADER, fsrc);
        if (vs) gl!.attachShader(prog, vs);
        if (fs) gl!.attachShader(prog, fs);
        gl!.linkProgram(prog); gl!.useProgram(prog);

        const posLoc = gl!.getAttribLocation(prog,'pos');
        const szLoc = gl!.getAttribLocation(prog,'sz');
        const posBuf = gl!.createBuffer();
        const szBuf = gl!.createBuffer();

        gl!.enable(gl!.BLEND);
        gl!.blendFunc(gl!.SRC_ALPHA, gl!.ONE_MINUS_SRC_ALPHA);

        // Line buffer for connections
        const lineProg = gl!.createProgram();
        if (lineProg) {
          const lvsrc = `attribute vec2 p;void main(){gl_Position=vec4(p,0,1);}`;
          const lfsrc = `precision mediump float;uniform float alpha;void main(){gl_FragColor=vec4(0.42,0.39,1.,alpha);}`;
          const lvs = mkShader(gl!.VERTEX_SHADER, lvsrc);
          const lfs = mkShader(gl!.FRAGMENT_SHADER, lfsrc);
          if (lvs) gl!.attachShader(lineProg, lvs);
          if (lfs) gl!.attachShader(lineProg, lfs);
          gl!.linkProgram(lineProg);
          const lineBuf = gl!.createBuffer();

          let t = 0;
          function draw() {
            t++;
            gl!.clearColor(0,0,0,0);
            gl!.clear(gl!.COLOR_BUFFER_BIT);

            pts.forEach(p => {
              p.x += p.vx; p.y += p.vy;
              if (p.x > 1.1) p.x = -1.1;
              if (p.x < -1.1) p.x = 1.1;
              if (p.y > 1.1) p.y = -1.1;
              if (p.y < -1.1) p.y = 1.1;
            });

            // Draw connections
            const lineVerts = [];
            for (let i = 0; i < N; i++) {
              for (let j = i+1; j < N; j++) {
                const dx = pts[i].x - pts[j].x;
                const dy = pts[i].y - pts[j].y;
                const dist = Math.sqrt(dx*dx+dy*dy);
                if (dist < 0.35) {
                  lineVerts.push(pts[i].x, pts[i].y, pts[j].x, pts[j].y);
                }
              }
            }
            if (lineVerts.length > 0) {
              gl!.useProgram(lineProg!);
              gl!.bindBuffer(gl!.ARRAY_BUFFER, lineBuf);
              gl!.bufferData(gl!.ARRAY_BUFFER, new Float32Array(lineVerts), gl!.DYNAMIC_DRAW);
              const pLoc = gl!.getAttribLocation(lineProg!,'p');
              gl!.enableVertexAttribArray(pLoc);
              gl!.vertexAttribPointer(pLoc,2,gl!.FLOAT,false,0,0);
              gl!.uniform1f(gl!.getUniformLocation(lineProg!,'alpha'), 0.12);
              gl!.drawArrays(gl!.LINES, 0, lineVerts.length/2);
            }

            // Draw points
            gl!.useProgram(prog!);
            const posData = new Float32Array(pts.flatMap(p=>[p.x,p.y]));
            gl!.bindBuffer(gl!.ARRAY_BUFFER, posBuf);
            gl!.bufferData(gl!.ARRAY_BUFFER, posData, gl!.DYNAMIC_DRAW);
            gl!.enableVertexAttribArray(posLoc);
            gl!.vertexAttribPointer(posLoc,2,gl!.FLOAT,false,0,0);

            const szData = new Float32Array(pts.map(p=>p.size));
            gl!.bindBuffer(gl!.ARRAY_BUFFER, szBuf);
            gl!.bufferData(gl!.ARRAY_BUFFER, szData, gl!.DYNAMIC_DRAW);
            gl!.enableVertexAttribArray(szLoc);
            gl!.vertexAttribPointer(szLoc,1,gl!.FLOAT,false,0,0);

            gl!.drawArrays(gl!.POINTS, 0, N);
            drawFrame = requestAnimationFrame(draw);
          }
          draw();
        }
      }

      return () => {
        window.removeEventListener('resize', resize);
        if (drawFrame) cancelAnimationFrame(drawFrame);
      };
    }
  }, []);

  return (
    <>
      <svg className="hidden absolute w-0 h-0">
        <defs>
          <filter id="gooey">
            <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
            <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7" result="gooey" />
            <feBlend in="SourceGraphic" in2="gooey" />
          </filter>
        </defs>
      </svg>
      <canvas id="water-cursor-canvas" ref={waterCursorRef}></canvas>
      <canvas id="bg-canvas" ref={canvasRef}></canvas>

      <div className="awwward-badge">Portfolio 2025</div>

      <div className="wrap">
        {/* NAV */}
        <nav>
          <div className="nav-logo">SI<span>.</span></div>
          <ul className="nav-links">
            <li><a href="#about">About</a></li>
            <li><a href="#experience">Work</a></li>
            <li><a href="#projects">Projects</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
          <a href="mailto:ishaque9812@gmail.com" className="nav-cta">Hire Me</a>
        </nav>

        {/* HERO */}
        <section id="hero">
          <div className="hero-inner">
            <p className="hero-tag">Full Stack Developer — Mumbai</p>
            <h1 className="hero-name">
              <span className="glitch" data-text="SHAIKH">SHAIKH</span>
              <span className="line2 glitch" data-text="ISHAQUE">ISHAQUE</span>
            </h1>
            <p className="hero-desc">
              Building modern, scalable web applications with pixel-perfect precision. 
              Specializing in React, Next.js 15, TypeScript & full-stack architecture.
            </p>
            <div className="hero-btns">
              <a href="#projects" className="btn-primary">View Work</a>
              <a href="#contact" className="btn-outline">Let&apos;s Talk</a>
            </div>
          </div>
          <div className="hero-scroll">
            <span className="scroll-line"></span>
            Scroll to explore
          </div>
          <div className="hero-stats">
            <div className="stat">
              <div className="stat-num">3<span>+</span></div>
              <div className="stat-label">Live Platforms</div>
            </div>
            <div className="stat">
              <div className="stat-num">1<span>yr</span></div>
              <div className="stat-label">Experience</div>
            </div>
            <div className="stat">
              <div className="stat-num">10<span>+</span></div>
              <div className="stat-label">Technologies</div>
            </div>
          </div>
        </section>

        {/* MARQUEE */}
        <div className="marquee-section">
          <div className="marquee-track" id="marquee">
            <span className="marquee-item">Next.js 15</span>
            <span className="marquee-item">React.js</span>
            <span className="marquee-item">TypeScript</span>
            <span className="marquee-item">Node.js</span>
            <span className="marquee-item">MongoDB</span>
            <span className="marquee-item">Tailwind CSS</span>
            <span className="marquee-item">AWS</span>
            <span className="marquee-item">REST APIs</span>
            <span className="marquee-item">JWT Auth</span>
            <span className="marquee-item">Docker</span>
            <span className="marquee-item">ShadCN UI</span>
            <span className="marquee-item">GSAP</span>
            <span className="marquee-item">Express.js</span>
            <span className="marquee-item">Framer Motion</span>
            <span className="marquee-item">Next.js 15</span>
            <span className="marquee-item">React.js</span>
            <span className="marquee-item">TypeScript</span>
            <span className="marquee-item">Node.js</span>
            <span className="marquee-item">MongoDB</span>
            <span className="marquee-item">Tailwind CSS</span>
            <span className="marquee-item">AWS</span>
            <span className="marquee-item">REST APIs</span>
            <span className="marquee-item">JWT Auth</span>
            <span className="marquee-item">Docker</span>
            <span className="marquee-item">ShadCN UI</span>
            <span className="marquee-item">GSAP</span>
            <span className="marquee-item">Express.js</span>
            <span className="marquee-item">Framer Motion</span>
          </div>
        </div>

        {/* ABOUT */}
        <section id="about">
          <div className="about-left reveal">
            <p className="section-label">About Me</p>
            <h2 className="section-title">Crafting Digital<br/><em>Experiences</em></h2>
            <p className="about-text">
              Highly motivated Full Stack Developer with a passion for building modern, responsive, and scalable web applications. 
              Currently contributing to live B2B platforms at <strong style={{color:'#fff'}}>Uneefy Intratech Pvt Ltd.</strong>, 
              where I architect end-to-end solutions that serve real users at scale.<br/><br/>
              From Mumbai, with a Computer Engineering background — I believe great software is built at the intersection of clean code and exceptional user experience.
            </p>
          </div>
          <div className="about-right reveal">
            <div className="skill-group">
              <div className="skill-group-label">Frontend</div>
              <div className="skill-pills">
                <span className="pill">Next.js 15</span>
                <span className="pill">React.js</span>
                <span className="pill">TypeScript</span>
                <span className="pill">Tailwind CSS</span>
                <span className="pill">ShadCN UI</span>
                <span className="pill">GSAP</span>
                <span className="pill">Framer Motion</span>
              </div>
            </div>
            <div className="skill-group">
              <div className="skill-group-label">Backend & Database</div>
              <div className="skill-pills">
                <span className="pill">Node.js</span>
                <span className="pill">Express.js</span>
                <span className="pill">MongoDB</span>
                <span className="pill">JWT Auth</span>
                <span className="pill">REST APIs</span>
                <span className="pill">Docker</span>
              </div>
            </div>
            <div className="skill-group">
              <div className="skill-group-label">Tools & Deployment</div>
              <div className="skill-pills">
                <span className="pill">AWS</span>
                <span className="pill">Vercel</span>
                <span className="pill">Git / GitHub</span>
                <span className="pill">Postman</span>
                <span className="pill">Cloudinary</span>
              </div>
            </div>
          </div>
        </section>

        {/* EXPERIENCE */}
        <section id="experience">
          <div className="exp-header reveal">
            <p className="section-label">Experience</p>
            <h2 className="section-title">Where I&apos;ve<br/><em>Worked</em></h2>
          </div>
          <div className="exp-list">
            <div className="exp-item reveal">
              <div className="exp-year">Sep 2024<br/>— Present</div>
              <div className="exp-content">
                <div className="exp-co">Uneefy Intratech Pvt Ltd.</div>
                <div className="exp-role">Full Stack Web Developer</div>
                <div className="exp-projects">
                  <div className="exp-proj"><a href="https://www.esourcing.in" target="_blank" rel="noreferrer">eSourcing.in</a> — India&apos;s only online B2B Industrial platform. Built reusable UI components, REST API integration, SEO optimization using Next.js & ShadCN.</div>
                  <div className="exp-proj"><a href="https://www.sellxstock.com" target="_blank" rel="noreferrer">SellXStock.com</a> — B2B Marketplace. Full-stack: Next.js frontend, Node.js/Express API, MongoDB, JWT auth, AWS S3, Google Maps API.</div>
                  <div className="exp-proj"><a href="https://www.compressindia.in" target="_blank" rel="noreferrer">CompressIndia.in</a> — HVAC services website. Next.js 15 frontend, SEO-optimized, performance-tuned, AWS deployment.</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* PROJECTS */}
        <section id="projects">
          <div className="reveal">
            <p className="section-label">Projects</p>
            <h2 className="section-title">Selected<br/><em>Work</em></h2>
          </div>
          <div className="proj-grid">
            <TiltCard className="proj-card reveal">
              <div className="proj-num">01 — Frontend Clone</div>
              <div className="proj-title">Refokus Clone</div>
              <p className="proj-desc">Fully functional clone of the award-winning Refokus website, replicating design, animations, and responsive behavior with pixel-perfect precision.</p>
              <div className="proj-tags">
                <span className="proj-tag">React</span>
                <span className="proj-tag">Tailwind CSS</span>
                <span className="proj-tag">Framer Motion</span>
                <span className="proj-tag">JavaScript</span>
              </div>
              <a href="https://refokus-clone-nine-beta.vercel.app/" target="_blank" rel="noreferrer" className="proj-link">Live Demo</a>
            </TiltCard>
            <TiltCard className="proj-card reveal">
              <div className="proj-num">02 — Interactive UI</div>
              <div className="proj-title">Two Good Co</div>
              <p className="proj-desc">Highly interactive frontend with scroll-based storytelling, GSAP animations, and hero sections. Optimized for performance across all devices.</p>
              <div className="proj-tags">
                <span className="proj-tag">Next.js</span>
                <span className="proj-tag">GSAP</span>
                <span className="proj-tag">ScrollTrigger</span>
                <span className="proj-tag">Tailwind CSS</span>
              </div>
              <a href="#" className="proj-link">View Project</a>
            </TiltCard>
            <TiltCard className="proj-card reveal">
              <div className="proj-num">03 — B2B Platform</div>
              <div className="proj-title">SellXStock</div>
              <p className="proj-desc">Full-stack B2B marketplace with JWT auth, role-based access, AWS S3 uploads, Google Maps integration, and advanced search filters.</p>
              <div className="proj-tags">
                <span className="proj-tag">Next.js</span>
                <span className="proj-tag">Node.js</span>
                <span className="proj-tag">MongoDB</span>
                <span className="proj-tag">AWS</span>
              </div>
              <a href="https://www.sellxstock.com" target="_blank" rel="noreferrer" className="proj-link">Live Site</a>
            </TiltCard>
            <TiltCard className="proj-card reveal">
              <div className="proj-num">04 — Industrial B2B</div>
              <div className="proj-title">eSourcing.in</div>
              <p className="proj-desc">India&apos;s only online platform for Industrial B2B procurement. Contributed to frontend architecture, SEO, and scalable component systems.</p>
              <div className="proj-tags">
                <span className="proj-tag">Next.js</span>
                <span className="proj-tag">ShadCN UI</span>
                <span className="proj-tag">TypeScript</span>
                <span className="proj-tag">SEO</span>
              </div>
              <a href="https://www.esourcing.in" target="_blank" rel="noreferrer" className="proj-link">Live Site</a>
            </TiltCard>
          </div>
        </section>

        {/* CONTACT */}
        <section id="contact">
          <div className="contact-inner reveal">
            <p className="section-label" style={{justifyContent:'center'}}>Contact</p>
            <h2 className="contact-big">Let&apos;s Build<br/><em>Together</em></h2>
            <p className="contact-sub">
              Open to full-time roles, freelance projects, and collaborations.<br/>
              Based in Mumbai — available remotely worldwide.
            </p>
            <div className="contact-links">
              <a href="mailto:ishaque9812@gmail.com" className="contact-link primary">Email Me</a>
              <a href="https://github.com" target="_blank" rel="noreferrer" className="contact-link">GitHub</a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="contact-link">LinkedIn</a>
              <a href="tel:+918291890060" className="contact-link">+91 82918 90060</a>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer>
          <span>© 2025 Shaikh Ishaque — Full Stack Developer</span>
          <span>Mumbai, India ✦ Available for opportunities</span>
        </footer>
      </div>
    </>
  );
}