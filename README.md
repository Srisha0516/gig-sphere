# GigSphere — AI-Powered Freelancer Marketplace

GigSphere is a production-ready, full-stack marketplace with AI proposal ranking, real-time chat, and secure Stripe checkout.

## 🚀 Features
- **AI Ranking**: Claude 3.5 Sonnet ranks freelancer proposals by skill fit.
- **Real-time Chat**: Socket.io-powered messaging between clients and freelancers.
- **Secure Payments**: Stripe Checkout integration for contract fees.
- **Role-based Dashboards**: Distinct experiences for Clients and Freelancers.
- **Supabase Integration**: Robust authentication and PostgreSQL data management.

## 🛠 Project Structure
- `/backend`: Node.js Express server with Socket.io, Stripe, and Anthropic AI.
- `/frontend`: React.js (Vite) with premium vanilla CSS design and Lucide icons.

## ⚙️ Environment Setup
### Backend (`/backend/.env`)
Create a `.env` file from the provided `.env.example`:
```env
PORT=5000
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
JWT_SECRET=your_secret_key
JWT_REFRESH_SECRET=your_refresh_key
ANTHROPIC_API_KEY=your_claude_api_key
STRIPE_SECRET_KEY=your_stripe_secret
FRONTEND_URL=http://localhost:5173
```

### Frontend (`/frontend/.env` - optional)
Vite will automatically use `http://localhost:5000` for API calls based on the source code.

## 📦 Installation
1. **Backend**:
   ```bash
   cd backend
   npm install
   npm start
   ```
2. **Frontend**:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

## ☁️ Deployment Instructions
1. **Frontend**: Import the `frontend` folder into **Vercel**. It uses `vercel.json` for routing.
2. **Backend**: Deploy the `backend` folder to **Railway** or **Render**. Ensure all environment variables are set in the dashboard.

## 📝 Database
Run the `backend/schema.sql` inside the **Supabase SQL Editor** to set up the tables and RLS policies.
