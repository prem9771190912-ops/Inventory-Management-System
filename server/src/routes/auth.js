import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Organization from '../models/Organization.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();
const makeToken = (user) => jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
const publicUser = (user) => ({ id: user._id, name: user.name, email: user.email, organization: user.organization });

router.post('/signup', async (req, res, next) => {
  try {
    const { name = '', email, password, organizationName } = req.body;
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) return res.status(400).json({ message: 'Enter a valid email' });
    if (!password || password.length < 8) return res.status(400).json({ message: 'Password must contain at least 8 characters' });
    if (!organizationName || !organizationName.trim()) return res.status(400).json({ message: 'Organization name is required' });
    if (await User.findOne({ email: email.toLowerCase().trim() })) return res.status(409).json({ message: 'An account with this email already exists' });
    const organization = await Organization.create({ name: organizationName.trim() });
    const hashed = await bcrypt.hash(password, 12);
    const user = await User.create({ name: name.trim(), email: email.toLowerCase().trim(), password: hashed, organization: organization._id });
    res.status(201).json({ token: makeToken(user), user: { id: user._id, name: user.name, email: user.email, organization } });
  } catch (error) { next(error); }
});

router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: String(email || '').toLowerCase().trim() }).populate('organization');
    if (!user || !(await bcrypt.compare(password || '', user.password))) return res.status(401).json({ message: 'Invalid email or password' });
    res.json({ token: makeToken(user), user: publicUser(user) });
  } catch (error) { next(error); }
});

router.get('/me', requireAuth, async (req, res) => {
  const user = await User.findById(req.user._id).populate('organization').select('-password');
  res.json({ user: publicUser(user) });
});

export default router;
