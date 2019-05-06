import express from 'express';
import Order from '../services/order.service';
import OrderValidate from '../validates/order.validate';
import CanManageMiddleware from '../../middlewares/can-manage';
import Schema from '../validates/schemas';

const router = express.Router();

router.get('/', Order.getOrderByPreOrderId);
router.get('/owner', Order.getOrderByOwner);
router.post('/', OrderValidate.check(Schema.Create), Order.createOrder);
router.patch(
  '/owner/:orderId',
  OrderValidate.check(Schema.UpdateCancelOrder),
  Order.cancelOrderByOwner //checkowner preorder
);
router.patch(
  '/:orderId',
  OrderValidate.check(Schema.UpdateStatus),
  Order.updateOrderStatus
);

router.delete('/preorder/:preorderId', Order.deleteOrderByPreOrderId);

router.route('/products/:productId').get(Order.getOrderByProductId);
router.route('/owners/:ownerId').get(Order.getOrderByOwnerId);
router.route('/users/:userId').get(Order.getOrderByUserId);
router
  .route('/:orderId')
  .patch(CanManageMiddleware.canUpdate(), Order.updateOrderByOrderId)
  .delete(CanManageMiddleware.canDelete(), Order.removeOrder);

export default router;
