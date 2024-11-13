const jwt = require('jsonwebtoken');


exports.authenticateToken = (req, res, next) => {
  const { accessToken } = req.cookies;
  if (!accessToken) return res.sendStatus(401);

  jwt.verify(accessToken, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};