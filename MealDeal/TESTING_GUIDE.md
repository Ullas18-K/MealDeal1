# Quick Testing Guide - JWT Authentication

## 🚀 Start the Application

### Terminal 1: Start Backend
```bash
cd c:\Users\Ullas\MyDocs\Projects\mealdeal\mealdeal-backend
npm run dev
```
✅ Backend should run on `http://localhost:4000`

### Terminal 2: Start Frontend
```bash
cd c:\Users\Ullas\MyDocs\Projects\mealdeal\MealDeal
npm start
```
Choose your platform (iOS/Android/Web)

## ✅ Test Checklist

### 1. Test Donor Registration
- [ ] Navigate to `/donor` (donor login page)
- [ ] Click "Sign Up"
- [ ] Fill in:
  - Name: John Doe
  - Email: john@donor.com
  - Phone: 1234567890
  - Password: password123
- [ ] Click "Create Account"
- [ ] Should see success alert
- [ ] Should redirect to donor home
- [ ] Check console: "Signup successful, tokens stored"

### 2. Test Auto-Login (Donor)
- [ ] Close and reopen the app
- [ ] Navigate to `/donor`
- [ ] Should see "Checking authentication..." loading
- [ ] Should automatically redirect to donor home
- [ ] Should see "Welcome, John Doe 👋"

### 3. Test Logout (Donor)
- [ ] In donor home, click logout icon (top right)
- [ ] Click "Logout" in alert
- [ ] Should redirect to donor login
- [ ] Navigate to donor login again
- [ ] Should NOT auto-redirect (tokens cleared)

### 4. Test NGO Registration
- [ ] Navigate to `/ngo` (NGO login page)
- [ ] Click "Sign Up"
- [ ] Fill in:
  - Organization Name: Test NGO
  - Email: ngo@test.com
  - Contact: 9876543210
  - Password: password123
- [ ] Click "Create Account"
- [ ] Should redirect to NGO home

### 5. Test Role Protection
- [ ] Logout from donor account
- [ ] Try to login to NGO page with donor credentials
- [ ] Should see error: "This account is not registered as an NGO"
- [ ] Vice versa with NGO credentials on donor login

### 6. Test Invalid Token
- [ ] Login to donor account
- [ ] Stop the backend server
- [ ] Reload donor home page
- [ ] Should see "Unable to connect to server"
- [ ] Restart backend
- [ ] Should work again

### 7. Test JWT Verification
- [ ] Login to donor account
- [ ] Open browser/app console
- [ ] Should see logs:
  ```
  Login successful, tokens stored
  Access Token: eyJhbGciOiJIUzI1NiIs...
  Profile loaded: { id: '...', name: 'John Doe', ... }
  ```

## 🔍 Debug Checklist

### If auto-login doesn't work:
1. Check AsyncStorage in React Native Debugger
2. Look for keys: `accessToken`, `refreshToken`, `user`
3. Check console for errors during token verification

### If login fails:
1. Verify backend is running on port 4000
2. Check MongoDB is connected
3. Check network request in browser DevTools
4. Verify API_URL in auth.ts matches backend

### If tokens not stored:
1. Check console logs for AsyncStorage errors
2. Verify storeTokens() is being called
3. Check if AsyncStorage package is installed

## 📊 Expected Console Logs

### During Signup:
```
Signup successful, tokens stored
Access Token: eyJhbGciOiJIUzI1NiIs...
```

### During Login:
```
Login successful, tokens stored
Access Token: eyJhbGciOiJIUzI1NiIs...
```

### During Auto-Login:
```
Auth check error: [if any]
Profile loaded: { user: {...} }
```

### During Logout:
```
Logout error: [if any]
Auth data cleared successfully
```

## 🎯 API Request Examples

### Check if tokens are in headers:
Use browser DevTools → Network tab → Select a request → Headers

Should see:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Verify token payload:
Copy access token from console, paste into https://jwt.io

Should decode to:
```json
{
  "id": "507f1f77bcf86cd799439011",
  "email": "john@donor.com",
  "role": "donor",
  "iat": 1700000000,
  "exp": 1700000900
}
```

## ✨ Success Criteria

All tests pass when:
- ✅ Users can register and login
- ✅ Tokens are stored in AsyncStorage
- ✅ Auto-login works after app restart
- ✅ JWT tokens are sent in Authorization headers
- ✅ Backend verifies tokens correctly
- ✅ Logout clears all auth data
- ✅ Role-based access control works
- ✅ User profile displays correctly
- ✅ Token expiration is handled gracefully

---

**Last Updated:** November 17, 2025
**Status:** Ready for Testing ✅
