// @ts-check
import Order from '../api/models/order.model';

class CanManage {
  canUpdate() {
    return async (req, res, next) => {
      if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
      const userId = req.user.sub;
      try {
        const originalOrder = await Order.getOrderByOrderId(req.params.orderId);
        if (userId == originalOrder.productOwnerId) {
          return next();
        }
        return res.status(401).json({ error: 'Unauthorized' });
      } catch {
        return res.status(500).json({ error: 'Something went wrong' });
      }
    };
  }

  canDelete() {
    return async (req, res, next) => {
      if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
      const userId = req.user.sub;
      try {
        const originalOrder = await Order.getOrderByOrderId(req.params.orderId);
        if (userId == originalOrder.productOwnerId) {
          return next();
        }
        if (userId == originalOrder.userId) {
          return next();
        }
        return res.status(401).json({ error: 'Unauthorized' });
      } catch {
        return res.status(500).json({ error: 'Something went wrong' });
      }
    };
  }
}

export default new CanManage();
