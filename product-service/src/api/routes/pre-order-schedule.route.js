// @ts-check
import express from 'express';
import Preorder from '../services/pre-order-schedule.service';
import ProductMiddleware from '../../middlewares/can-manage-group-product';
import PreOrderValidate from '../validates/pre-order.validate';
import Schema from '../validates/schemas';

const router = express.Router();

router
  .route('/')
  .get(Preorder.getPreOrders)
  /**
   * Create pre-order schedule
   */
  .post(
    ProductMiddleware.canUpdateAndDelete(),
    PreOrderValidate.check(Schema.PreOrderCreate),
    Preorder.createPreOrder
  );

router.get('/all', Preorder.getAllPreOrders);
router.get('/my-group', Preorder.getAllPreordersInMyGroup);

router.route('/owner').get(Preorder.getPreOrdersByOwner);

router.route('/owner/:preorderId').delete(Preorder.removePreOrder);

router
  .route('/:preorderId')
  .get(Preorder.getPreOrderByPreOrderId) // update quantity
  .patch(Preorder.updatePreOrderQuantity);

router
  .route('/:productId/preorder/:preorderId')
  .get(Preorder.getPreOrderByPreOrderId)
  /**
   * Update all data
   */
  .put(
    ProductMiddleware.canUpdateAndDelete(),
    PreOrderValidate.check(Schema.PreOrderUpdate),
    Preorder.upsertPreOrder
  )
  /**
   * Update some data
   */
  .patch(
    ProductMiddleware.canUpdateAndDelete(),
    PreOrderValidate.check(Schema.PreOrderUpdate),
    Preorder.updatePreOrder
  )
  /**
   * Remove Pre-order
   */
  .delete(ProductMiddleware.canUpdateAndDelete(), Preorder.removePreOrder);

export default router;
