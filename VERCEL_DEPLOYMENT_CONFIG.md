# 🚀 Vercel Deployment Configuration Guide

## ✅ Configuration Summary

### Backend URL Configuration
- **Backend Base URL:** `https://evb-1i4y.onrender.com/`
- **API Base URL:** `https://evb-1i4y.onrender.com/api`
- **Status:** ✅ All endpoints tested and working

### Frontend Environment Variables

#### `.env` File (Local)
```env
VITE_API_URL=https://evb-1i4y.onrender.com/api

# Frontend URL for redirects (update with your Vercel URL after deployment)
# VITE_FRONTEND_URL=https://your-app.vercel.app
```

#### Vercel Dashboard Configuration
Set these environment variables in your Vercel project:

1. **Required:**
   - `VITE_API_URL` = `https://evb-1i4y.onrender.com/api`

2. **Optional (but recommended):**
   - `VITE_FRONTEND_URL` = `https://your-app.vercel.app` (Your actual Vercel deployment URL)
   - `VITE_APP_ENVIRONMENT` = `production`

## 🧪 Backend Connection Tests

All endpoints have been tested against `https://evb-1i4y.onrender.com/`:

| Endpoint | Status | Result |
|----------|--------|--------|
| `GET /` | ✅ 200 OK | Backend is running |
| `GET /api/stations` | ✅ 200 OK | Returns stations array |
| `POST /api/users/login` | ✅ 401 Unauthorized | Endpoint exists (auth required) |
| `GET /api/slots/` | ✅ 401 Unauthorized | Endpoint exists (auth required) |
| `GET /api/bookings/user/` | ✅ 401 Unauthorized | Endpoint exists (auth required) |

**All endpoints are responding correctly!**

## 🔧 Issues Fixed

1. ✅ **Fixed EmailVerification.jsx** - Removed double `/api` path issue
   - Changed from: `${VITE_API_URL}/api/users/verify/`
   - Changed to: `${apiUrl}/users/verify/` (since VITE_API_URL already includes `/api`)

2. ✅ **Updated api.js default** - Set correct default backend URL
   - Default: `https://evb-1i4y.onrender.com/api`

3. ✅ **Created .env file** - Configured with production backend URL

## ⚠️ Important Notes

### Backend CORS Configuration

**CRITICAL:** The backend currently only allows localhost origins. You need to update the backend CORS configuration to allow your Vercel frontend URL.

**File:** `backend/server.js` (Line 22)

**Current:**
```javascript
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174', 'http://127.0.0.1:5173', 'http://127.0.0.1:5174'],
  credentials: true
}));
```

**Update to (add your Vercel URL):**
```javascript
app.use(cors({
  origin: [
    'http://localhost:5173', 
    'http://localhost:5174', 
    'http://127.0.0.1:5173', 
    'http://127.0.0.1:5174',
    'https://your-app.vercel.app',  // Replace with your actual Vercel URL
    /\.vercel\.app$/  // This allows all Vercel preview URLs
  ],
  credentials: true
}));
```

**Or for maximum flexibility (less secure):**
```javascript
app.use(cors({
  origin: true,  // Allows all origins
  credentials: true
}));
```

### Backend CLIENT_URL

The backend uses `CLIENT_URL` environment variable for email verification redirects.

**Set in Render Dashboard:**
- `CLIENT_URL` = `https://your-app.vercel.app` (Your Vercel frontend URL)

## 📋 Vercel Deployment Steps

1. **Push your code to GitHub** (if not already done)

2. **Import project to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Set Root Directory: `frontend`
   - Framework Preset: Vite

3. **Configure Environment Variables**
   - Go to Project Settings → Environment Variables
   - Add:
     - `VITE_API_URL` = `https://evb-1i4y.onrender.com/api`
     - `VITE_FRONTEND_URL` = `https://your-app.vercel.app` (will be set after first deployment)

4. **Deploy**
   - Click "Deploy"
   - Wait for deployment to complete
   - Note your deployment URL

5. **Update Backend CORS** (see above)
   - Update `backend/server.js` with your Vercel URL
   - Redeploy backend on Render

6. **Update Backend CLIENT_URL** (see above)
   - Set `CLIENT_URL` in Render dashboard
   - Restart backend service

7. **Update Vercel Environment Variables**
   - Update `VITE_FRONTEND_URL` with your actual Vercel URL
   - Redeploy frontend

## ✅ Verification Checklist

- [x] Backend URL is correct: `https://evb-1i4y.onrender.com/api`
- [x] `.env` file configured correctly
- [x] `api.js` default URL is correct
- [x] `EmailVerification.jsx` API call fixed
- [x] All backend endpoints tested and working
- [ ] Backend CORS updated with Vercel URL (Do this after deployment)
- [ ] Backend `CLIENT_URL` set in Render (Do this after deployment)
- [ ] Vercel environment variables configured
- [ ] Frontend deployed to Vercel
- [ ] Test login/registration after deployment
- [ ] Test all features after deployment

## 🔗 Quick Links

- **Backend URL:** https://evb-1i4y.onrender.com/
- **Backend API:** https://evb-1i4y.onrender.com/api
- **Vercel Dashboard:** https://vercel.com/dashboard
- **Render Dashboard:** https://dashboard.render.com/

---

**Status:** ✅ Frontend is ready for Vercel deployment!
**Date:** Current

