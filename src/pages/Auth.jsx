import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast, Toaster } from 'react-hot-toast';
import useAuthStore from '../store/useAuthStore';
import './Auth.css';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const navigate = useNavigate();

  const { login, register, isLoading, error } = useAuthStore();

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isLogin) {
        await login(formData.email, formData.password);
        toast.success('Successfully logged in!');
      } else {
        await register(formData.name, formData.email, formData.password);
        toast.success('Account created successfully!');
      }
      setTimeout(() => navigate('/dashboard'), 1500);
    } catch (err) {
       toast.error(err.response?.data?.message || 'Authentication failed');
    }
  };

  return (
    <div className="auth-page">
      <Toaster position="top-right" />
      <motion.div
        className="auth-card"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.4 }}
      >
        <h2 className="auth-title">{isLogin ? 'Login' : 'Register'}</h2>
        <p className="auth-subtitle">
          {isLogin ? 'Welcome back to Full Stack 5 Platform' : 'Join the FS5 Student Platform'}
        </p>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <AnimatePresence mode="wait">
            {!isLogin && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="input-group"
              >
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  className="auth-input"
                  value={formData.name}
                  onChange={handleInputChange}
                  required={!isLogin}
                />
              </motion.div>
            )}
          </AnimatePresence>

          <div className="input-group">
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              className="auth-input"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="input-group">
            <input
              type="password"
              name="password"
              placeholder="Password"
              className="auth-input"
              value={formData.password}
              onChange={handleInputChange}
              required
            />
          </div>

          <button type="submit" className="auth-button" disabled={isLoading}>
            {isLoading ? 'Processing...' : isLogin ? 'Sign In' : 'Sign Up'}
          </button>
        </form>

        <div className="auth-switch">
          {isLogin ? "Don't have an account?" : "Already have an account?"}
          <button onClick={() => setIsLogin(!isLogin)} disabled={isLoading}>
            {isLogin ? 'Register now' : 'Log in here'}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default Auth;
