import { Schema } from './schemas';
import axios from 'axios';
import moment from 'moment';

const Product = Schema.Product;

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

class ProductModel {
  getProductByProductId(productId) {
    return Product.findById(productId)
      .select(
        `title description ownerId
    imagesUrl 
    creationTime lastUpdateTime`
      )
      .then(async res => {
        const owner = await getUserCredential([res.ownerId]);
        return { ...res._doc, owner: owner[0] };
      });
  }

  getProductsByOwnerId(ownerId) {
    return Product.find({ ownerId, isActive: true })
      .select(
        `title description
             imagesUrl 
             creationTime lastUpdateTime`
      )
      .then(async res => {
        try {
          const owner = await getUserCredential([ownerId]);
          let products = [];
          for (const i of res) {
            products = [...products, { ...i._doc, owner }];
          }

          return { result: products };
        } catch (err) {
          console.log('error::', err);
        }
      });
  }

  // return Product.find()
  //         .where('orderTime.end')
  //         .gte(moment().format())
  //         .skip(parseInt(start))
  //         .limit(parseInt(limit))
  //         .select(
  //           `title description ownerId
  //            imagesUrl
  //           creationTime lastUpdateTime`
  //         );

  getProducts({ start = 0, limit = 100 }, ownerId) {
    return Product.find({ ownerId, isActive: true })
      .skip(parseInt(start))
      .limit(parseInt(start))
      .select(
        `title description ownerId
          imagesUrl 
          creationTime lastUpdateTime`
      );
  }

  createProduct(payload) {
    const prepare = {
      ...payload,
      lastUpdateTime: moment().format(),
      creationTime: moment().format(),
      isActive: true,
    };

    return Product.create(prepare).then(res => {
      console.log(res);
      return res;
    });
  }

  updateProduct(productId, payload) {
    return Product.findOneAndUpdate(
      { _id: productId, isActive: true },
      { ...payload },
      { new: true }
    ).select(
      `title description ownerId
      imagesUrl 
      creationTime lastUpdateTime`
    );
  }

  upsertProduct(productId, payload) {
    if (payload && payload.title) {
      return Product.findOneAndUpdate(
        { _id: productId },
        { ...payload, lastUpdateTime: moment().format() },
        {
          new: true,
          upsert: true,
          setDefaultsOnInsert: { creationTime: moment().format() },
        }
      ).select(
        `title description ownerId
        imagesUrl 
        creationTime lastUpdateTime`
      );
    }

    return Promise.reject(false);
  }

  removeProduct(productId) {
    return Product.findOneAndUpdate({ _id: productId }, { isActive: false });
  }
}

export default new ProductModel();
