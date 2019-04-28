import Joi from 'joi';
import { Order } from './schemas';

export class Validate {
  /**
   *
   * @param {Object} schema
   */
  check(schema = Order) {
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

  validate(req, schema = Order) {
    return Joi.validate(req.body, schema);
  }
}

export default new Validate();
