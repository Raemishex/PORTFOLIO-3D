import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import useRamazanStore from '../../store/useRamazanStore';
import useSound from 'use-sound';
import { usePortfolio } from '../../context/PortfolioContext';

const CyberTerminal = () => {
  const { terminalLogs, addLog } = useRamazanStore();
  const logsEndRef = useRef(null);
  const [inputValue, setInputValue] = useState('');
  
  const { audioEnabled } = usePortfolio();
  const [playType] = useSound('/sounds/click.mp3', { volume: 0.1, soundEnabled: audioEnabled }); // Reuse click as typing
  const [playSend] = useSound('/sounds/hover.mp3', { volume: 0.3, soundEnabled: audioEnabled });

  useEffect(() => {
    // Auto-scroll to bottom
    if (logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [terminalLogs]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    playSend();
    // 1. Add User Input Log
    addLog(`[İSTİFADƏÇİ]: ${inputValue}`);
    
    // 2. Mock AI Processing (Future Gemini integration here)
    const userMessage = inputValue;
    setInputValue('');
    
    setTimeout(() => {
      // Very basic mock responses based on keywords
      const lower = userMessage.toLowerCase();
      if (lower.includes('salam') || lower.includes('hello')) {
        addLog('[GEMINI-AI]: Salam. Təhlükəsizlik sisteminə xoş gəldiniz.');
      } else if (lower.includes('hack') || lower.includes('şifrə')) {
        addLog('[GEMINI-AI]: XƏBƏRDARLIQ! Qanunsuz cəhd qeydə alındı.');
      } else {
        addLog('[GEMINI-AI]: Məlumat emal edilir... Nəticə tapılmadı.');
      }
    }, 1000);
  };

  return (
    <motion.div 
      initial={{ x: -300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ type: 'spring', damping: 20 }}
      style={{
        position: 'absolute',
        bottom: '20px',
        left: '20px',
        width: '350px',
        height: '250px',
        background: 'rgba(5, 5, 10, 0.75)',
        backdropFilter: 'blur(10px)',
        border: '1px solid var(--neon-green)',
        borderRadius: '10px',
        boxShadow: '0 0 15px rgba(0, 255, 157, 0.2)',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: "'Courier New', Courier, monospace",
        zIndex: 1000,
        overflow: 'hidden'
      }}
    >
      {/* Header */}
      <div style={{
        background: 'rgba(0, 255, 157, 0.1)',
        padding: '5px 10px',
        borderBottom: '1px solid var(--neon-green)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <span style={{ color: 'var(--neon-green)', fontSize: '0.8rem', fontWeight: 'bold' }}>TERMINAL v2.0</span>
        <div style={{ display: 'flex', gap: '5px' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'red' }}></div>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'yellow' }}></div>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--neon-green)' }}></div>
        </div>
      </div>

      {/* Logs Area */}
      <div style={{
        flex: 1,
        padding: '10px',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '5px',
        fontSize: '0.8rem'
      }}>
        {terminalLogs.map((log) => (
          <div key={log.id} style={{
            color: log.text.includes('XƏBƏRDARLIQ') || log.text.includes('Lockout') ? '#ff003c' : 
                   log.text.includes('[İSTİFADƏÇİ]') ? '#00f0ff' : 'var(--neon-green)',
            display: 'flex',
            gap: '8px',
            lineHeight: 1.4
          }}>
            <span style={{ opacity: 0.5 }}>[{log.time}]</span>
            <span style={{ wordBreak: 'break-word' }}>{log.text}</span>
          </div>
        ))}
        <div ref={logsEndRef} />
      </div>

      {/* Input Area */}
      <form onSubmit={handleSubmit} style={{
        display: 'flex',
        borderTop: '1px solid var(--glass-border)',
        padding: '5px',
        background: 'rgba(0,0,0,0.5)'
      }}>
        <span style={{ color: 'var(--neon-green)', padding: '5px', fontWeight: 'bold' }}>&gt;</span>
        <input 
          type="text" 
          value={inputValue}
          onChange={(e) => {
             setInputValue(e.target.value);
             playType();
          }}
          placeholder="Komanda daxil edin..."
          style={{
            flex: 1,
            background: 'transparent',
            border: 'none',
            outline: 'none',
            color: 'var(--neon-green)',
            fontFamily: "'Courier New', Courier, monospace",
            fontSize: '0.8rem'
          }}
        />
      </form>
    </motion.div>
  );
};

export default CyberTerminal;
