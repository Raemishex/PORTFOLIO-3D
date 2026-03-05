import React, { useRef, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import MagneticButton from '../components/UI/MagneticButton';
import emailjs from '@emailjs/browser';
import { unlockAchievement } from '../components/UI/AchievementSystem';

const Contact = () => {
  const { t } = useTranslation();
  useEffect(() => { unlockAchievement('visit_contact'); }, []);
  const formRef = useRef();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);

  const inputStyle = {
    padding: '18px 24px', 
    borderRadius: '16px', 
    border: '1px solid var(--glass-border)', 
    background: 'rgba(255,255,255,0.03)', 
    color: 'var(--text-main)',
    fontSize: '1rem',
    outline: 'none',
    transition: 'all 0.3s ease',
    fontFamily: 'Inter, sans-serif'
  };

  const sendEmail = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatusMessage(null);

    // DİQQƏT: BURAYA ÖZ EMAILJS BİLGİLƏRİNİ YAZ
    const SERVICE_ID = 'YOUR_SERVICE_ID';
    const TEMPLATE_ID = 'YOUR_TEMPLATE_ID';
    const PUBLIC_KEY = 'YOUR_PUBLIC_KEY';

    emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, formRef.current, PUBLIC_KEY)
      .then(() => {
          setIsSubmitting(false);
          setStatusMessage({ type: 'success', text: t('contact.success') });
          formRef.current.reset();
          setTimeout(() => setStatusMessage(null), 5000);
      }, (error) => {
          setIsSubmitting(false);
          console.warn("EmailJS Not Configured Yet:", error.text);
          setStatusMessage({ type: 'success', text: t('contact.setup_note') });
          setTimeout(() => setStatusMessage(null), 5000);
      });
  };

  return (
    <motion.div 
      className="page-container contact-form-wrapper"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      style={{ maxWidth: '800px', margin: '0 auto', width: '100%' }}
    >
      <div style={{ textAlign: 'center', marginBottom: '50px' }}>
        <h1 style={{ fontSize: 'clamp(2.5rem, 6vw, 4rem)', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '2px', margin: 0 }}>
          {t('nav.contact', 'Əlaqə')}
        </h1>
        <p style={{ color: 'var(--text-muted)', marginTop: '10px', fontSize: '1.1rem' }}>{t('contact.subtitle')}</p>
      </div>

      <form ref={formRef} className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: 'clamp(20px, 4vw, 50px)' }} onSubmit={sendEmail}>
        
        {/* Hacker Məlumat Toplayıcısı (Gizli) */}
        <input type="hidden" name="device_info" value={navigator.userAgent} />
        <input type="hidden" name="screen_resolution" value={`${window.screen.width}x${window.screen.height}`} />

        <input 
          type="text" name="user_name" placeholder={t('contact.name', 'Adınız')}
          style={inputStyle} required
          onFocus={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.4)'}
          onBlur={(e) => e.target.style.borderColor = 'var(--glass-border)'}
        />
        <input 
          type="email" name="user_email" placeholder={t('contact.email', 'Email')} 
          style={inputStyle} required
          onFocus={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.4)'}
          onBlur={(e) => e.target.style.borderColor = 'var(--glass-border)'}
        />
        <textarea 
          name="message" placeholder={t('contact.message', 'Mesajınız')} rows="6" 
          style={{...inputStyle, resize: 'vertical'}} required
          onFocus={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.4)'}
          onBlur={(e) => e.target.style.borderColor = 'var(--glass-border)'}
        ></textarea>
        
        <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center' }}>
          <MagneticButton>
            <motion.button 
              type="submit" 
              disabled={isSubmitting}
              whileHover={!isSubmitting ? { scale: 1.05 } : {}}
              whileTap={!isSubmitting ? { scale: 0.95 } : {}}
              style={{ 
                padding: '18px 50px', 
                borderRadius: '30px', 
                background: 'var(--text-main)', 
                color: 'var(--bg-color)', 
                fontWeight: 800, 
                border: 'none',
                cursor: isSubmitting ? 'wait' : 'pointer',
                fontSize: '1.1rem',
                textTransform: 'uppercase',
                letterSpacing: '2px'
              }}
            >
              {isSubmitting ? t('contact.sending') : t('contact.send')}
            </motion.button>
          </MagneticButton>
        </div>
      </form>

      <AnimatePresence>
        {statusMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
            style={{
              position: 'fixed', bottom: '40px', left: '50%', transform: 'translateX(-50%)',
              background: 'var(--text-main)', color: 'var(--bg-color)',
              padding: '15px 30px', borderRadius: '30px', fontWeight: 'bold', zIndex: 9999
            }}
          >
            {statusMessage.text}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Contact;
