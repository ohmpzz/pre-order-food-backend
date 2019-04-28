import Joi from 'joi';

export const PreOrder = Joi.object().keys({
  _id: Joi.string(),
  checkoutTime: Joi.string().required(),
  creationTime: Joi.string().required(),
  price: Joi.number().required(),
  quantityLimit: Joi.number(),
  quantity: Joi.number(),
  groups: Joi.array().required(),
  orderTime: {
    end: Joi.string().required(),
    start: Joi.string().required(),
  },
  ownerId: Joi.string(),
  productId: Joi.string(),
  lastUpdateTime: Joi.string().required(),
});

export const PreOrderCreate = Joi.object()
  .keys({
    checkoutTime: Joi.string().required(),
    price: Joi.number().required(),
    quantityLimit: Joi.number(),
    quantity: Joi.number(),
    groups: Joi.array().required(),
    orderTime: {
      end: Joi.string().required(),
      start: Joi.string().required(),
    },
    ownerId: Joi.string(),
    productId: Joi.string(),
  })
  .options({ stripUnknown: true });

export const PreOrderUpdate = Joi.object()
  .keys({
    checkoutTime: Joi.string().required(),
    price: Joi.number().required(),
    quantityLimit: Joi.number(),
    quantity: Joi.number(),
    groupId: Joi.string().required(),
    orderTime: {
      end: Joi.string().required(),
      start: Joi.string().required(),
    },
    ownerId: Joi.string(),
    productId: Joi.string(),
  })
  .options({ stripUnknown: true });

export const Product = Joi.object().keys({
  _id: Joi.string(),
  title: Joi.string()
    .min(5)
    .max(100)
    .required(),
  description: Joi.string().max(500),
  ownerId: Joi.string(),
  imagesUrl: Joi.array(),
  creationTime: Joi.string(),
  lastUpdateTime: Joi.string(),
});

export const ProductCreate = Joi.object()
  .keys({
    title: Joi.string()
      .min(5)
      .max(100)
      .required(),
    description: Joi.string().max(500),
    ownerId: Joi.string(),
    imagesUrl: Joi.array(),
  })
  .options({ stripUnknown: true });

export const ProductUpdate = Joi.object()
  .keys({
    title: Joi.string()
      .min(5)
      .max(100)
      .required(),
    description: Joi.string().max(500),
    ownerId: Joi.string(),
    imagesUrl: Joi.array(),
  })
  .options({ stripUnknown: true });

export default {
  PreOrder,
  PreOrderCreate,
  PreOrderUpdate,
  Product,
  ProductCreate,
  ProductUpdate,
};
