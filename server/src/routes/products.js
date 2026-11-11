import { Router } from 'express';
import Product from '../models/Product.js';
import Organization from '../models/Organization.js';
import { validateProduct } from '../utils/validation.js';

const router = Router();
const toNumberOrNull = (value) => value === '' || value === undefined || value === null ? null : Number(value);

router.get('/', async (req, res, next) => {
  try {
    const filter = { organization: req.organizationId };
    if (req.query.search) filter.$or = [
      { name: { $regex: req.query.search, $options: 'i' } },
      { sku: { $regex: req.query.search, $options: 'i' } }
    ];
    const products = await Product.find(filter).sort({ updatedAt: -1 });
    const organization = await Organization.findById(req.organizationId).select('defaultLowStockThreshold');
    res.json({ products, defaultLowStockThreshold: organization?.defaultLowStockThreshold ?? 5 });
  } catch (error) { next(error); }
});

router.post('/', async (req, res, next) => {
  try {
    const errors = validateProduct(req.body);
    if (errors.length) return res.status(400).json({ message: errors.join('. ') });
    const product = await Product.create({
      organization: req.organizationId, name: req.body.name, sku: req.body.sku,
      description: req.body.description || '', quantity: Number(req.body.quantity),
      costPrice: toNumberOrNull(req.body.costPrice), sellingPrice: toNumberOrNull(req.body.sellingPrice),
      lowStockThreshold: toNumberOrNull(req.body.lowStockThreshold)
    });
    res.status(201).json({ product });
  } catch (error) {
    if (error.code === 11000) return res.status(409).json({ message: 'This SKU already exists in your organization' });
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const product = await Product.findOne({ _id: req.params.id, organization: req.organizationId });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json({ product });
  } catch (error) { next(error); }
});

router.put('/:id', async (req, res, next) => {
  try {
    const errors = validateProduct(req.body);
    if (errors.length) return res.status(400).json({ message: errors.join('. ') });
    const updates = {
      name: req.body.name, sku: req.body.sku, description: req.body.description || '',
      quantity: Number(req.body.quantity), costPrice: toNumberOrNull(req.body.costPrice),
      sellingPrice: toNumberOrNull(req.body.sellingPrice),
      lowStockThreshold: toNumberOrNull(req.body.lowStockThreshold)
    };
    const product = await Product.findOneAndUpdate(
      { _id: req.params.id, organization: req.organizationId }, updates, { new: true, runValidators: true }
    );
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json({ product });
  } catch (error) {
    if (error.code === 11000) return res.status(409).json({ message: 'This SKU already exists in your organization' });
    next(error);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const product = await Product.findOneAndDelete({ _id: req.params.id, organization: req.organizationId });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product deleted' });
  } catch (error) { next(error); }
});

export default router;
