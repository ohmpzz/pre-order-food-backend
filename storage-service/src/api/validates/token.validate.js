import Joi from 'joi';

const Schema = Joi.object().keys({
  token: Joi.string().regex(/^[\w-]+\.[\w-]+\.[\w-]+$/),
});

export function validate(req, schema = Schema) {
  return Joi.validate(req.body, schema);
}
