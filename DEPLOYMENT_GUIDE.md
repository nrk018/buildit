# 🚀 BuildIt Deployment Guide

## Quick Fix for Current Error

The error you're seeing is because Razorpay API keys are not set in your environment variables. Here's how to fix it:

### **Step 1: Set Environment Variables in Vercel**

1. **Go to Vercel Dashboard**:
   - Visit [vercel.com/dashboard](https://vercel.com/dashboard)
   - Click on your BuildIt project

2. **Add Environment Variables**:
   - Go to "Settings" → "Environment Variables"
   - Add these variables:

```env
# Database (Get from Vercel Postgres)
POSTGRES_URL=your_postgres_connection_string
POSTGRES_PRISMA_URL=your_postgres_connection_string
POSTGRES_URL_NON_POOLING=your_postgres_connection_string
POSTGRES_USER=default
POSTGRES_HOST=your_postgres_host
POSTGRES_PASSWORD=your_postgres_password
POSTGRES_DATABASE=verceldb

# Authentication
JWT_SECRET=your_jwt_secret_key_here

# Google Gemini AI
GOOGLE_GEMINI_API_KEY=your_gemini_api_key

# Razorpay (Get from Razorpay Dashboard)
RAZORPAY_KEY_ID=rzp_test_your_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_your_key_id

# App Configuration
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
NODE_ENV=production
```

### **Step 2: Get Razorpay Keys (Quick Setup)**

1. **Go to Razorpay**:
   - Visit [razorpay.com](https://razorpay.com)
   - Sign up with your email

2. **Get Test Keys**:
   - Go to Dashboard → Settings → API Keys
   - Click "Generate Test Key"
   - Copy "Key ID" and "Key Secret"

3. **Add to Vercel**:
   - Paste the keys in Vercel environment variables
   - Redeploy your project

### **Step 3: Get Database Connection String**

1. **In Vercel Dashboard**:
   - Go to "Storage" tab
   - Click "Create Database" → "Postgres"
   - Name it "buildit-db"
   - Copy the connection string

2. **Add to Environment Variables**:
   - Use the connection string for POSTGRES_URL
   - Extract other values from the connection string

### **Step 4: Get Gemini API Key**

1. **Go to Google AI Studio**:
   - Visit [aistudio.google.com](https://aistudio.google.com)
   - Sign in with Google

2. **Create API Key**:
   - Click "Get API Key"
   - Click "Create API Key"
   - Copy the key

3. **Add to Vercel**:
   - Add as GOOGLE_GEMINI_API_KEY

### **Step 5: Generate JWT Secret**

```bash
# Run this command locally
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Copy the output and add as JWT_SECRET in Vercel.

### **Step 6: Redeploy**

1. **In Vercel Dashboard**:
   - Go to "Deployments" tab
   - Click "Redeploy" on the latest deployment
   - Or push a new commit to trigger redeploy

## Complete Setup Process

### **1. Database Setup (Vercel Postgres)**

```bash
# In Vercel Dashboard:
# 1. Go to Storage → Create Database → Postgres
# 2. Name: buildit-db
# 3. Region: Choose closest to your users
# 4. Copy connection string
```

### **2. Razorpay Setup**

```bash
# 1. Go to razorpay.com
# 2. Sign up with business details:
#    - Business Name: BuildIt
#    - Business Type: Technology
#    - Website: your-domain.com
# 3. Go to Settings → API Keys
# 4. Generate Test Key (for development)
# 5. Copy Key ID and Key Secret
```

### **3. Google Gemini Setup**

```bash
# 1. Go to aistudio.google.com
# 2. Sign in with Google account
# 3. Click "Get API Key"
# 4. Click "Create API Key in new project"
# 5. Copy the generated key
```

### **4. Environment Variables Template**

Create these in Vercel Dashboard → Settings → Environment Variables:

```env
# Database
POSTGRES_URL=postgres://default:password@ep-xxx.us-east-1.postgres.vercel-storage.com/verceldb
POSTGRES_PRISMA_URL=postgres://default:password@ep-xxx.us-east-1.postgres.vercel-storage.com/verceldb
POSTGRES_URL_NON_POOLING=postgres://default:password@ep-xxx.us-east-1.postgres.vercel-storage.com/verceldb
POSTGRES_USER=default
POSTGRES_HOST=ep-xxx.us-east-1.postgres.vercel-storage.com
POSTGRES_PASSWORD=password
POSTGRES_DATABASE=verceldb

# Authentication
JWT_SECRET=a1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456

# Google Gemini AI
GOOGLE_GEMINI_API_KEY=AIzaSyC1234567890abcdefghijklmnopqrstuvwxyz

# Razorpay
RAZORPAY_KEY_ID=rzp_test_1234567890abcdef
RAZORPAY_KEY_SECRET=abcdef1234567890abcdef1234567890
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_1234567890abcdef

# App Configuration
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
NODE_ENV=production
```

## Testing Your Deployment

### **1. Check Setup**
- Visit: `https://your-domain.vercel.app/setup-check`
- Verify all services are working

### **2. Test Authentication**
- Visit: `https://your-domain.vercel.app/auth`
- Try to register a new user
- Check if user is created

### **3. Test Payments**
- Visit: `https://your-domain.vercel.app/pricing`
- Try to upgrade to Basic plan
- Use test card: `4111 1111 1111 1111`

### **4. Test AI Features**
- Go to any page with AI features
- Try generating content
- Check if AI responses work

## Troubleshooting

### **Build Errors**
```bash
# If you get Razorpay errors:
# 1. Check if RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET are set
# 2. Ensure keys are valid (not placeholder values)
# 3. Redeploy after adding environment variables
```

### **Database Errors**
```bash
# If you get database errors:
# 1. Check if POSTGRES_URL is set correctly
# 2. Ensure database is created in Vercel
# 3. Check if connection string is valid
```

### **Authentication Errors**
```bash
# If you get auth errors:
# 1. Check if JWT_SECRET is set
# 2. Ensure JWT_SECRET is long and random
# 3. Check if cookies are working
```

## Production Checklist

- [ ] All environment variables set in Vercel
- [ ] Database created and connected
- [ ] Razorpay account verified (for live payments)
- [ ] Gemini API key working
- [ ] JWT secret generated
- [ ] Domain configured
- [ ] SSL certificate active
- [ ] User registration working
- [ ] Payment integration working
- [ ] AI features working

## Support

If you encounter issues:

1. **Check Vercel Logs**:
   - Go to Vercel Dashboard → Functions → View Logs

2. **Check Environment Variables**:
   - Ensure all variables are set correctly
   - No typos in variable names

3. **Test Locally First**:
   - Set up `.env.local` file
   - Test with `npm run dev`

4. **Contact Support**:
   - Vercel: [vercel.com/support](https://vercel.com/support)
   - Razorpay: [razorpay.com/support](https://razorpay.com/support)

## Cost Estimates

- **Vercel**: Free tier available
- **Vercel Postgres**: Free tier available
- **Razorpay**: 2% transaction fee
- **Google Gemini**: Pay-per-use (very affordable)

Your application should now deploy successfully! 🎉
