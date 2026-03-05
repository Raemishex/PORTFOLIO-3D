import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    slug: { type: String, unique: true },
    dob: { type: String, default: '2000-01-01' },
    cursorType: { type: String, default: 'default' },
    audioTrack: { type: String, default: '' },
    image: { type: String, default: '/assets/images/placeholder.jpg' },
    themeColor: { type: String, default: '#00ff9d' },
    typography: { type: String, default: "'Space Grotesk', sans-serif" },
    layoutType: { type: Number, default: 1 },
    isCyberpunk: { type: Boolean, default: false },
    about: { type: String, default: 'Passionate student learning full-stack development.' },
    about_az: { type: String, default: 'Full-stack inkişafı öyrənən həvəsli tələbə.' },
    skills: { type: [String], default: ['HTML', 'CSS', 'JavaScript'] },
    socials: {
      instagram: { type: String, default: '#' },
      linkedin: { type: String, default: '#' },
    },
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  },
  { timestamps: true }
);

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Generate a slug from name before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password') && !this.isNew) {
    next();
  }

  if (this.isModified('password')) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }

  if (this.isNew || this.isModified('name')) {
    let baseSlug = this.name.toLowerCase()
      .replace(/ə/g, 'e').replace(/ş/g, 's').replace(/ç/g, 'c')
      .replace(/ğ/g, 'g').replace(/ö/g, 'o').replace(/ü/g, 'u').replace(/ı/g, 'i')
      .replace(/ /g, '-').replace(/[^\w-]+/g, '');

    // Check for unique slug
    let uniqueSlug = baseSlug;
    let counter = 1;
    while (await mongoose.models.User.findOne({ slug: uniqueSlug })) {
      uniqueSlug = `${baseSlug}-${counter}`;
      counter++;
    }
    this.slug = uniqueSlug;
  }
});

const User = mongoose.model('User', userSchema);
export default User;
