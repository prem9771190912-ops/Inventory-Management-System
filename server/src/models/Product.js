import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  organization: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization', required: true, index: true },
  name: { type: String, required: true, trim: true },
  sku: { type: String, required: true, trim: true, uppercase: true },
  description: { type: String, trim: true, default: '' },
  quantity: { type: Number, required: true, min: 0, default: 0 },
  costPrice: { type: Number, min: 0, default: null },
  sellingPrice: { type: Number, min: 0, default: null },
  lowStockThreshold: { type: Number, min: 0, default: null }
}, { timestamps: true });

productSchema.index({ organization: 1, sku: 1 }, { unique: true });
export default mongoose.model('Product', productSchema);
