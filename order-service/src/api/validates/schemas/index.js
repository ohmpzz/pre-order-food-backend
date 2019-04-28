import Joi from 'Joi';

export const Order = Joi.object()
  .keys({
    _id: Joi.string(),
    name: Joi.string().required(),
    email: Joi.string(),
    address: Joi.string().required(),
    phoneNumber: Joi.string().required(),
    userId: Joi.string().required(),
    preOrderId: Joi.string().required(),
    quantity: Joi.string().required(),
  })
  .options({ stripUnknown: true });

export const Create = Joi.object()
  .keys({
    name: Joi.string().required(),
    email: Joi.string(),
    address: Joi.string().required(),
    phoneNumber: Joi.string().required(),
    userId: Joi.string().required(),
    preOrderId: Joi.string().required(),
    quantity: Joi.string().required(),
  })
  .options({ stripUnknown: true });

export const UpdateStatus = Joi.object()
  .keys({
    _id: Joi.string(),
    status: Joi.string().required(),
  })
  .options({ stripUnknown: true });

export const UpdateCancelOrder = Joi.object()
  .keys({
    _id: Joi.string(),
    isCanceled: Joi.boolean().required(),
  })
  .options({ stripUnknown: true });

export default {
  Order,
  Create,
  UpdateStatus,
  UpdateCancelOrder,
};
