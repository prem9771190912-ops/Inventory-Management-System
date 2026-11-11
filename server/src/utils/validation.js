export function validateProduct(body) {
  const errors = [];
  if (!body.name || !String(body.name).trim()) errors.push('Product name is required');
  if (!body.sku || !String(body.sku).trim()) errors.push('SKU is required');
  for (const key of ['quantity', 'costPrice', 'sellingPrice', 'lowStockThreshold']) {
    if (body[key] !== undefined && body[key] !== null && body[key] !== '' &&
        (!Number.isFinite(Number(body[key])) || Number(body[key]) < 0)) {
      errors.push(`${key} must be a non-negative number`);
    }
  }
  if (body.quantity !== undefined && !Number.isInteger(Number(body.quantity))) {
    errors.push('Quantity must be a whole number');
  }
  if (body.lowStockThreshold !== undefined && body.lowStockThreshold !== null &&
      body.lowStockThreshold !== '' && !Number.isInteger(Number(body.lowStockThreshold))) {
    errors.push('Low-stock threshold must be a whole number');
  }
  return errors;
}
