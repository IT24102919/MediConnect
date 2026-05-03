# Quick Start Checklist

## ✅ Pre-Setup

- [ ] Backend is created and ready at `d:\ClinicProject\backend`
- [ ] Frontend exists at `d:\ClinicProject\clinic-app`
- [ ] You know your local IP address (run `ipconfig` on Windows)

---

## 📦 Install Dependencies (ONE TIME)

In `clinic-app` folder, run:

```bash
npm install axios @react-native-async-storage/async-storage
```

---

## ⚙️ Configure Backend URL (IMPORTANT!)

1. Open: `clinic-app/src/api/axios.js`
2. Find: `const BACKEND_URL = 'http://YOUR_LOCAL_IP:5000/api';`
3. Replace `YOUR_LOCAL_IP` with your actual IP (e.g., `192.168.1.5`)

**Command to find your IP:**
- Windows: `ipconfig` (look for IPv4 Address like 192.168.x.x)
- Do NOT use localhost or 127.0.0.1

---

## 🚀 Run Everything

### Terminal 1: Backend
```bash
cd backend
npm run dev
```
Expected output:
```
✓ Server running on http://localhost:5000
✓ API Documentation: http://localhost:5000
✓ MongoDB Connected: localhost
```

### Terminal 2: Frontend
```bash
cd clinic-app
npm start
```
Or `expo start` if using Expo CLI

Select:
- Press `i` for iOS Simulator
- Press `a` for Android Emulator
- Press `w` for Web Browser

---

## 🧪 Test the App

### 1. Register New User
- Tap "Sign Up" (or navigate to Register)
- Enter: Name, Email, Password, Confirm Password
- Tap "Register Now"
- ✅ Should automatically login and show Home screen

### 2. View Doctors
- Tap "Find Doctors" button
- ✅ Should show list of doctors from backend
- If empty: Add doctors using Postman (see guide below)

### 3. Book Appointment
- Tap a doctor card
- Tap "Book Appointment"
- Fill in:
  - Date: YYYY-MM-DD format (e.g., 2024-04-15)
  - Time: Select from available slots
  - Symptoms: Optional
  - Notes: Optional
- Tap "Confirm Appointment"
- ✅ Should see success message

### 4. View My Appointments
- Tap "My Appointments" from home
- ✅ Should show the appointment you just booked

### 5. View Profile
- Tap "Profile Settings" from home
- ✅ Should show your name and email
- Tap "🚪 Logout" to test logout

---

## ➕ Add Sample Doctors (if needed)

Use Postman or curl:

```bash
POST http://localhost:5000/api/doctors
Authorization: Bearer {your_auth_token_from_login}
Content-Type: application/json

{
  "name": "Dr. Sarah Johnson",
  "specialization": "Cardiologist",
  "hospital": "City Medical Center",
  "experience": 10,
  "fee": 500,
  "phone": "03001234567",
  "description": "Experienced cardiologist"
}
```

---

## 🔗 API Calls Happening Behind the Scenes

| Screen | Action | API Call |
|--------|--------|----------|
| Register | Create account | POST /api/auth/register |
| Login | Sign in | POST /api/auth/login |
| Home | Show username | GET /api/auth/profile |
| Doctors List | Load doctors | GET /api/doctors |
| Book Appointment | Submit booking | POST /api/appointments |
| My Appointments | Load your bookings | GET /api/appointments/patient/{id} |
| Profile | Show user info | Context data (already fetched) |
| Logout | Sign out | Local only (token cleared) |

---

## 🐛 Common Issues & Fixes

| Issue | Fix |
|-------|-----|
| "Can't connect" | Check backend running, verify IP in axios.js |
| "No doctors" | Add doctors via Postman, refresh app |
| "Appointment not saved" | Check date format YYYY-MM-DD, verify MongoDB running |
| "Login fails" | Confirm you registered first, check password |
| "Blank screen" | Restart app, clear cache, check console logs |

---

## 📝 Important Notes

1. ⚠️ Replace `YOUR_LOCAL_IP` in `axios.js` - This is CRITICAL
2. ⚠️ Backend must be running BEFORE starting app
3. ⚠️ Both must be on same WiFi network
4. ⚠️ Date format must be `YYYY-MM-DD` when booking
5. ⚠️ Time slots are sent as simple strings: `09:00`, `09:30`, etc.

---

## ✨ Features Working

- ✅ User Registration & Login (Real backend with JWT)
- ✅ Token persistence (AsyncStorage)
- ✅ Protected routes (Login required to access app)
- ✅ Fetch doctors from database
- ✅ Book real appointments
- ✅ View saved appointments
- ✅ User profile with real data
- ✅ Logout functionality
- ✅ Error handling & loading states
- ✅ Dark theme UI

---

## 🎯 Next

Once everything works:
1. Test with multiple users
2. Add more doctors to database
3. Test appointment rescheduling
4. Add payment integration (optional)
5. Deploy to production

---

**All set! Your clinic app is now production-ready. 🚀**
