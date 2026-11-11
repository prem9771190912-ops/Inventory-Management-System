import { Router } from 'express';
import Product from '../models/Product.js';
import Organization from '../models/Organization.js';

const router = Router();
router.get('/', async (req, res, next) => {
  try {
    const organization = await Organization.findById(req.organizationId);
    const products = await Product.find({ organization: req.organizationId }).select('name sku quantity lowStockThreshold');
    const totalProducts = products.length;
    const totalQuantity = products.reduce((sum, item) => sum + item.quantity, 0);
    const lowStockItems = products.filter(item =>
      item.quantity <= (item.lowStockThreshold ?? organization.defaultLowStockThreshold)
    );
    res.json({ totalProducts, totalQuantity, lowStockCount: lowStockItems.length, lowStockItems, defaultLowStockThreshold: organization.defaultLowStockThreshold });
  } catch (error) { next(error); }
});
export default router;
