import request from 'request-promise';
import JWT from '../helpers/jwt';
import * as JwtConfig from '../configs/jwt.config';

export class ValidateUser {
  constructor() {}

  auth(authority = ['']) {
    return async (req, res, next) => {
      const token = this.check_user(req);
      if (!token) {
        return res.status(401).json({ success: false, msg: 'Unauthorized' });
      }
      const options = {
        method: 'POST',
        uri: process.env.AUTH_SERVICE_URI + '/user-service/admin/verify',
        body: {
          token,
        },
        auth: {
          bearer: this.genToken(),
        },
        json: true,
      };

      try {
        const user = await request(options);
        req.user = user;
        next();
      } catch (err) {
        if (err.statusCode == 401) {
          return res
            .status(401)
            .json({ success: false, msg: 'Token Unauthorized' });
        }
        return res.status(401).json({ success: false, msg: 'Unauthorized' });
      }
    };
  }

  check_user(req) {
    if (
      req.headers.authorization &&
      req.headers.authorization.split(' ')[0] === 'Bearer'
    ) {
      return req.headers.authorization.split(' ')[1];
    }

    return null;
  }

  genToken() {
    const jwt = new JWT({
      secret: JwtConfig.microservice.secret,
      options: JwtConfig.microservice.options,
    });
    const token = jwt.sign({ endpoint: 'From Community Service' });
    return token;
  }
}

export default ValidateUser;
