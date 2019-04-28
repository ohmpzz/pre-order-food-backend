import mongoose from 'mongoose';
import { Schema } from './schemas';
import moment from 'moment';
import axios from 'axios';
import Product from './product.model';

const Preorder = Schema.Preorder;
const sql = `checkoutTime orderTime
creationTime lastUpdatetime
quantity price quantityLimit 
groupId
productId
slug
`;

function getGroupById(groupId) {
  return axios({
    url: `${process.env.COMMU_SERVICE_URI}/${groupId}`,
    method: 'get',
    headers: { 'Content-Type': 'application/json' },
  })
    .then(res => res.data)
    .then(res => {
      const { members, ...newData } = res;
      return newData;
    });
}

function genSlug(id, title) {
  title.toLowerCase();
  return title.replace(/\s/g, '-') + `-${id}`;
}

class PreOrderScheduleModel {
  /**
   * Create pre-order schedule
   * @param {Object} payload - Pre-order Schedule data
   */
  async createPreOrder(payload) {
    // return Preorder.create({
    //   ...payload,
    //   creationTime: moment().format(),
    // }).then(async p => {
    //   const product = await Product.getProductByProductId(p.productId);
    //   return { ...p, product };
    // });

    const { groups, ...newPayload } = payload;
    let product = {};
    try {
      product = await Product.getProductByProductId(payload.productId);
      console.log(product);
    } catch (e) {
      console.log('get product error::', e);
    }

    console.log(product);

    for (const i of groups) {
      console.log(i);
      console.log('newPayload::', newPayload);
      const id = mongoose.Types.ObjectId();
      const slug = genSlug(id, product.title);
      try {
        await Preorder.create({
          _id: id,
          ...newPayload,
          slug,
          groupId: i,
          ownerId: product.owner.uid,
        });
      } catch (e) {
        console.log('error::', e);
      }
    }

    return { success: true };
  }

  getAllPreOrders() {
    return Preorder.find()
      .where('orderTime.end')
      .gte(moment().format())
      .select(sql)
      .then(async res => {
        let preorders = [];
        try {
          for (const i of res) {
            const group = await getGroupById(i.groupId);
            const product = await Product.getProductByProductId(i.productId);
            preorders = [...preorders, { group, ...i._doc, product }];
            console.log(res);
          }
        } catch (e) {
          console.log(e);
        }

        return { result: preorders };
      });
  }

  getAllPreOrderTime(groupId) {
    return Preorder.find({ groupId })
      .where('orderTime.end')
      .gte(moment().format())
      .select(sql)
      .then(async res => {
        let group = {};
        try {
          group = await getGroupById(groupId);
        } catch (e) {
          console.log(e);
        }

        let preorders = [];
        try {
          for (const i of res) {
            const product = await Product.getProductByProductId(i.productId);
            preorders = [...preorders, { group, ...i._doc, product }];
          }
        } catch (e) {
          console.log(e);
        }

        return { result: preorders };
      });
  }

  getAllPreOrdersByOwner(ownerId) {
    console.log(ownerId);
    return Preorder.find({ ownerId })
      .select(sql)
      .then(async res => {
        let preorders = [];
        try {
          for (const i of res) {
            const group = await getGroupById(i.groupId);
            const product = await Product.getProductByProductId(i.productId);
            preorders = [...preorders, { group, ...i._doc, product }];
          }
        } catch (e) {
          console.log(e);
        }

        return { result: preorders };
      });
  }

  getPreOrderTime(preorderId) {
    return Preorder.findOne({ _id: preorderId })
      .select(sql)
      .then(async res => {
        let group = {};
        try {
          group = await getGroupById(res.groupId);
        } catch (e) {
          console.log(e);
        }

        try {
          const product = await Product.getProductByProductId(res.productId);
          const preorder = { ...res._doc, product, group };
          return { result: preorder };
        } catch (e) {
          console.log(e);
          return e;
        }
      });
  }

  updatePreOrderQuantity(preorderId, quantity) {
    return Preorder.findOne({ _id: preorderId }).then(res => {
      return Preorder.findByIdAndUpdate(preorderId, {
        ...res.doc,
        quantity: parseInt(res.quantity) + parseInt(quantity),
        lastUpdateTime: moment().format(),
      });
    });
  }

  /**
   * Update pre-order schedule
   * @param {string} id - Pre-order ID
   * @param {Object} payload - Pre-order Schedule data
   */
  updatePreOrderByPreOrderId(id, payload) {
    return Preorder.findByIdAndUpdate(id, payload, { new: true })
      .select(sql)
      .then(async p => {
        const product = await Product.getProductByProductId(p.productId);
        return { ...p._doc, product };
      });
  }
  /**
   * Upsert pre-order schedule
   * @param {string} id - Pre-order ID
   * @param {Object} payload - Pre-order Schedule data
   */
  upsertPreOrder(id, payload) {
    console.log(payload);
    return Preorder.findByIdAndUpdate(
      id,
      { ...payload, lastUpdateTime: moment().format() },
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
      }
    )
      .select(sql)
      .then(async p => {
        const product = await Product.getProductByProductId(p.productId);
        return { ...p._doc, product };
      });
  }
  /**
   * Remove pre-order schedule
   * @param {string} id - Pre-order ID
   */
  removePreOrder(id) {
    return Preorder.findByIdAndDelete(id);
  }
}

export default new PreOrderScheduleModel();
