import jwt from 'jsonwebtoken';
import ms from 'ms';

import { config } from '../configs/jwt.config';

class JWT {
  constructor({ secret, duration, options }) {
    this.secret = config.secret;
    this.SEVEN_DAYS = duration || ms('7d');
    this.options = config.options;
  }

  /**
   * @param {object} payload
   */
  sign(payload) {
    if (typeof payload != 'object') {
      return null;
    }
    return jwt.sign(payload, this.secret, this.options);
  }

  verify(token) {
    if (typeof token == 'undefined') {
      return null;
    }
    return jwt.verify(token, this.secret, this.options);
  }

  decode(token) {
    if (typeof token == 'undefined') {
      return null;
    }
    return jwt.decode(token);
  }
}

export default JWT;
