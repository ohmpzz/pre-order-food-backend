import ms from 'ms';

export const config = {
  secret: process.env.JWT_SECRET,
  options: {
    algorithm: 'HS256',
    expiresIn: ms('7d'),
    issuer: 'food.ohmpiromrak.com',
    audience: 'pre-order food',
  },
};

export const adminConfig = {
  secret: process.env.JWT_ADMIN_SECRET,
  options: {
    algorithm: 'HS256',
    expiresIn: ms('7d'),
    issuer: 'admin-food.ohmpiromrak.com',
    audience: 'pre-order food',
  },
};
