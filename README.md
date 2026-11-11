# StockFlow — Inventory Management MVP

A full-stack, organization-scoped inventory management app built for the SDE Intern assessment.

## Features
- Email/password signup and login (bcrypt + JWT)
- One organization created for each signup; all product and settings queries are scoped to that organization
- Product CRUD: name, SKU, description, quantity, cost price, selling price, low-stock threshold
- SKU uniqueness within an organization
- Dashboard: product count, total quantity, low-stock list
- Product search by name or SKU
- Organization default low-stock threshold
- Responsive desktop-first interface

## Stack
- Frontend: React + Vite + React Router
- Backend: Node.js + Express
- Database: MongoDB + Mongoose
- Authentication: JWT + bcryptjs

## Project structure
```text
stockflow-sde-intern/
  client/       React frontend
  server/       Express API
  .gitignore
  README.md
```

## Requirements
- Node.js 18+
- MongoDB local instance or MongoDB Atlas connection string

## 1. Configure the backend
```bash
cd server
cp .env.example .env
```
Set `MONGODB_URI` and a long random `JWT_SECRET` in `server/.env`.

## 2. Install and run the backend
```bash
npm install
npm run dev
```
API runs at `http://localhost:5000`.

## 3. Install and run the frontend
Open a second terminal:
```bash
cd client
cp .env.example .env
npm install
npm run dev
```
Frontend runs at `http://localhost:5173`.

## API routes
- `POST /api/auth/signup`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/products`
- `POST /api/products`
- `GET /api/products/:id`
- `PUT /api/products/:id`
- `DELETE /api/products/:id`
- `GET /api/dashboard`
- `GET /api/settings`
- `PUT /api/settings`

All product, dashboard, and settings routes require `Authorization: Bearer <token>` and are scoped to the authenticated user's organization.

## Deployment notes
Deploy the API and frontend separately if using Vercel + Render (or equivalent).
- Backend environment variables: `MONGODB_URI`, `JWT_SECRET`, `CLIENT_URL`, `PORT`
- Frontend environment variable: `VITE_API_URL` (e.g. `https://your-api.onrender.com/api`)
- Set `CLIENT_URL` to the deployed frontend origin.
- For Vercel frontend deployment, set the root directory to `client`.
- For Render backend deployment, set the root directory to `server`, build command `npm install`, start command `npm start`.

## Assessment workflow
1. Create a **public** GitHub repository.
2. Commit genuine milestones regularly (setup, auth, CRUD, dashboard, testing).
3. Deploy and test the live application.
4. Submit both the public GitHub URL and live application URL.

Do not commit `.env` files or real secrets. The assessment brief describes a 6-hour MVP; prioritize the required features and avoid out-of-scope integrations.
