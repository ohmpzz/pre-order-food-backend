import bcrypt from 'bcryptjs';
import ms from 'ms';
import JWT from '../../helpers/jwt';
import { adminConfig } from '../../configs/jwt.config';
import Admin from '../models/admin.model';
import * as fromUser from '../models/line.model';

import { validate as adminLoginValidate } from '../validates/admin-login.validate';
import { validate as tokenValidate } from '../validates/token.validate';

const jwt = new JWT({
  secret: adminConfig.secret,
  options: adminConfig.options,
});

const saltRounds = 9;
const ONE_DAY = ms('1d');

export class AdminService {
  constructor() {}

  async findUser(req, res) {
    const payload = {
      email: req.body.email,
    };
    try {
      const user = await fromUser
        .findUserByEmail(payload.email)
        .then(payload => payload._doc);
      if (user) {
        return res.json({ ...user });
      } else {
        return res.json({
          code: 'User not found',
          message: 'not found a user',
        });
      }
    } catch (error) {
      return res.status(500).json(error);
    }
  }

  async getAdminData(req, res) {
    const payload = {
      email: req.user.email,
    };
    try {
      const admin = await Admin.getUser(payload).then(payload => {
        if (!payload) {
          res.clearCookie('ctr_user', { domain: process.env.COOKIE_DOMAIN });
          res.status(401).json({ error: 'Token went wrong' });
        }
        return payload._doc;
      });
      return res.json({ ...admin }).end();
    } catch (error) {
      return res.status(500).json(error);
    }
  }

  async getLogs(req, res) {
    const logs = await Admin.findLog();
    return res.json({ ...logs });
  }

  async login(req, res) {
    const payload = req.body;

    let admin = {};
    try {
      admin = await Admin.findUser(payload);
      if (!admin) return res.json({ success: false, msg: 'user not found' });
    } catch (error) {
      return res.status(500).json(error);
    }

    try {
      const match = await bcrypt.compare(payload.password, admin.password);
      if (!match)
        return res.json({ success: false, msg: 'password do not match' });
    } catch (error) {
      return res.status(500).json(error);
    }

    const access_token = jwt.sign({
      email: admin.email,
      roles: admin.roles,
      sub: admin._id,
    });

    try {
      const adminlog = await Admin.createAdminLog({
        token: access_token,
        user: admin._id,
      });

      Admin.upsertUser({
        email: admin.email,
        log: [...admin.log, adminlog._doc._id],
      });

      res.cookie('ctr_user', access_token, {
        maxAge: ONE_DAY,
        domain: process.env.COOKIE_DOMAIN,
      });
      return res.json({ success: true, msg: 'login success' });
    } catch (error) {
      return res.sendStatus(500);
    }
  }

  async logout(req, res) {
    const token = req.headers.authorization.split(' ')[1];
    try {
      await Admin.removeLogByToken(token);
      res.clearCookie('ctr_user', { domain: process.env.COOKIE_DOMAIN });
      return res.json({ success: true, msg: 'logout success' });
    } catch (error) {
      return res.status(500).json(error);
    }
  }

  async verify(req, res) {
    const { error, value } = tokenValidate(req);
    if (error) {
      return res.status(400).json({ error });
    }

    try {
      const decode = await jwt.verify(value.token);
      return res.json({ success: true, user: decode });
    } catch (err) {
      return res
        .status(401)
        .json({ success: false, msg: 'Admin-service: Unauthorized' });
    }
  }

  removeLog(req, res) {
    Admin.removeLog().catch(err => console.log(err));
    return res.json({});
  }

  async register(req, res) {
    const password = await bcrypt.hash(process.env.LOGIN_PASSWORD, saltRounds);
    const user = {
      email: process.env.LOGIN_USER_NAME,
      roles: {
        admin: true,
      },
      password,
    };

    try {
      await Admin.upsertUser(user);
      return res.status(200).json({
        success: true,
        msg: 'User created',
      });
    } catch (error) {
      return res
        .status(500)
        .json({ success: false, msg: 'create user failed' });
    }
  }
}

export default new AdminService();
