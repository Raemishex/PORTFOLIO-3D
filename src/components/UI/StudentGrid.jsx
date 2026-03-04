import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import useStore from '../../store/useStore';
import { students as originalStudents } from '../../data/students';
import { motion, useMotionValue, useTransform, Reorder } from 'framer-motion';
import useSound from 'use-sound';
import { usePortfolio } from '../../context/PortfolioContext';
import gsap from 'gsap';
import { useTranslation } from 'react-i18next';
import ParallaxWrapper from './ParallaxWrapper';
import ImageWithSkeleton from './ImageWithSkeleton';
import './StudentGrid.css';

const TiltCard = ({ student, isActive, onClick }) => {
  const { audioEnabled } = usePortfolio();
  const [playHover] = useSound('/sounds/hover.wav', { volume: 0.2, soundEnabled: audioEnabled });
  const [playClick] = useSound('/sounds/click.wav', { volume: 0.5, soundEnabled: audioEnabled });
  
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useTransform(y, [-100, 100], [15, -15]);
  const rotateY = useTransform(x, [-100, 100], [-15, 15]);

  const handleMouseMove = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;
    
    const xPct = mouseX - width / 2;
    const yPct = mouseY - height / 2;
    
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const handleClick = () => {
    playClick();
    onClick();
  };

  return (
    <motion.div
      style={{
        perspective: 1000,
      }}
    >
      <motion.div
        className={`grid-item glass-panel ${isActive ? 'active' : ''}`}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onMouseEnter={() => playHover()}
        onClick={handleClick}
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
          borderColor: isActive ? 'var(--neon-green)' : 'var(--glass-border)',
          boxShadow: isActive ? 'var(--glow-shadow)' : '0 8px 32px var(--shadow-color)'
        }}
        whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
        whileTap={{ scale: 0.95 }}
      >
        <div style={{ transform: "translateZ(30px)", width: '100%', height: '100%' }}>
          <ImageWithSkeleton 
            src={student.image || '/assets/images/default-avatar.png'} 
            alt={student.name} 
            className="grid-avatar"
            style={{ borderRadius: '50%', border: `2px solid ${isActive ? 'var(--neon-green)' : 'transparent'}` }}
          />
        </div>
        <div style={{ transform: "translateZ(50px)" }}>
          <span 
            className="grid-name"
            style={{ color: isActive ? 'var(--neon-green)' : 'var(--text-main)', fontWeight: 800, letterSpacing: '1px' }}
          >
            {student.name.split(' ')[0]}
          </span>
        </div>
      </motion.div>
    </motion.div>
  );
};

const MagneticTitle = () => {
  const { t, i18n } = useTranslation();
  const text = t('home.title', 'TƏLƏBƏ SEÇİN');
  const charsRef = useRef([]);

  useEffect(() => {
    let animationFrameId;
    
    const updateRepel = () => {
      const coords = useStore.getState().handCoordinates;
      if (!coords || charsRef.current.length === 0) {
        if (!coords) {
          // Spring back smoothly if hand is lost
          charsRef.current.forEach((char) => {
             if (char) {
                gsap.to(char, { x: 0, y: 0, duration: 0.8, ease: 'elastic.out(1, 0.3)', overwrite: 'auto' });
             }
          });
        }
        animationFrameId = requestAnimationFrame(updateRepel);
        return;
      }

      // coords are 0 to 1 based on camera feed
      const handX = coords.x * window.innerWidth;
      const handY = coords.y * window.innerHeight;

      charsRef.current.forEach((char, index) => {
        if (!char) return;
        const rect = char.getBoundingClientRect();
        // Char center
        const charX = rect.left + rect.width / 2;
        const charY = rect.top + rect.height / 2;

        const distanceX = charX - handX;
        const distanceY = charY - handY;
        const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

        const triggerDistance = 250; // Radius of repulsion

        if (distance < triggerDistance) {
          const repelStrength = (triggerDistance - distance) / triggerDistance;
          // Calculate repulsion force
          const forceX = (distanceX / distance) * repelStrength * 80; // Max 80px displace
          const forceY = (distanceY / distance) * repelStrength * 80;
          
          gsap.to(char, { 
            x: forceX, 
            y: forceY, 
            duration: 0.1, 
            ease: 'power2.out',
            overwrite: 'auto'
          });
        } else {
          // Return to original
          gsap.to(char, { 
            x: 0, 
            y: 0, 
            duration: 0.8, 
            ease: 'elastic.out(1, 0.3)',
            overwrite: 'auto' 
          });
        }
      });

      animationFrameId = requestAnimationFrame(updateRepel);
    };

    updateRepel();

    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  return (
    <h1 
      className="grid-title" 
      style={{ 
        fontFamily: "'Inter', sans-serif", 
        fontWeight: 900, 
        textTransform: 'uppercase', 
        letterSpacing: '4px', 
        color: 'var(--text-main)',
        display: 'flex',
        justifyContent: 'center',
        gap: '2px',
        flexWrap: 'wrap'
      }}
    >
      {text.split('').map((char, i) => (
        <span 
          key={i} 
          ref={el => charsRef.current[i] = el}
          style={{ display: 'inline-block', minWidth: char === ' ' ? '15px' : 'auto' }}
        >
          {char}
        </span>
      ))}
    </h1>
  );
};

const StudentGrid = () => {
  const { t } = useTranslation();
  const activeStudentIndex = useStore((state) => state.activeStudentIndex);
  const setActiveStudentIndex = useStore((state) => state.setActiveStudentIndex);
  const navigate = useNavigate();
  const [students, setStudents] = useState(originalStudents);
  const [isDragging, setIsDragging] = useState(false);

  const gridRef = useRef(null);

  useEffect(() => {
    // Scroll active item into view
    if (gridRef.current) {
      const activeEl = gridRef.current.children[activeStudentIndex];
      if (activeEl) {
        activeEl.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      }
    }
  }, [activeStudentIndex]);

  // Entrance animation for grid items
  useEffect(() => {
    if (gridRef.current) {
      gsap.fromTo(gridRef.current.children,
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.05, ease: 'power3.out', overwrite: true }
      );
    }
  }, []); // Only on mount

  const handleStudentClick = (index) => {
    if (isDragging) return;
    setActiveStudentIndex(index);
    navigate(`/student/${index}`);
  };

  const handleReorder = useCallback((newOrder) => {
    setStudents(newOrder);
  }, []);

  return (
    <div className="student-grid-wrapper active">
      <ParallaxWrapper offset={30}>
        <MagneticTitle />
        <p className="grid-subtitle" style={{ color: 'var(--text-muted)' }}>
          {t('home.subtitle', 'Sola / Sağa sürüşdürərək seçin. Baxmaq üçün klikləyin.')}
        </p>
      </ParallaxWrapper>

      <Reorder.Group
        axis="x"
        values={students}
        onReorder={handleReorder}
        className="student-grid"
        ref={gridRef}
        style={{ listStyle: 'none', margin: 0 }}
      >
        {students.map((student, index) => (
          <Reorder.Item
            key={student.id}
            value={student}
            onDragStart={() => setIsDragging(true)}
            onDragEnd={() => setTimeout(() => setIsDragging(false), 100)}
            whileDrag={{ scale: 1.1, zIndex: 50, boxShadow: '0 10px 40px rgba(0,255,157,0.3)' }}
            style={{ listStyle: 'none' }}
          >
            <TiltCard
              student={student}
              isActive={index === activeStudentIndex}
              onClick={() => handleStudentClick(index)}
            />
          </Reorder.Item>
        ))}
      </Reorder.Group>
    </div>
  );
};

export default StudentGrid;
