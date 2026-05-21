# ShopKart - Full-Stack E-Commerce Application

A modern, production-ready e-commerce platform built with **React**, **Node.js/Express**, **MongoDB**, **Redux Toolkit**, and **Tailwind CSS**. Inspired by Amazon/Flipkart-style UX with admin dashboard, JWT auth, coupons, reviews, and more.

![Stack](https://img.shields.io/badge/React-18-blue) ![Node](https://img.shields.io/badge/Node-Express-green) ![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-brightgreen)

---

## Features

### Customer
- Responsive navbar with search, cart badge, dark/light mode
- Hero banner, featured products, category browsing
- Product listing with search, filters, sorting, pagination
- Product detail: reviews, related products, wishlist
- Shopping cart & checkout with coupon codes
- User registration/login (JWT + bcrypt)
- Profile, order history, recently viewed, wishlist

### Admin Dashboard
- Manage products, categories, users, orders, coupons
- Update order status (pending → delivered)

### Demo Accounts (after seeding)
| Role  | Email               | Password  |
|-------|---------------------|-----------|
| Admin | admin@shopkart.com  | admin123  |
| User  | user@shopkart.com   | user123   |

### Coupon Codes
`SAVE10`, `FLAT20`, `WELCOME15`

---

## Project Structure

```
ecommerce/
├── backend/                 # Express REST API
│   ├── config/              # Database connection
│   ├── controllers/         # Route handlers
│   ├── middleware/          # Auth & error handling
│   ├── models/              # Mongoose schemas
│   ├── routes/              # API routes
│   ├── utils/               # Seed data, JWT helper
│   └── server.js
├── frontend/                # React + Vite app
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/           # Route pages + admin
│   │   ├── redux/           # Redux Toolkit slices
│   │   └── utils/           # API client, helpers
│   └── vercel.json
└── README.md
```

---

## Prerequisites

- [Node.js](https://nodejs.org/) v18+
- [MongoDB](https://www.mongodb.com/) (local or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) free tier)

---

## Local Setup

### 1. Clone & install dependencies

```bash
cd ecommerce

# Backend
cd backend
npm install
cp .env.example .env
# Edit .env with your MONGO_URI and JWT_SECRET

# Frontend
cd ../frontend
npm install
cp .env.example .env
```

### 2. Configure environment variables

**backend/.env**
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/ecommerce
JWT_SECRET=your_secret_key_here
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:5173
```

**frontend/.env**
```env
VITE_API_URL=http://localhost:5000/api
```

### 3. Seed the database

```bash
cd backend
npm run seed
```

### 4. Run the application

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

Open **http://localhost:5173** in your browser.

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/users/register` | Register user |
| POST | `/api/users/login` | Login |
| GET | `/api/products` | List products (query: page, keyword, category, sort) |
| GET | `/api/products/:id` | Product details |
| POST | `/api/orders` | Place order (auth required) |
| GET | `/api/categories` | List categories |
| POST | `/api/coupons/validate` | Validate coupon |

Admin routes require `Authorization: Bearer <token>` and admin role.

---

## Deployment

### Backend → [Render](https://render.com)

1. Push code to GitHub.
2. Create a **Web Service** on Render, connect your repo, set **Root Directory** to `backend`.
3. **Build Command:** `npm install`
4. **Start Command:** `npm start`
5. Add environment variables:
   - `MONGO_URI` — MongoDB Atlas connection string
   - `JWT_SECRET` — strong random string
   - `CLIENT_URL` — your Vercel frontend URL (e.g. `https://your-app.vercel.app`)
   - `NODE_ENV` — `production`
6. After deploy, run seed once via Render Shell: `npm run seed`

### Frontend → [Vercel](https://vercel.com)

1. Import the GitHub repo on Vercel.
2. Set **Root Directory** to `frontend`.
3. **Framework Preset:** Vite
4. **Build Command:** `npm run build`
5. **Output Directory:** `dist`
6. Environment variable:
   - `VITE_API_URL` = `https://your-render-app.onrender.com/api`
7. Deploy. `vercel.json` handles SPA routing.

### MongoDB Atlas (Production DB)

1. Create free cluster at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas).
2. Database Access → create user.
3. Network Access → allow `0.0.0.0/0` (or Render IPs).
4. Connect → copy connection string → set as `MONGO_URI`.

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18, Vite, Tailwind CSS, Redux Toolkit, React Router, Axios, React Hot Toast |
| Backend | Node.js, Express, Mongoose, JWT, bcryptjs |
| Database | MongoDB |

---

## Scripts

| Location | Command | Description |
|----------|---------|-------------|
| backend | `npm run dev` | Start API with nodemon |
| backend | `npm start` | Production server |
| backend | `npm run seed` | Import sample data |
| frontend | `npm run dev` | Dev server (port 5173) |
| frontend | `npm run build` | Production build |

---

## License

MIT — free to use for learning and portfolio projects.
