# Registration & Login Fix - Complete Guide

## Problem Summary

**What Was Wrong:**
1. The axios baseURL was hardcoded to `http://YOUR_LOCAL_IP:5000/api` which needs to be replaced with your actual PC IP
2. Limited error logging made debugging difficult
3. Frontend validation wasn't detailed enough
4. Error messages from backend weren't being properly displayed

## Solution Applied

### 1. Fixed `src/api/axios.js`

**Key Changes:**
- ✅ Added detailed comments about why "localhost" doesn't work on phones/emulators
- ✅ Added instructions for Android emulator: `http://10.0.2.2:5000/api`
- ✅ Added instructions for physical device: `http://YOUR_PC_IP:5000/api`
- ✅ Increased timeout from 10s to 15s for slower connections
- ✅ Added console.log to show configured backend URL
- ✅ Added Postman testing instructions in comments

### 2. Fixed `src/screens/RegisterScreen.js`

**Key Changes:**
- ✅ Added password matching validation (explicit check)
- ✅ Added password length validation (minimum 6 characters)
- ✅ Added email format validation using regex
- ✅ Added comprehensive console.log for debugging:
  - `console.log("📤 REGISTER: Attempting registration...")`
  - `console.log("❌ REGISTER ERROR: ...")`
  - `console.log("✅ REGISTER SUCCESS: ...")`
- ✅ Loading state already working (button disabled, text changes)
- ✅ Error messages display properly
- ✅ Navigation handled automatically

### 3. Fixed `src/screens/LoginScreen.js`

**Key Changes:**
- ✅ Added email format validation
- ✅ Added console.log for debugging:
  - `console.log("📤 LOGIN: Attempting login...")`
  - `console.log("❌ LOGIN ERROR: ...")`
  - `console.log("✅ LOGIN SUCCESS: ...")`
- ✅ Loading state working (button disabled, text changes)
- ✅ Error messages display properly
- ✅ Navigation handled automatically

### 4. Improved `src/context/AuthContext.js`

**Key Changes:**
- ✅ Added API request logging: `console.log("📡 REGISTER API: Sending request...")`
- ✅ Added response logging: `console.log("📡 REGISTER API: Response received...")`
- ✅ Added error status logging: `console.log("Response status:", error.response?.status)`
- ✅ Same improvements for login function

---

## Step-by-Step Setup Instructions

### Step 1: Find Your PC IP Address

#### On Windows:
1. Open **Command Prompt** (Press `Windows Key + R`, type `cmd`, press Enter)
2. Type: `ipconfig`
3. Press Enter
4. Look for **"IPv4 Address"** under your active network adapter
5. Example output: `IPv4 Address . . . . . . . . . . : 192.168.1.5`

**Note:** You'll likely see multiple IP addresses. Use the one that starts with:
- `192.168.x.x` (most common)
- `10.0.x.x`
- NOT `127.0.0.1` (that's localhost - won't work on phone)
- NOT `::1` (that's IPv6 - not what we need)

### Step 2: Update axios.js with Your IP

1. Open `clinic-app/src/api/axios.js`
2. Find the line: `const BACKEND_URL = 'http://YOUR_PC_IP:5000/api';`
3. Replace `YOUR_PC_IP` with your actual IP found in Step 1

**Example:**
```javascript
// Before:
const BACKEND_URL = 'http://YOUR_PC_IP:5000/api';

// After (if your IP is 192.168.1.5):
const BACKEND_URL = 'http://192.168.1.5:5000/api';
```

### Step 3: Start Your Backend Server

1. Open Terminal/PowerShell
2. Navigate to backend folder: `cd backend`
3. Start server: `npm start`
4. Server should run on: `http://localhost:5000`
5. API available at: `http://localhost:5000/api`

### Step 4: Test Backend Connection with Postman

Before testing in the app, verify the backend is working:

1. **Install Postman** (free from https://www.postman.com/downloads/)
2. **Create a new POST request:**
   - URL: `http://YOUR_PC_IP:5000/api/auth/register`
   - Method: POST
   - Headers tab: `Content-Type: application/json`
   - Body tab (select "raw" and "JSON"):
   ```json
   {
     "name": "Test User",
     "email": "test@test.com",
     "password": "123456",
     "role": "patient"
   }
   ```
3. **Click Send**
4. **Expected responses:**
   - ✅ Success: `{ "success": true, "token": "...", "user": {...} }`
   - ❌ Error: `{ "success": false, "message": "Email already exists" }` or similar

**If Postman fails:**
- ❌ Backend is not running
- ❌ Wrong IP address
- ❌ Backend is listening on wrong port
- ❌ Phone/emulator can't reach PC (firewall issue)

### Step 5: Test in Expo App

1. **Reload the app** to pick up the new axios configuration:
   - If using Expo Go: press `r` in terminal
   - Or restart the development server

2. **Open Developer Console:**
   - Shake your phone (or press Ctrl+M on emulator)
   - Select "View debugging output"
   - Or use: `npx expo start` then press `j` to open debugger

3. **Try to register:**
   - Fill in all fields
   - Watch the console logs:
     - `📤 REGISTER: Attempting registration for: test@test.com`
     - `📡 REGISTER API: Sending request to /auth/register`
     - `📡 REGISTER API: Response received: {...}`
   - If error: `❌ REGISTER ERROR: ...` will show the exact problem

---

## Debugging Checklist

When registration fails, check these in order:

**1. Console Logs in Expo**
```
Look for:
✅ "📡 Backend URL configured: http://192.168.x.x:5000/api"
✅ "📤 REGISTER: Attempting registration..."
✅ "📡 REGISTER API: Sending request..."
```

**2. If you see network error:**
- ❌ IP address is wrong (update axios.js)
- ❌ Backend is not running (start with `npm start`)
- ❌ Firewall blocking connection (allow Node.js through firewall)
- ❌ Using emulator: Must use `10.0.2.2:5000` not your PC IP

**3. If backend returns error:**
```
Example errors:
- "Email already exists" → Use different email
- "Password must be at least 6 characters" → Password too short
- "Passwords do not match" → Confirm password incorrect
- "All fields are required" → Missing a field
- "Invalid email format" → Email syntax wrong
```

**4. If you see timeout:**
- ❌ Backend is slow or not responding
- ❌ Network connection is slow
- ❌ Phone is on different WiFi network than PC

---

## Complete Code Reference

### src/api/axios.js
```javascript
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ================================================
// IMPORTANT: Configure your backend URL here
// ================================================
// 
// CRITICAL: "localhost" does NOT work on a real phone or emulator!
// You MUST use your PC's actual IP address.
//
// For Android Emulator: http://10.0.2.2:5000/api
// For Physical Phone:   http://YOUR_PC_IP:5000/api
//
// HOW TO FIND YOUR PC IP:
// Windows: Open Command Prompt and type:  ipconfig
//          Look for "IPv4 Address" (usually 192.168.x.x or 10.x.x.x)
//
// Example:  Replace YOUR_PC_IP with actual IP like 192.168.1.5
// Result:   http://192.168.1.5:5000/api
//
// Test with Postman:
// - POST http://YOUR_PC_IP:5000/api/auth/register
// - Headers: Content-Type: application/json
// - Body: { "name": "Test", "email": "test@test.com", "password": "123456", "role": "patient" }
// ================================================

const BACKEND_URL = 'http://YOUR_PC_IP:5000/api';

// Create axios instance with base configuration
const axiosInstance = axios.create({
  baseURL: BACKEND_URL,
  timeout: 15000, // 15 second timeout for API calls
  headers: {
    'Content-Type': 'application/json',
  },
});

// Log the configured backend URL (useful for debugging)
console.log('📡 Backend URL configured:', BACKEND_URL);

// Interceptor to add token to requests
axiosInstance.interceptors.request.use(
  async (config) => {
    try {
      // Get token from AsyncStorage
      const token = await AsyncStorage.getItem('authToken');
      
      // Add token to Authorization header if it exists
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error getting token from storage:', error);
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor to handle responses
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    // Handle common errors
    if (error.response?.status === 401) {
      // Token expired or invalid - clear storage and redirect handled by AuthContext
      try {
        await AsyncStorage.removeItem('authToken');
        await AsyncStorage.removeItem('user');
      } catch (e) {
        console.error('Error clearing storage:', e);
      }
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;
```

### RegisterScreen.js - Key Function
```javascript
const handleRegister = async () => {
  // Validate fields
  if (!name.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
    Alert.alert("Validation Error", "All fields are required");
    return;
  }

  // Check password match
  if (password !== confirmPassword) {
    console.log("❌ REGISTER ERROR: Passwords don't match");
    Alert.alert("Validation Error", "Passwords do not match");
    return;
  }

  // Check password length
  if (password.length < 6) {
    console.log("❌ REGISTER ERROR: Password too short");
    Alert.alert("Validation Error", "Password must be at least 6 characters");
    return;
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    console.log("❌ REGISTER ERROR: Invalid email format");
    Alert.alert("Validation Error", "Please enter a valid email address");
    return;
  }

  setLoading(true);
  console.log("📤 REGISTER: Attempting registration for:", email.trim());

  try {
    // Call register from context - it's now async
    const result = await register(
      name.trim(),
      email.trim(),
      password.trim(),
      confirmPassword.trim()
    );

    if (!result.success) {
      console.log("❌ REGISTER ERROR:", result.message);
      Alert.alert("Registration Failed", result.message);
    } else {
      console.log("✅ REGISTER SUCCESS:", result.message);
      // Navigation is handled by AppNavigator when isAuthenticated changes
      Alert.alert("Success", result.message);
    }
  } catch (error) {
    const errorMsg = error.response?.data?.message || error.message || "An unexpected error occurred";
    console.log("❌ REGISTER ERROR:", errorMsg);
    console.log("Full error:", error);
    Alert.alert("Error", "Registration failed. Please try again.");
  } finally {
    setLoading(false);
  }
};
```

### LoginScreen.js - Key Function
```javascript
const handleLogin = async () => {
  // Validate fields
  if (!email.trim() || !password.trim()) {
    Alert.alert("Validation Error", "Please enter email and password");
    return;
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    console.log("❌ LOGIN ERROR: Invalid email format");
    Alert.alert("Validation Error", "Please enter a valid email address");
    return;
  }

  setLoading(true);
  console.log("📤 LOGIN: Attempting login for:", email.trim());

  try {
    // Call login from context - it's now async
    const result = await login(email.trim(), password.trim());
    
    if (!result.success) {
      console.log("❌ LOGIN ERROR:", result.message);
      Alert.alert("Login Failed", result.message);
    } else {
      console.log("✅ LOGIN SUCCESS:", result.message);
      // Navigation is handled by AppNavigator when isAuthenticated changes
      Alert.alert("Success", result.message);
    }
  } catch (error) {
    const errorMsg = error.response?.data?.message || error.message || "An unexpected error occurred";
    console.log("❌ LOGIN ERROR:", errorMsg);
    console.log("Full error:", error);
    Alert.alert("Error", "Login failed. Please try again.");
  } finally {
    setLoading(false);
  }
};
```

---

## Network Connectivity Explained

### Why "localhost" Doesn't Work

| Device | What is localhost? | What to use? |
|--------|-------------------|-------------|
| **Your PC** | Your PC machine | `http://localhost:5000` or `http://127.0.0.1:5000` |
| **Android Emulator** | The emulator's machine | `http://10.0.2.2:5000` (special alias for host) |
| **Real Android Phone** | The phone itself | `http://YOUR_PC_IP:5000` (e.g., `http://192.168.1.5:5000`) |
| **iPhone Simulator (Mac)** | The Mac computer | `http://localhost:5000` or `http://127.0.0.1:5000` |
| **Real iPhone (Mac)** | The iPhone itself | `http://YOUR_MAC_IP:5000` |

### Network Path When Making Request

```
Your Phone/Emulator
         ↓
  (Makes HTTP request to 192.168.1.5:5000)
         ↓
    Your Router
         ↓
    Your PC (Backend Server)
         ↑
  (Returns response)
         ↑
Your Phone/Emulator (Receives response)
```

---

## Common Issues & Solutions

| Issue | Cause | Solution |
|-------|-------|----------|
| "Registration Failed" (no details) | Backend URL wrong | Update axios.js with correct IP from `ipconfig` |
| Network timeout error | Backend not running | Start backend with `npm start` in backend folder |
| "Cannot reach server" | Using `localhost` in app | Use your PC IP or `10.0.2.2` for emulator |
| Works on emulator, not on phone | Different networks | Ensure phone and PC are on same WiFi |
| Email already exists error | Email used before | Use different email address |
| Invalid email format | Email syntax wrong | Use format: `name@domain.com` |
| Passwords don't match | Confirm password different | Make sure both password fields match exactly |
| Backend receives request but gives error | Check MongoDB connection | Ensure database is running and connected |

---

## Testing Flow

```
1. Get PC IP (ipconfig)
   ↓
2. Update axios.js with IP
   ↓
3. Start backend (npm start)
   ↓
4. Test with Postman
   ↓
5. Reload Expo app
   ↓
6. Try registration
   ↓
7. Watch console logs
   ↓
8. Fix any errors from logs
   ↓
9. Success! 🎉
```

---

## Summary of Changes

✅ **Updated 4 Files:**
1. `src/api/axios.js` - Better configuration and documentation
2. `src/screens/RegisterScreen.js` - Enhanced validation and error logging
3. `src/screens/LoginScreen.js` - Enhanced validation and error logging
4. `src/context/AuthContext.js` - Better error logging

✅ **Added Features:**
- Comprehensive console logging with emojis
- Email format validation
- Password matching validation
- Detailed error messages
- Setup instructions

✅ **Kept Intact:**
- Loading states (already working)
- Navigation (automatic on auth state change)
- UI styling (no changes)
- Existing functionality
- Error alerts for users

---

## Next Steps

1. Update `src/api/axios.js` with your real PC IP
2. Start your backend server
3. Reload Expo app
4. Test registration and login
5. Check console logs for debugging
6. All working?  🎉 Ready for production!

**Questions?** Check the Debugging Checklist section or review console logs!
