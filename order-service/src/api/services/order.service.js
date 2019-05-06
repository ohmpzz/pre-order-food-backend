// @ts-check
import Order from '../models/order.model';

class OrderService {
  async createOrder(req, res, next) {
    const payload = req.body;
    console.log(payload);
    try {
      const order = await Order.createOrder(payload).then(
        payload => payload._doc
      );

      console.log(order);

      if (order) {
        return res.status(201).json(order);
      }

      return res.status(500).json({ error: 'something went wrong' });
    } catch (e) {
      console.log(e);
      return res.status(500).json({ error: 'something went wrong' });
    }
  }

  async getOrderByPreOrderId(req, res, next) {
    const preOrderId = req.query.preorder;
    console.log(preOrderId);
    try {
      const orders = await Order.getOrderByPreOrderId(preOrderId);
      return res.json(orders);
    } catch (e) {
      console.log(e);
      return res.status(500).json({ error: 'something went wrong' });
    }
  }

  async getOrderByOwner(req, res, next) {
    const userId = req.user.sub;
    try {
      const orders = await Order.getOrderByOwnerId(userId);
      return res.json(orders);
    } catch (e) {
      return res.status(500).json({ error: 'something went wrong' });
    }
  }

  async cancelOrderByOwner(req, res, next) {
    const orderId = req.params.orderId;
    const isCanceled = req.body.isCanceled;
    try {
      const orders = await Order.cancelOrderByOwner(orderId, isCanceled);
      return res.json(orders);
    } catch (e) {
      return res.status(500).json({ error: 'something went wrong' });
    }
  }

  async updateOrderStatus(req, res, next) {
    const orderId = req.params.orderId;
    const status = req.body.status;
    try {
      const orders = await Order.updateStatusOrder(orderId, status);
      return res.json({ success: true });
    } catch (e) {
      return res.status(500).json({ error: 'something went wrong' });
    }
  }

  async deleteOrderByPreOrderId(req, res) {
    const preOrderId = req.params.preorderId;
    try {
      const removed = await Order.deleteOrderByPreOrderId(preOrderId);
      return res.status(200).json({ success: true });
    } catch (e) {
      return res.status(500).json({ error: 'something went wrong' });
    }
  }

  ////////////////////////////////////
  async getOrderByProductId(req, res, next) {
    const productId = req.params.productId;
    try {
      const orders = await Order.getOrdersByProductId(productId);
      return res.json(orders);
    } catch {
      return res.status(500).json({ error: 'something went wrong' });
    }
  }

  async getOrderByOwnerId(req, res, next) {
    const ownerId = req.params.ownerId;
    try {
      const orders = await Order.getOrdersByOwnerId(ownerId);
      return res.json(orders);
    } catch {
      return res.status(500).json({ error: 'something went wrong' });
    }
  }

  async getOrderByUserId(req, res, next) {
    const userId = req.params.userId;
    try {
      const orders = await Order.getOrdersByUserId(userId);
      return res.json(orders);
    } catch {
      return res.status(500).json({ error: 'something went wrong' });
    }
  }

  async updateOrderByOrderId(req, res, next) {
    const payload = req.body;
    try {
      const order = await Order.updateOrder(payload._id, payload);

      return res.json(order);
    } catch {
      return res.status(500).json({ error: 'something went wrong' });
    }
  }

  async removeOrder(req, res, next) {
    const orderId = req.params.orderId;
    try {
      const order = await Order.removeOrder(orderId);
      return res.status(200).json({ success: true });
    } catch {
      return res.status(400).json({ error: 'no data' });
    }
  }
}

export default new OrderService();
