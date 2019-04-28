import express from 'express';
import { LINE } from '../../middlewares/line-login';
import JWT from '../../helpers/jwt';
import {
  upsertUser,
  postLogout,
  addPhoneNumber,
} from '../services/line.service';
import moment from 'moment';

import { config } from '../../configs/jwt.config';

export const router = express.Router();
export const jwt = new JWT({ secret: config.secret, options: config.options });

router.get('/', LINE.auth());

router.patch('/phone', (req, res) => {
  addPhoneNumber(req, res);
});

router.get(
  '/callback',
  LINE.callback(async (req, res, next, token) => {
    const DATE_NOW = moment().format();
    const { sub, name, picture, email } = { ...token.id_token };
    const profile = {
      uid: sub,
      sub,
      name,
      picture,
      email,
      expires_in: token.expires_in,
      roles: {
        user: true,
      },
    };
    const access_token = await jwt.sign({ ...profile, creationTime: DATE_NOW });
    const userLog = {
      jwt_token: access_token,
      line_token: token.access_token,
      refresh_token: token.refresh_token,
      expires_in: token.expires_in,
      uid: profile.sub,
    };
    await upsertUser({ profile: { ...profile, email }, userLog });

    res.cookie('token', access_token, {
      maxAge: jwt.SEVEN_DAYS,
      domain: process.env.COOKIE_DOMAIN,
    });
    res.redirect(process.env.REDIRECT_URI);
  })
);

router.post('/logout', (req, res) => {
  postLogout(req, res);
});
