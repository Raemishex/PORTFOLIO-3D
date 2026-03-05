import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { students } from '../../data/students';
import { io } from 'socket.io-client';

const FAQ_DATA = {
  en: [
    { q: ['who', 'team', 'about', 'full stack'], a: 'FULL STACK 5 is an elite web development cohort of 10 talented developers specializing in React, Three.js, and AI-powered interactions.' },
    { q: ['tech', 'stack', 'technology', 'tools'], a: 'We use React, Vite, Three.js, Framer Motion, GSAP, MediaPipe for AI gestures, and Zustand for state management.' },
    { q: ['gesture', 'hand', 'camera', 'ai'], a: 'Our portfolio features AI-powered gesture recognition! Use hand gestures like fist (open profile), palm (go home), thumbs up (toggle audio), victory sign (switch language), and more!' },
    { q: ['contact', 'email', 'reach', 'hire'], a: 'You can reach us through the Contact page. Fill in your details and we\'ll get back to you!' },
    { q: ['student', 'member', 'developer'], a: `We have ${students.length} talented members: ${students.map(s => s.name.split(' ')[0]).join(', ')}.` },
    { q: ['hello', 'hi', 'hey', 'salam'], a: 'Hello! Welcome to FULL STACK 5 portfolio. Ask me anything about the team, tech stack, or features!' },
    { q: ['game', 'easter', 'secret', 'hidden'], a: 'Try typing "game" on your keyboard for a surprise! Also, certain hand gestures unlock hidden features...' },
    { q: ['feature', 'special'], a: 'We have AI hand gestures, custom themes, achievements, drag & drop reorder, screenshot sharing, and a hidden Snake game!' },
  ],
  az: [
    { q: ['kim', 'komanda', 'haqqında', 'full stack'], a: 'FULL STACK 5, React, Three.js və AI əsaslı interaksiyalarda ixtisaslaşmış 10 istedadlı developerdən ibarət elit veb inkişaf etdirmə komandasıdır.' },
    { q: ['texnologiya', 'stack', 'alət'], a: 'Biz React, Vite, Three.js, Framer Motion, GSAP, AI jestləri üçün MediaPipe və state management üçün Zustand istifadə edirik.' },
    { q: ['jest', 'əl', 'kamera', 'ai'], a: 'Portfoliomuzda AI əsaslı jest tanıma var! Yumruq (profil aç), açıq əl (ana səhifə), baş barmaq yuxarı (səs), qələbə işarəsi (dil dəyiş) və daha çox!' },
    { q: ['əlaqə', 'email', 'müraciət'], a: 'Əlaqə səhifəsindən bizə yaza bilərsiniz!' },
    { q: ['tələbə', 'üzv', 'developer'], a: `Komandamızda ${students.length} istedadlı üzv var: ${students.map(s => s.name.split(' ')[0]).join(', ')}.` },
    { q: ['salam', 'hey', 'merhaba'], a: 'Salam! FULL STACK 5 portfoliosuna xoş gəlmisiniz. Komanda, texnologiya və xüsusiyyətlər haqqında soruşun!' },
    { q: ['oyun', 'gizli', 'sirr'], a: 'Klaviaturada "game" yazın sürpriz üçün! Həmçinin bəzi əl jestləri gizli xüsusiyyətləri açır...' },
    { q: ['xüsusiyyət', 'nə var'], a: 'AI əl jestləri, xüsusi temalar, nailiyyətlər, sürüklə-burax sıralama, ekran paylaşma və gizli İlan oyunu var!' },
  ],
};

const Chatbot = () => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [socket, setSocket] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Initialize Socket connection to the backend
    // Vite proxy handles `/` to http://localhost:5000 in dev
    const newSocket = io(window.location.origin.includes('localhost') ? 'http://localhost:5000' : '/');
    setSocket(newSocket);

    newSocket.on('admin replied', (text) => {
      setMessages(prev => [...prev, { type: 'admin', text }]);
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const lang = i18n.language === 'az' ? 'az' : 'en';
      setMessages([{
        type: 'bot',
        text: lang === 'az'
          ? 'Salam! Mən FS5 botuyam. Komanda, texnologiya və ya xüsusiyyətlər haqqında soruşun!'
          : 'Hi! I\'m the FS5 bot. Ask me about the team, tech stack, or features!',
      }]);
    }
  }, [isOpen, messages.length, i18n.language]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const findAnswer = (query) => {
    const lang = i18n.language === 'az' ? 'az' : 'en';
    const faq = FAQ_DATA[lang];
    const words = query.toLowerCase().split(/\s+/);

    let bestMatch = null;
    let bestScore = 0;

    for (const item of faq) {
      const matchScore = item.q.reduce((score, keyword) => {
        return score + (words.some(w => w.includes(keyword) || keyword.includes(w)) ? 1 : 0);
      }, 0);

      if (matchScore > bestScore) {
        bestScore = matchScore;
        bestMatch = item;
      }
    }

    if (bestMatch && bestScore > 0) return bestMatch.a;

    return lang === 'az'
      ? 'Bu suala cavabım yoxdur. Komanda, texnologiya, jestlər və ya xüsusiyyətlər haqqında soruşun!'
      : 'I don\'t have an answer for that. Try asking about the team, tech stack, gestures, or features!';
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const text = input.trim();
    const userMsg = { type: 'user', text };

    setMessages(prev => [...prev, userMsg]);
    setInput('');

    // Send to admin via socket
    if (socket) {
      socket.emit('guest message', {
        guestId: socket.id,
        text,
        timestamp: Date.now()
      });
    }

    // Still provide the automated FAQ answer
    const answer = findAnswer(text);
    setTimeout(() => {
      setMessages(prev => [...prev, { type: 'bot', text: answer }]);
    }, 500);
  };

  return (
    <>
      {/* Chat toggle button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: 'fixed',
          bottom: '20px',
          left: '20px',
          width: '50px',
          height: '50px',
          borderRadius: '50%',
          background: 'var(--neon-green)',
          border: 'none',
          cursor: 'pointer',
          zIndex: 9998,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.4rem',
          boxShadow: '0 4px 20px rgba(0,255,157,0.3)',
          color: '#000',
          fontWeight: 900,
        }}
      >
        {isOpen ? '×' : '?'}
      </motion.button>

      {/* Chat panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            style={{
              position: 'fixed',
              bottom: '80px',
              left: '20px',
              width: '320px',
              height: '420px',
              borderRadius: '20px',
              overflow: 'hidden',
              zIndex: 9997,
              display: 'flex',
              flexDirection: 'column',
              background: 'var(--glass-bg)',
              backdropFilter: 'blur(20px)',
              border: '1px solid var(--glass-border)',
              boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
            }}
          >
            {/* Header */}
            <div style={{
              padding: '15px 20px',
              borderBottom: '1px solid var(--glass-border)',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}>
              <div style={{
                width: '8px', height: '8px', borderRadius: '50%',
                background: '#00ff9d', boxShadow: '0 0 6px #00ff9d',
              }} />
              <span style={{
                fontWeight: 700, fontSize: '0.85rem',
                color: 'var(--text-main)', letterSpacing: '1px',
              }}>
                FS5 BOT
              </span>
            </div>

            {/* Messages */}
            <div style={{
              flex: 1, overflowY: 'auto', padding: '15px',
              display: 'flex', flexDirection: 'column', gap: '10px',
            }}>
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{
                    alignSelf: msg.type === 'user' ? 'flex-end' : 'flex-start',
                    maxWidth: '85%',
                    padding: '10px 14px',
                    borderRadius: msg.type === 'user' ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
                    background: msg.type === 'user' ? 'var(--neon-green)' : 'rgba(255,255,255,0.08)',
                    color: msg.type === 'user' ? '#000' : 'var(--text-main)',
                    fontSize: '0.82rem',
                    lineHeight: 1.5,
                    fontWeight: msg.type === 'user' ? 600 : 400,
                  }}
                >
                  {msg.text}
                </motion.div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div style={{
              padding: '12px',
              borderTop: '1px solid var(--glass-border)',
              display: 'flex',
              gap: '8px',
            }}>
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder={i18n.language === 'az' ? 'Sual yazın...' : 'Ask something...'}
                style={{
                  flex: 1,
                  padding: '10px 14px',
                  borderRadius: '12px',
                  border: '1px solid var(--glass-border)',
                  background: 'rgba(255,255,255,0.05)',
                  color: 'var(--text-main)',
                  fontSize: '0.85rem',
                  outline: 'none',
                  fontFamily: 'Inter, sans-serif',
                }}
              />
              <button
                onClick={handleSend}
                style={{
                  padding: '10px 16px',
                  borderRadius: '12px',
                  background: 'var(--neon-green)',
                  border: 'none',
                  color: '#000',
                  fontWeight: 800,
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                }}
              >
                ↑
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Chatbot;
