import Joi from 'joi';
import { PreOrder } from './schemas';

export class Validate {
  /**
   *
   * @param {Object} schema
   */
  check(schema = PreOrder) {
    return (req, res, next) => {
      const { error, value } = this.validate(req, schema);
      if (error) {
        const { message } = error.details[0];
        return res.status(400).json({ error: message });
      }
      req.body = value;
      return next();
    };
  }

  validate(req, schema = PreOrder) {
    return Joi.validate(req.body, schema);
  }
}

export default new Validate();
