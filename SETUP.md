# BuildIt - Full Stack Startup Builder Setup Guide

## Overview
BuildIt is now a full-stack application with user authentication, project management, subscription model, and Razorpay integration.

## Features Added
- ✅ User Authentication (Register/Login)
- ✅ Project Management (Save/Load Projects)
- ✅ Subscription Model (Free/Basic/Premium)
- ✅ Razorpay Payment Integration
- ✅ Paid Sections Access Control
- ✅ User Dashboard
- ✅ Database Integration

## Environment Variables Required

Create a `.env.local` file in the root directory with the following variables:

```env
# Database
POSTGRES_URL="your_postgres_connection_string"
POSTGRES_PRISMA_URL="your_postgres_prisma_url"
POSTGRES_URL_NON_POOLING="your_postgres_non_pooling_url"
POSTGRES_USER="your_postgres_user"
POSTGRES_HOST="your_postgres_host"
POSTGRES_PASSWORD="your_postgres_password"
POSTGRES_DATABASE="your_postgres_database"

# Authentication
JWT_SECRET="your_jwt_secret_key_here"

# Google Gemini AI
GOOGLE_GEMINI_API_KEY="your_gemini_api_key"

# Razorpay
RAZORPAY_KEY_ID="your_razorpay_key_id"
RAZORPAY_KEY_SECRET="your_razorpay_key_secret"
NEXT_PUBLIC_RAZORPAY_KEY_ID="your_public_razorpay_key_id"

# App Configuration
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NODE_ENV="development"
```

## Database Setup

### Option 1: Vercel Postgres (Recommended)
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Create a new Postgres database
3. Copy the connection string to your `.env.local` file

### Option 2: Local Postgres
1. Install PostgreSQL locally
2. Create a database named `buildit`
3. Update the connection string in `.env.local`

## Razorpay Setup

1. Go to [Razorpay Dashboard](https://dashboard.razorpay.com/)
2. Create a new account or login
3. Go to Settings > API Keys
4. Generate API Keys
5. Add the keys to your `.env.local` file

## Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables (see above)

3. Run the development server:
```bash
npm run dev
```

## Subscription Plans

### Free Plan
- Access to basic features
- 1 project
- Basic AI assistance
- Community support

### Basic Plan (₹999/month)
- Everything in Free
- Unlimited projects
- Advanced AI features
- PDF downloads
- Project saving & loading
- Email support
- Priority features

### Premium Plan (₹1999/month)
- Everything in Basic
- Premium AI features
- Custom branding
- API access
- Team collaboration
- Priority support
- Advanced analytics
- White-label options

## Paid Sections

The following sections require a paid subscription:
- Advanced AI features
- PDF downloads
- Project saving/loading
- Premium video generation
- Advanced analytics

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user

### Projects
- `GET /api/projects` - Get user projects
- `POST /api/projects` - Create new project
- `GET /api/projects/[id]` - Get project details
- `PUT /api/projects/[id]` - Save project data

### Subscriptions
- `POST /api/subscription/create-order` - Create Razorpay order
- `POST /api/subscription/verify-payment` - Verify payment

## Project Structure

```
app/
├── auth/                    # Authentication page
├── dashboard/              # User dashboard
├── pricing/                # Subscription plans
├── project/[id]/          # Individual project pages
├── api/
│   ├── auth/              # Authentication API
│   ├── projects/          # Project management API
│   └── subscription/      # Subscription API
components/
├── auth/                  # Authentication components
└── ui/                    # UI components
lib/
├── auth.ts                # Authentication utilities
├── db/
│   └── schema.ts          # Database schema and functions
└── razorpay.ts            # Razorpay integration
```

## Usage

1. **Register/Login**: Users can create accounts and login
2. **Create Projects**: Users can create multiple startup projects
3. **Work on Projects**: Each project has all 10 sections (Idea, Market, Strategy, etc.)
4. **Save Progress**: Project data is automatically saved to the database
5. **Upgrade Plans**: Users can upgrade to paid plans for more features
6. **Access Control**: Paid features are protected based on subscription status

## Deployment

1. Deploy to Vercel:
```bash
vercel --prod
```

2. Set environment variables in Vercel dashboard

3. Database will be automatically set up on first deployment

## Support

For issues or questions, please check the documentation or contact support.
