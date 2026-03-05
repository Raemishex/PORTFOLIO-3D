import User from '../models/User.js';

export const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = req.body.name || user.name;
      user.dob = req.body.dob || user.dob;
      user.cursorType = req.body.cursorType || user.cursorType;
      user.audioTrack = req.body.audioTrack || user.audioTrack;
      user.image = req.body.image || user.image;
      user.themeColor = req.body.themeColor || user.themeColor;
      user.typography = req.body.typography || user.typography;
      user.layoutType = req.body.layoutType || user.layoutType;
      user.isCyberpunk = req.body.isCyberpunk !== undefined ? req.body.isCyberpunk : user.isCyberpunk;
      user.about = req.body.about || user.about;
      user.about_az = req.body.about_az || user.about_az;
      user.skills = req.body.skills || user.skills;
      if (req.body.socials) {
        user.socials.instagram = req.body.socials.instagram || user.socials.instagram;
        user.socials.linkedin = req.body.socials.linkedin || user.socials.linkedin;
      }

      if (req.body.password) {
        user.password = req.body.password;
      }

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        slug: updatedUser.slug,
        themeColor: updatedUser.themeColor,
        image: updatedUser.image,
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUserBySlug = async (req, res) => {
  try {
    const user = await User.findOne({ slug: req.params.slug })
      .select('-password')
      .populate('followers', 'name slug image')
      .populate('following', 'name slug image');

    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const followUser = async (req, res) => {
  try {
    const userToFollow = await User.findById(req.params.id);
    const currentUser = await User.findById(req.user._id);

    if (userToFollow && currentUser) {
      if (userToFollow._id.toString() === currentUser._id.toString()) {
         return res.status(400).json({ message: "You cannot follow yourself" });
      }

      // Add to followers and following
      if (!userToFollow.followers.includes(currentUser._id)) {
        userToFollow.followers.push(currentUser._id);
        currentUser.following.push(userToFollow._id);
        await userToFollow.save();
        await currentUser.save();
        res.json({ message: 'User followed successfully' });
      } else {
        res.status(400).json({ message: 'You are already following this user' });
      }
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const unfollowUser = async (req, res) => {
  try {
    const userToUnfollow = await User.findById(req.params.id);
    const currentUser = await User.findById(req.user._id);

    if (userToUnfollow && currentUser) {
      userToUnfollow.followers = userToUnfollow.followers.filter(
        id => id.toString() !== currentUser._id.toString()
      );
      currentUser.following = currentUser.following.filter(
        id => id.toString() !== userToUnfollow._id.toString()
      );
      await userToUnfollow.save();
      await currentUser.save();
      res.json({ message: 'User unfollowed successfully' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
