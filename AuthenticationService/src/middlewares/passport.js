import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { config } from '../configs/jwt.config';

import { findUserLogOne } from '../api/models/line-log.model';

let opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: config.secret,
  issuer: config.options.issuer,
  audience: config.options.audience,
  algorithms: [config.options.algorithm],
};

passport.use(
  new JwtStrategy(opts, (payload, next) => {
    if (findUserLogOne(payload, 'expires_in') != null) {
      return next(null, payload);
    }
    return next(null, false);
  })
);

export default passport;
