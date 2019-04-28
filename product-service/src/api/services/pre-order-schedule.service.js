import Preorder from '../models/pre-order-schedule.model';

export class PreOrderScheduleModel {
  async createPreOrder(req, res) {
    const payload = req.body;
    try {
      const preorder = Preorder.createPreOrder(payload);
      return res.status(201).json(preorder);
    } catch (err) {
      console.log(err);
      return res.status(500).json({ error: 'something went wrong' });
    }
  }

  async getAllPreOrders(req, res) {
    try {
      const preorders = await Preorder.getAllPreOrders();
      return res.json(preorders);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: 'something went wrong' });
    }
  }

  /**
   * req.query:
   * @param {string} req.query.group
   */
  async getPreOrders(req, res) {
    const groupId = req.query.group;
    try {
      const preorders = await Preorder.getAllPreOrderTime(groupId);
      return res.json(preorders);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: 'something went wrong' });
    }
  }

  async getPreOrderByPreOrderId(req, res) {
    const preorderId = req.params.preorderId;
    try {
      const preorder = await Preorder.getPreOrderTime(preorderId);
      return res.json(preorder);
    } catch {
      return res.status(500).json({ error: 'something went wrong' });
    }
  }

  async getPreOrdersByOwner(req, res) {
    const ownerId = req.user.sub;
    try {
      const preorders = await Preorder.getAllPreOrdersByOwner(ownerId);
      return res.json(preorders);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: 'something went wrong' });
    }
  }

  async updatePreOrderQuantity(req, res) {
    const preOrderId = req.params.preorderId;
    const quantity = req.body.quantity;
    try {
      const preorder = await Preorder.updatePreOrderQuantity(
        preOrderId,
        quantity
      );
      return res.status(200).json(preorder);
    } catch {
      return res.status(500).json({ error: 'something went wrong' });
    }
  }

  async updatePreOrder(req, res) {
    const payload = req.body;
    try {
      const preorder = await Preorder.updatePreOrderByPreOrderId(
        req.params.preorderId,
        payload
      );
      return res.status(200).json(preorder);
    } catch {
      return res.status(500).json({ error: 'something went wrong' });
    }
  }

  async upsertPreOrder(req, res) {
    const payload = req.body;
    try {
      const preorder = await Preorder.upsertPreOrder(
        req.params.preorderId,
        payload
      );
      return res.status(200).json(preorder);
    } catch (err) {
      console.log(err);
      return res.status(500).json({ error: 'something went wrong' });
    }
  }

  async removePreOrder(req, res) {
    try {
      const removed = await Preorder.removePreOrder(req.params.preorderId);
      return res.status(200).json({ success: true });
    } catch {
      return res.status(500).json({ error: 'something went wrong' });
    }
  }
}

export default new PreOrderScheduleModel();
