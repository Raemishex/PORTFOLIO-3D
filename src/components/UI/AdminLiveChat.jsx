import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { io } from 'socket.io-client';

const AdminLiveChat = () => {
  const [socket, setSocket] = useState(null);
  const [guestMessages, setGuestMessages] = useState([]);
  const [replyText, setReplyText] = useState('');
  const [activeGuest, setActiveGuest] = useState(null);

  useEffect(() => {
    // Connect to server namespace
    const newSocket = io(window.location.origin.includes('localhost') ? 'http://localhost:5000' : '/');
    setSocket(newSocket);

    newSocket.on('connect', () => {
      newSocket.emit('admin setup');
    });

    newSocket.on('receive guest message', (msgData) => {
      setGuestMessages(prev => [...prev, msgData]);
    });

    return () => newSocket.disconnect();
  }, []);

  const handleReply = () => {
    if (!activeGuest || !replyText.trim() || !socket) return;

    const replyData = { guestId: activeGuest, text: replyText.trim() };
    socket.emit('admin reply', replyData);

    // add to our own log
    setGuestMessages(prev => [...prev, { guestId: activeGuest, text: replyText.trim(), type: 'admin', timestamp: Date.now() }]);
    setReplyText('');
  };

  // Group messages by guestId
  const groupedMessages = guestMessages.reduce((acc, msg) => {
    if (!acc[msg.guestId]) acc[msg.guestId] = [];
    acc[msg.guestId].push(msg);
    return acc;
  }, {});

  return (
    <div style={{ padding: '20px', background: 'var(--glass-bg)', borderRadius: '15px', color: 'white', marginTop: '40px' }}>
      <h2>Admin Live Chat</h2>
      <div className="admin-live-chat-container" style={{ display: 'flex', gap: '20px' }}>
        <div className="admin-live-chat-guests" style={{ flex: 1, borderRight: '1px solid gray', minHeight: '300px' }}>
          <h3>Guests</h3>
          {Object.keys(groupedMessages).map(guestId => (
            <div
              key={guestId}
              onClick={() => setActiveGuest(guestId)}
              style={{ padding: '10px', cursor: 'pointer', background: activeGuest === guestId ? 'var(--neon-green)' : 'transparent', color: activeGuest === guestId ? '#000' : 'white', borderRadius: '8px' }}
            >
              Guest {guestId.slice(0, 5)}... ({groupedMessages[guestId].length} msgs)
            </div>
          ))}
        </div>

        <div style={{ flex: 2, display: 'flex', flexDirection: 'column' }}>
          <h3>Chat {activeGuest && `with ${activeGuest.slice(0, 5)}`}</h3>
          <div style={{ flex: 1, overflowY: 'auto', background: 'rgba(0,0,0,0.2)', padding: '10px', borderRadius: '8px', minHeight: '200px' }}>
            {activeGuest && groupedMessages[activeGuest].map((msg, idx) => (
              <div key={idx} style={{ textAlign: msg.type === 'admin' ? 'right' : 'left', margin: '10px 0' }}>
                <span style={{ background: msg.type === 'admin' ? 'var(--neon-green)' : '#444', color: msg.type === 'admin' ? '#000' : '#fff', padding: '5px 10px', borderRadius: '10px' }}>
                  {msg.text}
                </span>
              </div>
            ))}
          </div>
          {activeGuest && (
            <div style={{ display: 'flex', marginTop: '10px' }}>
              <input value={replyText} onChange={e => setReplyText(e.target.value)} style={{ flex: 1, padding: '10px' }} placeholder="Reply..." />
              <button onClick={handleReply} style={{ padding: '10px 20px', background: 'var(--neon-green)', color: '#000', border: 'none' }}>Send</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminLiveChat;
