import express from 'express';
import passport from 'passport';

export const router = express.Router();

router.use(passport.authenticate('jwt', { session: false }));

router.post('/', (req, res) => {
  res.json(req.user).end();
});
