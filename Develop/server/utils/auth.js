const jwt = require('jsonwebtoken');

const secret = 'mysecretsshhhhh';
const expiration = '2h';

module.exports = {
  authMiddleware: function (req, res, next) {
    let token = req.query.token || req.headers.authorization;

    if (req.headers.authorization) {
      token = token.split(' ').pop().trim();
    }

    if (!token) {
      return res.status(401).json({ message: 'You are not authenticated!' });
    }

    try {
      const { data } = jwt.verify(token, secret);
      req.user = data;
      next();
    } catch (error) {
      console.error('Invalid token:', error);
      return res.status(401).json({ message: 'Invalid token!' });
    }
  },

  signToken: function ({ username, email, _id }) {
    const payload = { username, email, _id };
    return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
  },
};
