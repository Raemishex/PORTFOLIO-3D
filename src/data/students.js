const createSlug = (name) => {
  return name.toLowerCase().replace(/ə/g, 'e').replace(/ş/g, 's').replace(/ç/g, 'c').replace(/ğ/g, 'g').replace(/ö/g, 'o').replace(/ü/g, 'u').replace(/ı/g, 'i').replace(/ /g, '-').replace(/[^\w-]+/g, '');
};

const studentsData = [
  {
    id: 1,
    name: 'Cəfər Tarverdiyev',
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
    id: 2,
    name: 'Mirəziz Əkbərov',
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
    id: 3,
    name: 'Nurcahan Əfəndizadə',
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
    id: 4,
    name: 'Tutu Mehbalıyeva',
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
    id: 5,
    name: 'Rafiq Səfərov',
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
    id: 6,
    name: 'Vüsalə Salmanova',
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
    id: 7,
    name: 'Rəsul Əhmədov',
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
    id: 8,
    name: 'Ramazan Hüseynzadə',
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
    id: 9,
    name: 'Rais Fətullayev',
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
    id: 10,
    name: 'Rəhman Məmmədov',
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

export const students = studentsData.map(student => ({
  ...student,
  slug: createSlug(student.name)
}));

export const getStudentBySlug = (slug) => {
  return students.find(s => s.slug === slug);
};

import { calculateAge } from '../utils/age';
export const getStudentAge = (student) => {
  return calculateAge(student.dob);
};

export const getStudentAbout = (student, lang) => {
  if (lang === 'az' && student.about_az) return student.about_az;
  return student.about;
};
