import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import useAuthStore from '../store/useAuthStore';
import useStore from '../store/useStore';
import MagneticButton from '../components/UI/MagneticButton';
import ChatModal from '../components/UI/ChatModal';
import TypewriterText from '../components/UI/TypewriterText';
import ParallaxDepth from '../components/UI/ParallaxDepth';
import './StudentDetails.css';
import { Helmet } from 'react-helmet-async';
import RamazanLockedProfile from '../components/Profiles/RamazanLockedProfile';
import { unlockAchievement } from '../components/UI/AchievementSystem';
import { calculateAge } from '../utils/age';

const getStudentAge = (dob) => calculateAge(dob);
const getStudentAbout = (student, lang) => lang === 'az' ? student.about_az : student.about;

const StudentDetails = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { user } = useAuthStore();
  
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const { data } = await axios.get(`/api/users/${slug}`);
        setStudent(data);
        if (user && data.followers.some(f => f._id === user._id)) {
          setIsFollowing(true);
        }
      } catch (error) {
        console.error("User not found:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStudent();
  }, [slug, user]);

  useEffect(() => {
    if (student) {
      document.body.style.setProperty('--dynamic-font', student.typography || "'Inter', sans-serif");
    }
    return () => {
       document.body.style.setProperty('--dynamic-font', "'Inter', sans-serif");
    };
  }, [student]);

  const handleFollowToggle = async () => {
    if (!user) {
      navigate('/auth');
      return;
    }
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      if (isFollowing) {
        await axios.post(`/api/users/${student._id}/unfollow`, {}, config);
        setIsFollowing(false);
      } else {
        await axios.post(`/api/users/${student._id}/follow`, {}, config);
        setIsFollowing(true);
      }
    } catch (error) {
      console.error("Follow error:", error);
    }
  };

  if (loading) {
     return <div style={{ paddingTop: '100px', textAlign: 'center' }}>Loading profile...</div>;
  }

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
    hidden: { opacity: 0, scale: 0.95, filter: 'blur(10px)' },
    visible: {
      opacity: 1,
      scale: 1,
      filter: 'blur(0px)',
      transition: {
        duration: 0.8,
        ease: [0.25, 0.8, 0.25, 1],
        staggerChildren: 0.15
      }
    },
    exit: {
      opacity: 0,
      scale: 1.05,
      filter: 'blur(10px)',
      transition: { duration: 0.5 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50, rotateX: 10 },
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      transition: { type: 'spring', damping: 15, stiffness: 100 }
    }
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
      <Helmet>
        <title>{`${student.name} | Full Stack 5 Portfolio`}</title>
        <meta name="description" content={getStudentAbout(student, i18n.language) || ""} />
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="profile" />
        <meta property="og:title" content={`${student.name} | FS5 Developer`} />
        <meta property="og:description" content={getStudentAbout(student, i18n.language)} />
        <meta property="og:image" content={student.image} />
        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:title" content={`${student.name} | FS5 Developer`} />
        <meta property="twitter:description" content={getStudentAbout(student, i18n.language)} />
        <meta property="twitter:image" content={student.image} />
      </Helmet>

      <div className="dynamic-container">
        {/* INFO SECTION (Left Column) */}
        <motion.div variants={itemVariants} className="sd-info">
          <h1 className="sd-name" style={{ color: student.themeColor }}>
            {student.name}
          </h1>
          
          <div className="sd-meta" style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <span className="sd-age" style={{ background: `${student.themeColor}22`, color: student.themeColor }}>
              {t('home.age', 'Age')}: {getStudentAge(student.dob)}
            </span>
            <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem' }}>
               Followers: {student.followers?.length || 0}
            </span>
          </div>

          {/* Social Interaction Buttons */}
          <div className="sd-actions" style={{ marginTop: '1rem', display: 'flex', gap: '1rem' }}>
             {user && user._id !== student._id && (
               <>
                 <button
                   onClick={handleFollowToggle}
                   style={{
                     padding: '0.5rem 1.5rem',
                     borderRadius: '20px',
                     background: isFollowing ? 'transparent' : student.themeColor,
                     color: isFollowing ? student.themeColor : '#000',
                     border: `2px solid ${student.themeColor}`,
                     cursor: 'pointer',
                     fontWeight: '700'
                   }}
                 >
                   {isFollowing ? 'Unfollow' : 'Follow'}
                 </button>

                 <button
                   onClick={() => setChatOpen(true)}
                   style={{
                     padding: '0.5rem 1.5rem',
                     borderRadius: '20px',
                     background: 'var(--glass-bg)',
                     color: 'var(--text-color)',
                     border: '1px solid var(--glass-border)',
                     cursor: 'pointer',
                     fontWeight: '600'
                   }}
                 >
                   Message
                 </button>
               </>
             )}
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

      {/* Real-time Chat Modal */}
      {student && (
        <ChatModal
          isOpen={chatOpen}
          onClose={() => setChatOpen(false)}
          receiverId={student._id}
          receiverName={student.name}
        />
      )}
    </motion.div>
  );
};

export default StudentDetails;
