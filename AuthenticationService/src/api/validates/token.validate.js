import Joi from 'joi';

const Schema = Joi.object().keys({
  token: Joi.string().regex(/^[\w-]+\.[\w-]+\.[\w-]+$/),
});

export class Validate {
  check() {
    return (req, res, next) => {
      const { error, value } = this.validate(req).catch(error => {
        return res.status(400).json({ error });
      });
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
