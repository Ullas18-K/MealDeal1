# API Integration Guide

## Backend Setup

1. **Start the backend server:**
   ```bash
   cd mealdeal-backend
   npm run dev
   ```

2. **Update MongoDB URI:**
   - Open `mealdeal-backend/.env`
   - Replace the dummy `MONGO_URI` with your actual MongoDB connection string

## Frontend-Backend Connection

### API Base URL
Currently set to: `http://localhost:4000/api/auth`

**For mobile testing (iOS/Android simulator):**
- iOS: Use `http://localhost:4000/api/auth`
- Android: Use `http://10.0.2.2:4000/api/auth` (Android emulator)
- Physical device: Use your computer's local IP (e.g., `http://192.168.1.X:4000/api/auth`)

### Available Endpoints

#### 1. Register (Sign Up)
```typescript
POST /api/auth/register
Body: {
  name: string,
  email: string,
  password: string,
  phone?: string,
  role: "donor" | "ngo"
}
Response: {
  message: string,
  user: { id, name, email, phone, role },
  accessToken: string,
  refreshToken: string
}
```

#### 2. Login
```typescript
POST /api/auth/login
Body: {
  email: string,
  password: string
}
Response: {
  message: string,
  user: { id, name, email, phone, role },
  accessToken: string,
  refreshToken: string
}
```

#### 3. Refresh Token
```typescript
POST /api/auth/refresh
Body: {
  refreshToken: string
}
Response: {
  message: string,
  accessToken: string
}
```

#### 4. Get Profile (Protected)
```typescript
GET /api/auth/profile
Headers: {
  Authorization: "Bearer <accessToken>"
}
Response: {
  user: { id, name, email, phone, role }
}
```

#### 5. Logout (Protected)
```typescript
POST /api/auth/logout
Headers: {
  Authorization: "Bearer <accessToken>"
}
Response: {
  message: string
}
```

## Token Management

### Current Implementation (Basic)
- Tokens are received after login/signup
- Not persisted yet (will be lost on app restart)

### Recommended: Implement AsyncStorage

1. **Install AsyncStorage:**
   ```bash
   npx expo install @react-native-async-storage/async-storage
   ```

2. **Update `utils/auth.ts`:**
   - Uncomment all AsyncStorage code
   - Import: `import AsyncStorage from '@react-native-async-storage/async-storage';`

3. **Usage in components:**
   ```typescript
   import { storeTokens, getAccessToken, clearAuthData } from '@/utils/auth';
   
   // After successful login
   await storeTokens(data.accessToken, data.refreshToken);
   await storeUser(data.user);
   
   // Making authenticated requests
   const token = await getAccessToken();
   const response = await fetch(`${API_URL}/profile`, {
     headers: { Authorization: `Bearer ${token}` }
   });
   
   // On logout
   await clearAuthData();
   ```

## Testing the Flow

### Test Donor Flow:
1. Navigate to Donor Login (`/donor`)
2. Click "Sign Up"
3. Fill in: Name, Email, Phone (optional), Password
4. Role is automatically set to "donor"
5. After signup, user is redirected to donor home

### Test NGO Flow:
1. Navigate to NGO Login (`/ngo`)
2. Click "Sign Up"
3. Fill in: Organization Name, Email, Contact Number (optional), Password
4. Role is automatically set to "ngo"
5. After signup, user is redirected to NGO home

### Role Verification:
- Donor accounts cannot log in through NGO login
- NGO accounts cannot log in through Donor login
- Role is verified on backend and frontend

## Network Configuration

### For Physical Device Testing:
1. Find your computer's local IP:
   - Windows: `ipconfig` (look for IPv4 Address)
   - Mac/Linux: `ifconfig` or `ip addr`

2. Update API_URL in files:
   - `app/donor/index.tsx`
   - `app/donor/signup.tsx`
   - `app/ngo/index.tsx`
   - `app/ngo/signup.tsx`
   - `utils/auth.ts`
   
   Replace `http://localhost:4000` with `http://YOUR_IP:4000`

3. Ensure both devices are on the same network

## Security Notes

⚠️ **Important for Production:**
- Never store passwords in plain text
- Use HTTPS in production
- Store tokens securely (use `expo-secure-store` for sensitive data)
- Implement token refresh logic before access token expires
- Add input validation and sanitization
- Implement rate limiting on backend
- Add proper error handling and logging

## Next Steps

1. ✅ Authentication system created
2. ✅ Role-based access control implemented
3. 🔲 Implement AsyncStorage for token persistence
4. 🔲 Add automatic token refresh mechanism
5. 🔲 Create protected route wrapper component
6. 🔲 Add forgot password functionality
7. 🔲 Implement email verification
8. 🔲 Add profile update functionality
