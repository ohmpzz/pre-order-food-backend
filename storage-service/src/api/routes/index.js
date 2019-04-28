import * as COMMUNITY from './community.route';
import * as PRODUCTS from './product.route';

export const router = {
  communityRouter: COMMUNITY.router,
  productRouter: PRODUCTS.router,
};
