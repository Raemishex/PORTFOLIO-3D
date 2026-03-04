import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import gsap from 'gsap';
import { getStudentAge, getStudentAbout } from '../../data/students';
import useStore from '../../store/useStore';
import './Overlay.css';

const Overlay = ({ student }) => {
  const { t, i18n } = useTranslation();
  const isModalOpen = useStore((state) => state.isModalOpen);
  const contentRef = useRef(null);

  // Buttery smooth text crossfade/stagger on student change
  useEffect(() => {
    if (contentRef.current) {
      const elements = contentRef.current.children;
      gsap.fromTo(elements, 
        { y: 30, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 1, stagger: 0.1, ease: 'power4.out' }
      );
    }
  }, [student, isModalOpen]);

  return (
    <div className={`profile-wrapper ${isModalOpen ? 'active' : ''}`}>
      <div 
        className="glass-profile"
        style={{ 
          borderColor: student.themeColor,
          boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
        }}
      >
        <div ref={contentRef} className="profile-content">
          
          {/* Top Section: Avatar & Name */}
          <div className="profile-header">
            <div className="avatar-wrapper" style={{ borderColor: 'transparent' }}>
              <img 
                src={student.image} 
                alt={student.name} 
                className="profile-avatar" 
              />
            </div>
            <div className="profile-title">
              <h1 style={{ color: student.themeColor }}>
                {student.name}
              </h1>
              <span className={`age-badge ${student.dob === 'Secret' || getStudentAge(student) === 'Secret' ? 'secret' : ''}`}>
                 {t('home.age')}: {getStudentAge(student)}
              </span>
            </div>
          </div>

          <div className="profile-divider" style={{ background: `linear-gradient(90deg, transparent, ${student.themeColor}66, transparent)` }}></div>

          {/* Body Section: About & Skills */}
          <div className="profile-body">
            <h3 className="section-title">{t('overlay.about_title')}</h3>
            <p className="profile-about">
              {getStudentAbout(student, i18n.language)}
            </p>
            
            <h3 className="section-title">{t('overlay.skills_title')}</h3>
            <div className="skills-container">
              {student.skills?.map((skill, index) => (
                <span 
                  key={index} 
                  className="skill-badge"
                  style={{ 
                    border: `1px solid ${student.themeColor}55`,
                    color: "var(--text-main)"
                  }}
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Footer Section: Socials */}
          <div className="profile-footer">
            <div className="social-links">
              <a href={student.socials?.instagram || '#'} target="_blank" rel="noreferrer">Instagram</a>
              <a href={student.socials?.linkedin || '#'} target="_blank" rel="noreferrer">LinkedIn</a>
            </div>
            <p className="close-hint">{t('overlay.close_hint')}</p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Overlay;
