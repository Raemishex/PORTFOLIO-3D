import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import useAuthStore from '../../store/useAuthStore';
import './ChatModal.css';

const ChatModal = ({ isOpen, onClose, receiverId, receiverName }) => {
  const { user, getSocket } = useAuthStore();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);
  const socket = getSocket();

  useEffect(() => {
    if (!isOpen || !user) return;

    const fetchMessages = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        const { data } = await axios.get(`/api/messages/${receiverId}`, config);
        setMessages(data);
        if (socket) {
           socket.emit('join chat', user._id); // Ensures user room exists
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };
    fetchMessages();
  }, [isOpen, receiverId, user, socket]);

  useEffect(() => {
    if (!socket || !isOpen) return;

    const handleNewMessage = (newMessageReceived) => {
      if (newMessageReceived.sender !== receiverId) return;
      setMessages((prev) => [...prev, newMessageReceived]);
    };

    socket.on('message received', handleNewMessage);
    return () => socket.off('message received', handleNewMessage);
  }, [socket, isOpen, receiverId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !user) return;

    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.post(
        '/api/messages',
        { receiverId, content: newMessage },
        config
      );

      socket.emit('new message', data);
      setMessages([...messages, data]);
      setNewMessage('');
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="chat-modal-overlay">
          <motion.div
            className="chat-modal-content"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
          >
            <div className="chat-header">
              <h3>
                <div className="chat-status-dot"></div>
                {receiverName}
              </h3>
              <button className="close-chat-btn" onClick={onClose}>&times;</button>
            </div>

            <div className="chat-messages">
              {messages.map((m, i) => (
                <div
                  key={m._id || i}
                  className={`chat-message ${m.sender === user?._id ? 'message-sent' : 'message-received'}`}
                >
                  {m.content}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <form className="chat-input-area" onSubmit={handleSendMessage}>
              <input
                type="text"
                placeholder="Type your message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
              />
              <button type="submit" className="send-msg-btn">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ChatModal;
