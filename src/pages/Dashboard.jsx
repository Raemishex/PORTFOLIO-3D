import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast, Toaster } from 'react-hot-toast';
import useAuthStore from '../store/useAuthStore';
import './Dashboard.css';

const Dashboard = () => {
  const { user, updateProfile, logout, isLoading } = useAuthStore();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    image: '',
    about: '',
    about_az: '',
    themeColor: '#00ff9d',
    skills: '',
    instagram: '',
    linkedin: ''
  });

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }

    // Populate data
    setFormData({
      name: user.name || '',
      image: user.image || '',
      about: user.about || '',
      about_az: user.about_az || '',
      themeColor: user.themeColor || '#00ff9d',
      skills: Array.isArray(user.skills) ? user.skills.join(', ') : '',
      instagram: user.socials?.instagram || '',
      linkedin: user.socials?.linkedin || ''
    });
  }, [user, navigate]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formattedSkills = formData.skills.split(',').map(s => s.trim()).filter(Boolean);
      await updateProfile({
        name: formData.name,
        image: formData.image,
        about: formData.about,
        about_az: formData.about_az,
        themeColor: formData.themeColor,
        skills: formattedSkills,
        socials: {
          instagram: formData.instagram,
          linkedin: formData.linkedin
        }
      });
      toast.success('Profile updated successfully!');
    } catch (err) {
      toast.error('Failed to update profile');
    }
  };

  if (!user) return null;

  return (
    <div className="dashboard-page">
      <Toaster position="top-right" />

      <div className="dashboard-header">
        <h1 className="dashboard-title">Student Dashboard</h1>
        <button onClick={handleLogout} className="logout-btn">Logout</button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="dashboard-grid">
          {/* Profile Details */}
          <motion.div className="dashboard-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h3>Profile Details</h3>

            <div className="form-group">
              <label>Full Name</label>
              <input type="text" name="name" className="dash-input" value={formData.name} onChange={handleInputChange} required />
            </div>

            <div className="form-group">
              <label>Profile Image URL</label>
              <input type="text" name="image" className="dash-input" value={formData.image} onChange={handleInputChange} placeholder="https://..." />
            </div>

            <div className="form-group">
              <label>About Me (English)</label>
              <textarea name="about" className="dash-textarea" value={formData.about} onChange={handleInputChange}></textarea>
            </div>

            <div className="form-group">
              <label>About Me (Azerbaijani)</label>
              <textarea name="about_az" className="dash-textarea" value={formData.about_az} onChange={handleInputChange}></textarea>
            </div>

            <div className="form-group">
               <label>Skills (Comma separated)</label>
               <input type="text" name="skills" className="dash-input" value={formData.skills} onChange={handleInputChange} placeholder="React, Node.js, CSS" />
            </div>
          </motion.div>

          {/* Theme & Socials */}
          <motion.div className="dashboard-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <h3>Theme & Links</h3>

            <div className="form-group">
              <label>Theme Color (Neon Vibe)</label>
              <div className="color-picker">
                <input type="color" name="themeColor" value={formData.themeColor} onChange={handleInputChange} />
                <div className="color-preview" style={{ background: formData.themeColor, boxShadow: `0 0 15px ${formData.themeColor}` }}></div>
              </div>
            </div>

            <div className="form-group" style={{ marginTop: '2rem' }}>
              <label>Instagram URL</label>
              <input type="text" name="instagram" className="dash-input" value={formData.instagram} onChange={handleInputChange} />
            </div>

            <div className="form-group">
              <label>LinkedIn URL</label>
              <input type="text" name="linkedin" className="dash-input" value={formData.linkedin} onChange={handleInputChange} />
            </div>

            <div style={{ marginTop: '2rem' }}>
               <button type="submit" className="save-btn" disabled={isLoading}>
                 {isLoading ? 'Saving...' : 'Save Profile Changes'}
               </button>

               <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
                  <Link to={`/student/${user.slug}`} className="profile-link">
                    → View My Public Portfolio
                  </Link>
               </div>
            </div>
          </motion.div>
        </div>
      </form>
    </div>
  );
};

export default Dashboard;
