import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { students, getStudentBySlug, getStudentAge, getStudentAbout } from '../data/students';
import useStore from '../store/useStore';
import MagneticButton from '../components/UI/MagneticButton';
import TypewriterText from '../components/UI/TypewriterText';
import ParallaxDepth from '../components/UI/ParallaxDepth';
import './StudentDetails.css';
import RamazanLockedProfile from '../components/Profiles/RamazanLockedProfile';
import { unlockAchievement } from '../components/UI/AchievementSystem';

const StudentDetails = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  
  const student = getStudentBySlug(slug);
  const isValidIndex = !!student;
  const studentIndex = isValidIndex ? students.findIndex((s) => s.slug === slug) : -1;

  // Optionally update global store focus
  const setActiveStudentIndex = useStore((state) => state.setActiveStudentIndex);
  
  useEffect(() => {
    if (student) {
      setActiveStudentIndex(studentIndex);
      document.body.style.setProperty('--dynamic-font', student.typography);
      // Track achievement: count viewed students
      const viewed = JSON.parse(localStorage.getItem('fs5_viewed_students') || '[]');
      if (!viewed.includes(student.id)) {
        viewed.push(student.id);
        localStorage.setItem('fs5_viewed_students', JSON.stringify(viewed));
      }
      if (viewed.length >= 3) unlockAchievement('view_3_students');
      if (viewed.length >= students.length) unlockAchievement('view_all_students');
    }
    return () => {
       document.body.style.setProperty('--dynamic-font', "'Inter', sans-serif");
    };
  }, [student, studentIndex, setActiveStudentIndex]);

  if (!student) {
    return <div style={{ paddingTop: '100px', textAlign: 'center' }}>{t('common.student_not_found', 'Student not found.')}</div>;
  }

  // --- SPECIAL CASE: RAMAZAN ROULETTE (The Cybersecurity Persona) ---
  if (student.id === 8) {
    return <RamazanLockedProfile student={student} />;
  }

  // Determine Layout class based on student data
  // Removed layout class logic in favor of strict CSS Grid 50/50 Desktop split

  // Framer motion variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
    exit: { opacity: 0, x: -50 }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', damping: 20 } }
  };

  return (
    <motion.div 
      className={`student-details-page ${student.isCyberpunk ? 'cyberpunk-theme' : ''}`}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      style={{ fontFamily: 'var(--dynamic-font)' }}
    >
      <div className="dynamic-container">
        {/* INFO SECTION (Left Column) */}
        <motion.div variants={itemVariants} className="sd-info">
          <h1 className="sd-name" style={{ color: student.themeColor }}>
            {student.name}
          </h1>
          
          <div className="sd-meta">
            <span className="sd-age" style={{ background: `${student.themeColor}22`, color: student.themeColor }}>
              {t('home.age', 'Age')}: {getStudentAge(student)}
            </span>
          </div>

          <div className="sd-divider" style={{ background: `linear-gradient(90deg, transparent, ${student.themeColor}aa, transparent)` }}></div>

          <div className="sd-about-section">
            <h3 className="sd-section-title">{t('home.about', 'About')}</h3>
            <p className="sd-about-text">
              <TypewriterText text={getStudentAbout(student, i18n.language)} speed={25} delay={600} />
            </p>
          </div>

          <div className="sd-skills-section">
            <h3 className="sd-section-title">{t('home.skills', 'Skills')}</h3>
            <div className="sd-skills-grid">
              {student.skills?.map((skill, index) => (
                <span 
                  key={index} 
                  className="sd-skill-badge"
                  style={{ color: student.themeColor }}
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div className="sd-socials">
             <a href={student.socials?.instagram || '#'} target="_blank" rel="noreferrer" style={{ background: student.themeColor }}>
               {t('common.instagram', 'Instagram')}
             </a>
             <a href={student.socials?.linkedin || '#'} target="_blank" rel="noreferrer" style={{ background: student.themeColor }}>
               {t('common.linkedin', 'LinkedIn')}
             </a>
          </div>
        </motion.div>

        {/* AVATAR SECTION (Right Column) */}
        <motion.div variants={itemVariants} className="sd-image-wrapper">
          <ParallaxDepth intensity={15}>
            <img src={student.image} alt={student.name} className="sd-avatar" />
          </ParallaxDepth>
        </motion.div>
      </div>

      {/* Decorative floating blur behind the profile */}
      <div className="bg-glow" style={{ background: student.themeColor }}></div>
    </motion.div>
  );
};

export default StudentDetails;
