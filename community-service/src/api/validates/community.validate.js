import Joi from 'joi';

const Schema = Joi.object()
  .keys({
    _id: Joi.string(),
    title: Joi.string()
      .min(5)
      .max(100)
      .required(),
    description: Joi.string().max(100),
    slug: Joi.string(),
    pictureUrl: Joi.string(),
    creationTime: Joi.date(),
    lastUpdateTime: Joi.date(),
    updateBy_name: Joi.string(),
    updateBy_id: Joi.string(),
  })
  .options({ stripUnknown: true });

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
