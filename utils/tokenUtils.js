const jwt = require('jsonwebtoken');

const generateAccessToken = (user) => {
  return jwt.sign(user, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRY });
};


const generateRefreshToken = (user) => {
  return jwt.sign(user, process.env.JWT_SECRET, { expiresIn: process.env.REFRESH_EXPIRY });
};


const sendTokens = (res, user) => {
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    secure: true, 
    sameSite: 'Strict',
    maxAge: 15 * 60 * 1000, 
  });

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'Strict',
    maxAge: 7 * 24 * 60 * 60 * 1000, 
  });
};
