import bcrypt from 'bcrypt';
import User from '../models/User.js';
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken
} from '../services/tokenService.js';

const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS, 10) || 10;

export const register = async (req, res) => {
  try {
    const { name, email, password, phone, role } = req.body;
    
    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: 'Name, email, password and role are required.' });
    }

    // Validate role
    if (!['donor', 'ngo'].includes(role.toLowerCase())) {
      return res.status(400).json({ message: 'Role must be either "donor" or "ngo".' });
    }

    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ message: 'Email already in use.' });

    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const user = await User.create({ 
      name, 
      email, 
      password: hashedPassword, 
      phone,
      role: role.toLowerCase()
    });

    const accessToken = generateAccessToken({ 
      id: user._id, 
      email: user.email, 
      role: user.role 
    });
    const refreshToken = generateRefreshToken({ 
      id: user._id, 
      email: user.email, 
      role: user.role 
    });

    // Store refresh token in database
    user.refreshToken = refreshToken;
    await user.save();

    return res.status(201).json({
      message: 'User registered successfully',
      user: { 
        id: user._id, 
        name: user.name, 
        email: user.email, 
        phone: user.phone,
        role: user.role 
      },
      accessToken,
      refreshToken
    });
  } catch (err) {
    console.error('Register error:', err);
    return res.status(500).json({ message: 'Server error during registration' });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email and password are required.' });

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid credentials.' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials.' });

    const accessToken = generateAccessToken({ 
      id: user._id, 
      email: user.email, 
      role: user.role 
    });
    const refreshToken = generateRefreshToken({ 
      id: user._id, 
      email: user.email, 
      role: user.role 
    });

    // Update refresh token in database
    user.refreshToken = refreshToken;
    await user.save();

    return res.json({
      message: 'Login successful',
      user: { 
        id: user._id, 
        name: user.name, 
        email: user.email, 
        phone: user.phone,
        role: user.role 
      },
      accessToken,
      refreshToken
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ message: 'Server error during login' });
  }
};

export const refreshAccessToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(400).json({ message: 'Refresh token is required.' });

    // Verify refresh token
    const decoded = verifyRefreshToken(refreshToken);

    // Check if user exists and token matches
    const user = await User.findById(decoded.id);
    if (!user || user.refreshToken !== refreshToken) {
      return res.status(401).json({ message: 'Invalid refresh token.' });
    }

    // Generate new access token with role
    const newAccessToken = generateAccessToken({ 
      id: user._id, 
      email: user.email, 
      role: user.role 
    });

    return res.json({
      message: 'Access token refreshed successfully',
      accessToken: newAccessToken
    });
  } catch (err) {
    console.error('Refresh token error:', err);
    return res.status(401).json({ message: 'Invalid or expired refresh token' });
  }
};

export const logout = async (req, res) => {
  try {
    const userId = req.user.id;

    // Remove refresh token from database
    await User.findByIdAndUpdate(userId, { refreshToken: null });

    return res.json({ message: 'Logged out successfully' });
  } catch (err) {
    console.error('Logout error:', err);
    return res.status(500).json({ message: 'Server error during logout' });
  }
};

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password -refreshToken');
    if (!user) return res.status(404).json({ message: 'User not found.' });
    return res.json({ user });
  } catch (err) {
    console.error('Get profile error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};