# Frontend + Backend Integration Guide

## ✅ Complete Integration Done

Your React Native Expo frontend has been fully connected with your Node.js/Express backend!

---

## 📦 Installation Steps

### Step 1: Install Required Packages

In your `clinic-app` folder, run:

```bash
npm install axios @react-native-async-storage/async-storage
```

Or with yarn:

```bash
yarn add axios @react-native-async-storage/async-storage
```

### Step 2: Configure Backend URL

Edit **`src/api/axios.js`** and replace `YOUR_LOCAL_IP` with your actual IP address:

```javascript
const BACKEND_URL = 'http://YOUR_LOCAL_IP:5000/api';
```

**Find your IP address:**
- **Windows**: Open CMD and type `ipconfig`, look for "IPv4 Address" (e.g., 192.168.1.5)
- **Mac**: System Preferences → Network → Wi-Fi → Advanced
- **Linux**: Run `ifconfig` or `hostname -I`

**Example:**
```javascript
const BACKEND_URL = 'http://192.168.1.5:5000/api';
```

⚠️ **Important**: `localhost` or `127.0.0.1` will NOT work on physical devices. You must use your actual local network IP.

---

## 🚀 Running Frontend and Backend Together

### Terminal 1: Start Backend

```bash
cd backend
npm run dev
```

You should see:
```
✓ Server running on http://localhost:5000
✓ MongoDB Connected: localhost
```

### Terminal 2: Start Frontend

```bash
cd clinic-app
npm start
# or
expo start
```

Then press:
- **i** for iOS simulator
- **a** for Android emulator
- **w** for web

---

## 📋 What's Connected

### Authentication (Real Backend)
- ✅ Register with email/password
- ✅ Login with credentials
- ✅ Token stored in AsyncStorage
- ✅ Persistent login (token restored on app start)
- ✅ Protected routes

### Doctors (Real Backend)
- ✅ Fetch all doctors from MongoDB
- ✅ Filter by specialization
- ✅ Show loading/error states
- ✅ Display doctor details

### Appointments (Real Backend)
- ✅ Book real appointments
- ✅ Fetch user's appointments
- ✅ Store appointments in MongoDB
- ✅ Support notes and symptoms

### User Profile (Real Backend)
- ✅ Show logged-in user data
- ✅ Logout functionality
- ✅ Real user information

---

## 🧪 Testing the Integration

### Test Login/Register

1. **Start backend** (`npm run dev` in backend folder)
2. **Start frontend** (`npm start` in clinic-app folder)
3. **Register** with email: `test@example.com`, password: `password123`
4. **You should be logged in** automatically
5. **Navigate to "Find Doctors"** - should load from backend

### Test Doctor List

The doctors list fetches from: `GET /api/doctors`

If empty, add doctors using Postman:
```
POST http://localhost:5000/api/doctors
Headers: Authorization: Bearer {your_token}
Body:
{
  "name": "Dr. John Doe",
  "specialization": "Cardiologist",
  "hospital": "City Hospital",
  "experience": 10,
  "fee": 500,
  "phone": "03001234567"
}
```

### Test Booking Appointment

1. **Login** as patient
2. **Select a doctor** from the list
3. **Click "Book Appointment"**
4. **Fill in details** (date in YYYY-MM-DD format, e.g., 2024-04-15)
5. **Click "Confirm Appointment"**
6. **Go to "My Appointments"** - should see your booking

---

## 🔑 Default Test Credentials

After creating the backend, register a new user in the app. First-time setup:

1. Open frontend app
2. Tap "Sign Up"
3. Fill in details:
   - Name: Your Name
   - Email: your@email.com
   - Password: password123
4. Tap "Register Now"
5. Automatically logged in ✅

---

## 🐛 Troubleshooting

### Issue: "Cannot connect to backend"

**Solution:**
1. Check backend is running: `npm run dev` shows "Server running on http://localhost:5000"
2. Verify IP address in `axios.js` matches your local network IP
3. Ensure backend and frontend are on same WiFi network
4. Check firewall isn't blocking port 5000

### Issue: "Token not found" / "Unauthorized"

**Solution:**
1. Make sure you're logged in first
2. AsyncStorage might be cleared - re-register
3. Check backend JWT_SECRET in .env matches

### Issue: "No doctors showing"

**Solution:**
1. Make sure backend is running
2. Add doctors via Postman (see Testing section above)
3. Check network tab in DevTools - any API errors?

### Issue: "Appointment not saving"

**Solution:**
1. Check date format: must be YYYY-MM-DD
2. Check mongoDB is running
3. View backend console for detailed error messages
4. Try in Postman first to debug

---

## 📁 Files Updated/Created

### New Files
- ✅ `src/api/axios.js` - Axios configuration with auto-token injection

### Modified Files
- ✅ `src/context/AuthContext.js` - Real API calls, token management
- ✅ `src/context/AppointmentContext.js` - Real API calls for appointments
- ✅ `src/navigation/AppNavigator.js` - Conditional routing based on auth
- ✅ `src/screens/LoginScreen.js` - Real login with loading state
- ✅ `src/screens/RegisterScreen.js` - Real registration with loading state
- ✅ `src/screens/HomeScreen.js` - Shows logged-in user name
- ✅ `src/screens/DoctorListScreen.js` - Fetches doctors from backend
- ✅ `src/screens/BookAppointmentScreen.js` - Real appointment booking
- ✅ `src/screens/MyAppointmentsScreen.js` - Loads user appointments
- ✅ `src/screens/ProfileScreen.js` - Shows real user data, logout button
- ✅ `src/components/AppointmentCard.js` - Updated for real data format
- ✅ `src/App.js` - StatusBar style fixed for dark theme

---

## 🎯 Next Steps

### 1. Deploy Backend

When ready for production:
- Deploy to Heroku, AWS, or DigitalOcean
- Update `BACKEND_URL` in axios.js with production URL
- Update MongoDB connection to Atlas

### 2. Add Features

Ideas to extend:
- Doctor search/filtering
- Appointment rescheduling/cancellation
- Payment integration
- Doctor ratings and feedback
- Email notifications
- Push notifications

### 3. Security

Before production:
- Change JWT_SECRET in backend .env
- Use environment variables in frontend
- Add request validation
- Implement rate limiting

---

## ✨ API Endpoints Connected

| Feature | Endpoint | Status |
|---------|----------|--------|
| Register | POST /auth/register | ✅ Connected |
| Login | POST /auth/login | ✅ Connected |
| Get Profile | GET /auth/profile | ✅ Connected |
| Get Doctors | GET /doctors | ✅ Connected |
| Get Schedules | GET /schedules/doctor/:id | ✅ Connected |
| Book Appointment | POST /appointments | ✅ Connected |
| My Appointments | GET /appointments/patient/:id | ✅ Connected |
| File Upload | POST /upload | Ready (not used) |
| Create Feedback | POST /feedbacks | Ready (not used) |

---

## 💡 Tips

1. **Always have backend running** before starting frontend
2. **Use same WiFi** for both devices and computer
3. **Clear app cache** if experiencing issues: Developer Menu → Clear Cache
4. **Check console logs** in both frontend and backend for debugging
5. **Test with Postman** first before testing on app

---

## 🎉 You're All Set!

Your clinic appointment app is now fully integrated with a real backend!

**Happy coding! 🚀**
