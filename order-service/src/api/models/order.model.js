import mongoose from 'mongoose';
import moment from 'moment';
import axios from 'axios';

const OrderSchema = mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, default: '' },
  phoneNumber: { type: String, required: true },
  userId: { type: String, required: true },
  address: { type: String, required: true },
  creationTime: { type: String, required: true },
  quantity: { type: String, required: true },
  preOrderId: { type: String, required: true },
  status: { type: String, required: true, default: 'รับออเดอร์แล้ว' },
  isCanceled: { type: Boolean, default: false },
});

const Order = mongoose.model('orders', OrderSchema);

const sql = `name email phoneNumber userId address 
  creationTime 
  quantity 
  preOrderId 
  status isCanceled
`;

function getPreOrderById(preorderId) {
  return axios({
    url: `${process.env.PREORDER_SERVICE_URI}/${preorderId}`,
    method: 'get',
    headers: { 'Content-Type': 'application/json' },
  })
    .then(res => res.data)
    .then(res => res.result);
}

function updatePreOrderQuantityById(preorderId, quantity) {
  return axios({
    url: `${process.env.PREORDER_SERVICE_URI}/${preorderId}`,
    method: 'patch',
    headers: { 'Content-Type': 'application/json' },
    data: {
      quantity,
    },
  }).then(res => res.data);
}

function getUserCredential(usersId = []) {
  if (usersId.length == 0) return [];
  return axios({
    url: `${process.env.AUTH_SERVICE_URI}/inter-service/users/credentials`,
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    data: {
      users: usersId,
    },
  }).then(res => res.data);
}

export class OrderModel {
  getOrderByPreOrderId(preOrderId) {
    return Order.find({ preOrderId })
      .select(sql)
      .then(async res => {
        try {
          const preOrder = await getPreOrderById(preOrderId);
          let orders = [];
          for (const i of res) {
            const user = await getUserCredential([i.userId]);
            orders = [...orders, { ...i._doc, user, preOrder }];
          }
          return { result: orders };
        } catch (e) {
          console.log(e);
        }
      });
  }

  getOrderByOwnerId(userId) {
    return Order.find({ userId })
      .select(sql)
      .then(async res => {
        try {
          let orders = [];
          const user = await getUserCredential([userId]);
          for (const i of res) {
            const preOrder = await getPreOrderById(i.preOrderId);
            orders = [...orders, { ...i._doc, user, preOrder }];
          }
          return { result: orders };
        } catch (e) {
          console.log(e);
          return e;
        }
      });
  }

  createOrder(payload) {
    const prepare = {
      ...payload,
      creationTime: moment().format(),
      status: 'รับออเดอร์แล้ว',
      isCanceled: false,
    };

    updatePreOrderQuantityById(payload.preOrderId, payload.quantity);
    return Order.create(prepare);
  }

  cancelOrderByOwner(orderId, isCanceled) {
    return Order.findOneAndUpdate(
      { _id: orderId },
      { isCanceled, status: 'ยกเลิกออเดอร์' }
    );
  }

  updateStatusOrder(orderId, status) {
    return Order.findOneAndUpdate({ _id: orderId }, { status });
  }

  getOrdersByProductId(productId) {
    return Order.find({ 'product._id': productId }).select(sql);
  }

  deleteOrderByPreOrderId(preOrderId) {
    console.log(preOrderId);
    return Order.findOneAndDelete({ preOrderId });
  }

  getOrdersByOwnerId(ownerId) {
    return Order.find({ ownerId: ownerId }).select(
      `name email phoneNumber userId
       address
       groupId
       product quantity productOwnerId
       isPacked isSent
       creationTime`
    );
  }

  getOrderByOrderId(orderId) {
    return Order.findById(orderId).select(
      `name email phoneNumber userId
       address
       groupId
       product quantity productOwnerId
       isPacked isSent
       creationTime`
    );
  }

  getOrdersByUserId(userId) {
    return Order.find({ userId: userId }).select(
      `name email phoneNumber userId
       address
       groupId
       product quantity productOwnerId
       isPacked isSent
       creationTime`
    );
  }

  updateOrder(id, payload) {
    return Order.findOneAndUpdate({ _id: id }, payload)
      .select(
        `name email phoneNumber userId
       address
       groupId
       product quantity productOwnerId
       isPacked isSent
       creationTime`
      )
      .then(payload => {
        return Order.find({ _id: payload._id }).select(
          `name email phoneNumber userId
         address
         groupId
         product quantity productOwnerId
         isPacked isSent
         creationTime`
        );
      });
  }

  removeOrder(orderId) {
    return Order.findOneAndDelete({ _id: orderId });
  }
}

export default new OrderModel();
