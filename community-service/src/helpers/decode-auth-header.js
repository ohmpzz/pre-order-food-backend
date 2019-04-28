import jwt from 'jsonwebtoken';

class DecodeAuthHeader {
  decode() {
    return (req, res, next) => {
      if (
        req.headers.authorization &&
        req.headers.authorization.split(' ')[1]
      ) {
        req.user = jwt.decode(req.headers.authorization.split(' ')[1]);
        return next();
      }
      return next();
    };
  }
}

export default new DecodeAuthHeader();
