import Joi from 'joi';

const Schema = Joi.object().keys({
  email: Joi.string().email(),
  password: Joi.string(),
});

export class Validate {
  check() {
    return (req, res, next) => {
      const { error, value } = this.validate(req);
      if (error) {
        const { message } = error.details[0];
        return res.status(400).json({ error: message });
      }
      req.body = value;
      return next();
    };
  }

  validate(req, schema = Schema) {
    return Joi.validate(req.body, schema);
  }
}

export default new Validate();
