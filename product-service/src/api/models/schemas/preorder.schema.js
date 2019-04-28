import mongoose from 'mongoose';

const PreorderSchema = mongoose.Schema({
  checkoutTime: { type: String, required: true },
  creationTime: { type: String, default: Date.now },
  quantityLimit: { type: Number, required: true, default: 0 },
  quantity: { type: Number, required: true, default: 0 },
  groupId: { type: String, required: true },
  orderTime: {
    end: { type: String, required: true },
    start: { type: String, required: true },
  },
  price: { type: Number, required: true },
  productId: { type: String, required: true },
  ownerId: { type: String, required: true },
  lastUpdateTime: { type: String },
  slug: { type: String, required: true },
});

export default mongoose.model('preorder-time', PreorderSchema);
