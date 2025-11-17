import jwt from 'jsonwebtoken';

const jwtSecret = process.env.JWT_SECRET || 'change_me_in_production';
const jwtRefreshSecret = process.env.JWT_REFRESH_SECRET || 'change_me_refresh_secret_in_production';
const accessTokenExpiry = process.env.ACCESS_TOKEN_EXPIRY || '15m';
const refreshTokenExpiry = process.env.REFRESH_TOKEN_EXPIRY || '7d';

export const generateAccessToken = (payload) => {
  return jwt.sign(payload, jwtSecret, { expiresIn: accessTokenExpiry });
};

export const generateRefreshToken = (payload) => {
  return jwt.sign(payload, jwtRefreshSecret, { expiresIn: refreshTokenExpiry });
};

export const verifyAccessToken = (token) => {
  try {
    return jwt.verify(token, jwtSecret);
  } catch (err) {
    throw new Error('Invalid or expired access token');
  }
};

export const verifyRefreshToken = (token) => {
  try {
    return jwt.verify(token, jwtRefreshSecret);
  } catch (err) {
    throw new Error('Invalid or expired refresh token');
  }
};