import axios from 'axios';
import jwt from 'jsonwebtoken';

class Auth {
  constructor() {
    this.req = '';
  }
  /**
   * Allow user
   * @param {Array} allowedRoles - 'user' or 'admin'
   */
  allow(allowedRoles = ['user']) {
    return async (req, res, next) => {
      this.req = req;
      if (!this.getToken(req)) {
        return res
          .status(401)
          .json({ code: 'Unauthorized', msg: 'user token unauthorized' });
      }

      // Check User Token
      let user = '';
      if (!!allowedRoles.find(role => role == 'user')) {
        try {
          const credential = await this.userAuth();
          if (credential) {
            user = credential;
          }
        } catch (error) {
          console.log('user::', error);
        }
      }

      if (!!allowedRoles.find(role => role == 'admin')) {
        try {
          const credential = await this.adminAuth();
          if (credential) {
            user = credential;
          }
        } catch (error) {
          // console.log('admin::', error);
        }
      }
      console.log(user);
      if (!user) {
        return res.status(401).json({ code: 'denied permission' });
      }

      if (!allowedRoles.length) {
        return res.status(401).json({ code: 'denied permission' });
      }

      // Check user authorized
      try {
        const authorized = await this.checkAuthorization(user, allowedRoles);
        if (authorized) {
          req.user = user;
          next();
        } else {
          return res
            .status(401)
            .json({ code: 'Unauthorized', msg: 'user token unauthorized' });
        }
      } catch {
        return res
          .status(401)
          .json({ code: 'Unauthorized', msg: 'user token unauthorized' });
      }
    };
  }

  adminAuth() {
    return axios({
      url: `${process.env.PROXY_AUTH}/auth/admin/verify`,
      method: 'post',
      headers: { Authorization: `Bearer ${this.getToken()}` },
    }).then(() => jwt.decode(this.getToken()));
  }

  userAuth() {
    return axios({
      url: `${process.env.PROXY_AUTH}/auth/verify`,
      method: 'post',
      headers: { Authorization: `Bearer ${this.getToken()}` },
    }).then(() => jwt.decode(this.getToken()));
  }

  getToken(req = this.req) {
    if (
      req.headers.authorization &&
      req.headers.authorization.split(' ')[0] === 'Bearer'
    ) {
      if (req.headers.authorization.split(' ').length > 2) {
        return null;
      }
      return req.headers.authorization.split(' ')[1];
    }

    return null;
  }

  checkAuthorization(user, allowedRoles) {
    return new Promise((resolve, reject) => {
      if (!user) return reject(false);
      for (const role of allowedRoles) {
        if (user.roles[role]) {
          return resolve(true);
        }
      }
      console.log(user);
      return reject({ statusCode: 401 });
    });
  }
}

export default new Auth();
