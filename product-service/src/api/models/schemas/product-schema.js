import mongoose from 'mongoose';

const ProductSchema = mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  ownerId: { type: String, required: true },
  imagesUrl: { type: Array },
  creationTime: { type: String },
  lastUpdateTime: { type: String },
});

export default mongoose.model('products', ProductSchema);
