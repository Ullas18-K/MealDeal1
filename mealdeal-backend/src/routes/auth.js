import express from 'express';
import { register, login, refreshAccessToken, logout, getProfile } from '../controllers/authController.js';
import { verifyToken } from '../middleware/auth.js';
import { requireRole } from '../middleware/roleCheck.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/refresh', refreshAccessToken);
router.post('/logout', verifyToken, logout);
router.get('/profile', verifyToken, getProfile);

// Example: Only donors can access this route
router.get('/donor-only', verifyToken, requireRole('donor'), (req, res) => {
  res.json({ message: 'Welcome, donor!' });
});

// Example: Only NGOs can access this route
router.get('/ngo-only', verifyToken, requireRole('ngo'), (req, res) => {
  res.json({ message: 'Welcome, NGO!' });
});

// Example: Both roles can access
router.get('/both', verifyToken, requireRole('donor', 'ngo'), (req, res) => {
  res.json({ message: 'Welcome!' });
});

export default router;