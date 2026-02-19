export const calculateAge = (dob) => {
  if (dob === 'Hidden' || dob === 'Secret' || dob === null) return 'Secret';
  if (typeof dob === 'number') return dob; // Direct age provided
  
  const birthDate = new Date(dob);
  const today = new Date();
  
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
};
