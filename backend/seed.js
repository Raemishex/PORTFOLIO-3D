import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from './src/models/User.js';

// Reusing logic from src/data/students.js to match the IDs exactly
const studentsData = [
  {
    name: 'Cəfər Tarverdiyev',
    email: 'cefer@example.com',
    password: 'password123',
    dob: '2000-11-29',
    cursorType: 'default',
    audioTrack: '/audio/cefer.wav',
    image: '/assets/images/placeholder.jpg',
    themeColor: '#FF2A54',
    typography: "'Space Grotesk', sans-serif",
    layoutType: 1,
    about: 'Passionate Full-Stack Developer with a knack for creating dynamic user experiences.',
    about_az: 'Dinamik istifadəçi təcrübələri yaratmaqda bacarıqlı, həvəsli Full-Stack Developer.',
    skills: ['React', 'Node.js', 'Express', 'MongoDB'],
    socials: { instagram: '#', linkedin: '#' }
  },
  {
    name: 'Mirəziz Əkbərov',
    email: 'mireziz@example.com',
    password: 'password123',
    dob: '1995-12-30',
    cursorType: 'football',
    audioTrack: '/audio/mireziz.wav',
    image: '/assets/images/placeholder.jpg',
    themeColor: '#00F0FF',
    typography: "'Playfair Display', serif",
    layoutType: 2,
    about: 'Turning coffee into code. Specialized in modern web architectures.',
    about_az: 'Qəhvəni koda çevirən developer. Müasir veb arxitekturalarında ixtisaslaşıb.',
    skills: ['React', 'Node.js', 'Three.js', 'GSAP'],
    socials: { instagram: '#', linkedin: '#' }
  },
  {
    name: 'Nurcahan Əfəndizadə',
    email: 'nurcahan@example.com',
    password: 'password123',
    dob: '2006-05-22',
    cursorType: 'default',
    audioTrack: '/audio/nurcahan.wav',
    image: '/assets/images/placeholder.jpg',
    themeColor: '#FFD700',
    typography: "'Montserrat', sans-serif",
    layoutType: 3,
    about: 'Creative developer bridging the gap between design and engineering.',
    about_az: 'Dizayn və mühəndislik arasındakı körpünü quran yaradıcı developer.',
    skills: ['React', 'Tailwind', 'Figma', 'Node.js'],
    socials: { instagram: '#', linkedin: '#' }
  },
  {
    name: 'Tutu Mehbalıyeva',
    email: 'tutu@example.com',
    password: 'password123',
    dob: '2003-04-21',
    cursorType: 'trail',
    audioTrack: '/audio/tutu.wav',
    image: '/assets/images/placeholder.jpg',
    themeColor: '#FF61A6',
    typography: "'Jost', sans-serif",
    layoutType: 1,
    about: 'Crafting pixel-perfect, buttery smooth web experiences.',
    about_az: 'Piksel-dəqiq, yağ kimi axıcı veb təcrübələr yaradan developer.',
    skills: ['React', 'Anime.js', 'CSS3', 'Node.js'],
    socials: { instagram: '#', linkedin: '#' }
  },
  {
    name: 'Rafiq Səfərov',
    email: 'rafiq@example.com',
    password: 'password123',
    dob: '1999-11-10',
    cursorType: 'football',
    audioTrack: '/audio/rafiq.wav',
    image: '/assets/images/placeholder.jpg',
    themeColor: '#30FF51',
    typography: "'Rubik', sans-serif",
    layoutType: 3,
    about: 'Full-stack problem solver. Building scalable and robust backend systems.',
    about_az: 'Full-stack problem həll edən developer. Genişlənə bilən və möhkəm backend sistemləri qurur.',
    skills: ['Node.js', 'Express', 'React', 'SQL'],
    socials: { instagram: '#', linkedin: '#' }
  },
  {
    name: 'Vüsalə Salmanova',
    email: 'vusale@example.com',
    password: 'password123',
    dob: '2002-02-18',
    cursorType: 'default',
    audioTrack: '/audio/vusale.wav',
    image: '/assets/images/placeholder.jpg',
    themeColor: '#A755FF',
    typography: "'Golos Text', sans-serif",
    layoutType: 2,
    about: 'Frontend enthusiast with a focus on UI/UX and accessibility.',
    about_az: 'UI/UX və əlçatanlığa fokuslanmış frontend həvəskarı.',
    skills: ['React', 'Vue', 'Sass', 'Node.js'],
    socials: { instagram: '#', linkedin: '#' }
  },
  {
    name: 'Rəsul Əhmədov',
    email: 'resul@example.com',
    password: 'password123',
    dob: '2003-04-11',
    cursorType: 'default',
    audioTrack: '/audio/resul.wav',
    image: '/assets/images/placeholder.jpg',
    themeColor: '#FF8800',
    typography: "'Syne', sans-serif",
    layoutType: 1,
    about: 'Dedicated to writing clean, maintainable, and efficient code.',
    about_az: 'Təmiz, davamlı və effektiv kod yazmağa həsr olunmuş developer.',
    skills: ['React', 'TypeScript', 'Node.js', 'GraphQL'],
    socials: { instagram: '#', linkedin: '#' }
  },
  {
    name: 'Ramazan Hüseynzadə',
    email: 'ramazan@example.com',
    password: 'password123',
    dob: 'Secret',
    cursorType: 'default',
    audioTrack: '/audio/ramazan.wav',
    image: '/assets/images/placeholder.jpg',
    themeColor: '#00ff9d',
    typography: "'Orbitron', sans-serif",
    layoutType: 3,
    about: 'AI Enthusiast & Cybersecurity Advocate. Focused on secure, scalable architectures and uncovering digital vulnerabilities.',
    about_az: 'AI həvəskarı və kibertəhlükəsizlik tərəfdarı. Təhlükəsiz, genişlənə bilən arxitekturalar və rəqəmsal zəifliklərin aşkarlanmasına fokuslanıb.',
    skills: ['Cybersecurity', 'AI Systems', 'React', 'Penetration Testing'],
    socials: { instagram: '#', linkedin: '#' }
  },
  {
    name: 'Rais Fətullayev',
    email: 'rais@example.com',
    password: 'password123',
    dob: '2007-04-16',
    cursorType: 'default',
    audioTrack: '/audio/rais.wav',
    image: '/assets/images/placeholder.jpg',
    themeColor: '#4DEEEA',
    typography: "'Outfit', sans-serif",
    layoutType: 2,
    about: 'Young prodigy exploring the endless possibilities of web development.',
    about_az: 'Veb inkişafın sonsuz imkanlarını araşdıran gənc istedad.',
    skills: ['HTML5', 'CSS3', 'JavaScript', 'React'],
    socials: { instagram: '#', linkedin: '#' }
  },
  {
    name: 'Rəhman Məmmədov',
    email: 'rehman@example.com',
    password: 'password123',
    dob: '1998-10-14',
    cursorType: 'default',
    audioTrack: '/audio/rehman.wav',
    image: '/assets/images/placeholder.jpg',
    themeColor: '#00ff9d',
    typography: "'Fira Code', monospace",
    layoutType: 1,
    isCyberpunk: true,
    about: 'Experienced developer pushing the boundaries of what is possible on the web.',
    about_az: 'Vebdə mümkün olanın sərhədlərini aşan təcrübəli developer.',
    skills: ['React', 'Next.js', 'Node.js', 'PostgreSQL'],
    socials: { instagram: '#', linkedin: '#' }
  }
];

export const seedDB = async () => {
  try {
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log('Seeding database with default students...');
      for (const student of studentsData) {
        await User.create(student);
      }
      console.log('Database seeded successfully!');
    }
  } catch (error) {
    console.error('Error seeding database:', error);
  }
};
