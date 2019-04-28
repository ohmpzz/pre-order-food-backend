import express from 'express';
import Product from '../services/product.service';

import ProductValidate from '../validates/product.validate';
import Schemas from '../validates/schemas';

export const router = express.Router();

/**
 * Get Products
 * req.query:
 * @param {number} limit default=100
 * @param {number} start default=0
 */
router
  .route('/')
  .get(Product.getProducts)
  /**
   * Create Product in group
   *
   * Validate User exist by middleware
   */
  .post(ProductValidate.check(Schemas.ProductCreate), Product.createProduct);
// todo เช็คเฉพาะเจ้าของ
router.get('/owner/:ownerId', Product.getProductsByOwnerId);

router
  /**
   * Middleware:
   *  Auth.auth() : authenticate user
   *  ProductMiddleware.canUpdateAndDelete() : check user permission
   */
  .route('/:productId')
  .get(Product.getProductByProductId)
  /**
   * Update Exist Product data By Owner only
   * @param {Fn} ProductValidate.check - The middleware validate req.body
   * @param {Fn} Product.updateProduct - Update product service
   */
  .patch(ProductValidate.check(Schemas.ProductUpdate), Product.updateProduct)
  /**
   * Replace Product Data By Owner only
   * @param {Object} req.params.productId - The ID of the product
   * @param {Fn} Product.upsertProduct - Upsert Product Service
   */
  .put(ProductValidate.check(Schemas.ProductUpdate), Product.upsertProduct)
  /**
   * Remove Product By Owner only
   * @param {Object} req.params.productId - The ID of the product
   */
  .delete(Product.removeProduct);

export default router;
