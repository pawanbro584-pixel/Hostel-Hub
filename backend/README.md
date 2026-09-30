# HostelHub Backend API

Full-stack Hostel Room Booking backend built with Node.js, Express.js, MongoDB Atlas, and Supabase Storage for SLIIT SE2020 Web & Mobile Technologies Individual Assignment.

## Features
- JWT Authentication & Authorization
- Password hashing using bcryptjs
- Admin vs Student Role-based Access Control
- Room CRUD operations with Supabase Storage image upload
- Booking CRUD operations with Hostel Capacity Validation Logic
- Centralized Error Handling & Input Validation with express-validator

## Environment Setup
Create a `.env` file based on `.env.example`:
```env
PORT=5000
MONGODB_URI=your_mongodb_atlas_uri
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=30d
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
SUPABASE_BUCKET=hostel-room-images
```

## Running the Server
```bash
npm install
npm run dev
```
