import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { connectDB } from './config/db.js';
import authRoutes from './routes/auth.js';
import productRoutes from './routes/products.js';
import dashboardRoutes from './routes/dashboard.js';
import settingsRoutes from './routes/settings.js';
import { requireAuth } from './middleware/auth.js';

const app = express();
app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL?.split(',') || 'http://localhost:5173' }));
app.use(express.json({ limit: '1mb' }));
app.use('/api/auth', rateLimit({ windowMs: 15 * 60 * 1000, limit: 100 }), authRoutes);
app.get('/api/health', (_req, res) => res.json({ status: 'ok', service: 'StockFlow API' }));
app.use('/api/products', requireAuth, productRoutes);
app.use('/api/dashboard', requireAuth, dashboardRoutes);
app.use('/api/settings', requireAuth, settingsRoutes);
app.use((req, res) => res.status(404).json({ message: 'Route not found' }));
app.use((error, _req, res, _next) => {
  console.error(error);
  res.status(500).json({ message: 'Server error. Please try again.' });
});

const port = process.env.PORT || 5000;
connectDB().then(() => app.listen(port, () => console.log(`StockFlow API listening on ${port}`)))
  .catch(error => { console.error('Database connection failed:', error.message); process.exit(1); });
