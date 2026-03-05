import express from 'express';
import {
    updateUserProfile,
    getAllUsers,
    getUserBySlug,
    followUser,
    unfollowUser
} from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/profile').put(protect, updateUserProfile);
router.route('/').get(getAllUsers);
router.route('/:slug').get(getUserBySlug);
router.route('/:id/follow').post(protect, followUser);
router.route('/:id/unfollow').post(protect, unfollowUser);

export default router;
