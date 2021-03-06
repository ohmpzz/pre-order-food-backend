import ms from 'ms';

export const microservice = {
  secret: process.env.MICROSERVICE_SECRET,
  options: {
    algorithm: 'HS256',
    expiresIn: ms('7d'),
  },
};
