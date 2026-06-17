# Albertsons Order Returns System

## Setup and Run Instructions

### Prerequisites
- Node.js installed
- Supabase account (PostgreSQL database)

### Backend Setup
cd backend
npm install

Create a .env file in backend folder:
DATABASE_URL=your_supabase_connection_string
JWT_SECRET=albertsons_secret_key_2024
PORT=5000

Run: node server.js

### Frontend Setup
cd frontend
npm install
npm start

### Test Credentials
- Customer: customer@test.com / password123
- Admin: admin@test.com / password123

## Technology Stack
- Frontend: React, Axios, CSS
- Backend: Node.js, Express.js
- Database: PostgreSQL (Supabase)
- Auth: JWT, bcryptjs

## Assumptions
- Returns accepted within 30 days of purchase
- Items in poor condition are auto-rejected
- Admin can manually approve or reject pending returns

## AI Tools Note
I used Claude (by Anthropic) throughout development. Claude helped scaffold the project structure, write backend API routes, design React frontend components, and debug authentication and database issues in real time. The main challenge was a bcrypt password hashing mismatch which Claude helped diagnose and fix quickly.