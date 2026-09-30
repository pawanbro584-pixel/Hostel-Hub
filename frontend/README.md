# HostelHub Frontend - React Native Expo Application

Mobile client for HostelHub Room Booking Application built for SLIIT SE2020 Web & Mobile Technologies Individual Assignment.

## Features
- JWT Auth Session persistence via `AsyncStorage`
- Student & Admin context state management
- Room Catalog with Search & Room Type Filters
- Room Details with Real-time Occupancy & Spots Indicator
- Booking Creation & Student Booking Tracker
- Expo Image Picker integration for uploading room photos to Supabase Storage via Multer backend

## Environment & API Configuration
Change the backend base URL in `src/constants/config.js`:
```javascript
export const API_URL = 'http://YOUR_LOCAL_IP_OR_DEPLOYED_URL:5000/api';
```

## Running the App
```bash
npm install
npm run start
```
