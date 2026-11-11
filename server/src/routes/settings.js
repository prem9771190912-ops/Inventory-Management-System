import { Router } from 'express';
import Organization from '../models/Organization.js';

const router = Router();
router.get('/', async (req, res, next) => {
  try {
    const organization = await Organization.findById(req.organizationId);
    res.json({ organization });
  } catch (error) { next(error); }
});
router.put('/', async (req, res, next) => {
  try {
    const value = Number(req.body.defaultLowStockThreshold);
    if (!Number.isInteger(value) || value < 0) return res.status(400).json({ message: 'Default threshold must be a non-negative whole number' });
    const organization = await Organization.findByIdAndUpdate(
      req.organizationId, { defaultLowStockThreshold: value }, { new: true, runValidators: true }
    );
    res.json({ organization });
  } catch (error) { next(error); }
});
export default router;
