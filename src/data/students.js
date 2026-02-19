import { calculateAge } from '../utils/age';

/*
  Student Data Structure
  ----------------------
  id: Unique identifier
  name: Full Name
  dob: Date of Birth (YYYY-MM-DD) or direct age (number) or 'Secret'
  cursorType: 'default', 'football', 'trail', 'spotlight'
  audioTrack: Path to audio file (optional)
  socials: { instagram: string, linkedin: string }
*/

export const students = [
  {
    id: 1,
    name: 'Cəfər Tarverdiyev',
    dob: '1999-11-29',
    cursorType: 'default',
    audioTrack: '/audio/cefer.mp3',
    socials: {
      instagram: '#',
      linkedin: '#'
    }
  },
  {
    id: 2,
    name: 'Mirəziz Əkbərov',
    dob: '1995-12-30',
    cursorType: 'football', // Springy Football
    audioTrack: '/audio/mirezyz.mp3',
    socials: {
      instagram: '#',
      linkedin: '#'
    }
  },
  {
    id: 3,
    name: 'Nurcahan Əfəndizadə',
    dob: '2006-05-22',
    cursorType: 'default',
    audioTrack: '/audio/nurcahan.mp3',
    socials: {
      instagram: '#',
      linkedin: '#'
    }
  },
  {
    id: 4,
    name: 'Tutu Mehbalıyeva',
    dob: '2003-04-21',
    cursorType: 'trail', // Canvas Trail
    audioTrack: '/audio/tutu.mp3',
    socials: {
      instagram: '#',
      linkedin: '#'
    }
  },
  {
    id: 5,
    name: 'Rafiq Səfərov',
    dob: '1999-11-10',
    cursorType: 'football', // Springy Football
    audioTrack: '/audio/rafiq.mp3',
    socials: {
      instagram: '#',
      linkedin: '#'
    }
  },
  {
    id: 6,
    name: 'Vüsalə Salmanova',
    dob: '2002-02-18',
    cursorType: 'default',
    audioTrack: '/audio/vusale.mp3',
    socials: {
      instagram: '#',
      linkedin: '#'
    }
  },
  {
    id: 7,
    name: 'Rəsul Əhmədov',
    dob: '2003-04-11',
    cursorType: 'default',
    audioTrack: '/audio/resul.mp3',
    socials: {
      instagram: '#',
      linkedin: '#'
    }
  },
  {
    id: 8,
    name: 'Ramazan Hüseynzadə',
    dob: 'Secret',
    cursorType: 'spotlight', // Spotlight effect
    audioTrack: '/audio/ramazan.mp3',
    socials: {
      instagram: '#',
      linkedin: '#'
    }
  },
  {
    id: 9,
    name: 'Rais Fətullayev',
    dob: 18, // Age provided directly
    cursorType: 'default',
    audioTrack: '/audio/rais.mp3',
    socials: {
      instagram: '#',
      linkedin: '#'
    }
  },
  {
    id: 10,
    name: 'Rəhman Məmmədov',
    dob: 28, // Age provided directly
    cursorType: 'default',
    audioTrack: '/audio/rehman.mp3',
    socials: {
      instagram: '#',
      linkedin: '#'
    }
  }
];

// Helper to get age for UI
export const getStudentAge = (student) => {
  return calculateAge(student.dob);
};
