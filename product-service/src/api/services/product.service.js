import Product from '../models/product.model';

export class ProductService {
  async createProduct(req, res) {
    const payload = req.body;
    try {
      const product = await Product.createProduct({ ...payload }).then(
        payload => {
          return payload._doc;
        }
      );

      if (product) {
        return res.status(201).json(product);
      }

      return res.status(500).json({ error: 'something went wrong' });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ error: 'something went wrong' });
    }
  }

  async getProductsByOwnerId(req, res) {
    const { ownerId } = req.params;
    try {
      const products = await Product.getProductsByOwnerId(ownerId);

      return res.json(products);
    } catch {
      return res.status(500).json({ error: 'something went wrong' });
    }
  }

  async getProductByProductId(req, res) {
    const productId = req.params.productId;
    try {
      const product = await Product.getProductByProductId(productId);
      return res.json(product);
    } catch {
      return res.status(500).json({ error: 'something went wrong' });
    }
  }

  async getProducts(req, res) {
    try {
      const products = await Product.getProducts(req.query);

      return res.json(products);
    } catch (error) {
      return res.status(500).json({ error: 'something went wrong' });
    }
  }

  /**
   * Update Exist Product data By Owner only
   * @param {string} req.params.productId - The ID of the product
   * @param {*} res - response
   */
  async updateProduct(req, res) {
    const productId = req.params.productId;
    const payload = req.body;
    console.log(req.body);
    try {
      const product = await Product.updateProduct(productId, payload).then(
        payload => payload._doc
      );

      return res.json(product);
    } catch {
      return res.status(500).json({ error: 'something went wrong' });
    }
  }

  /**
   * Write and Replace product data
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async upsertProduct(req, res) {
    const productId = req.params.productId;
    const payload = req.body;
    try {
      const product = await Product.upsertProduct(productId, payload).then(
        payload => payload._doc
      );
      return res.json(product);
    } catch {
      return res.status(500).json({ error: 'something went wrong' });
    }
  }

  async removeProduct(req, res) {
    const productId = req.params.productId;
    try {
      const product = await Product.removeProduct(productId);

      return res.status(200).json({ success: true });
    } catch (error) {
      return res.status(400).json({ error: 'no data' });
    }
  }
}

export default new ProductService();
