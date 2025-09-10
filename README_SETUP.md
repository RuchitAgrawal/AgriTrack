# AgriTrack - Full Stack Setup Guide

## 🚀 Complete MongoDB Integration Setup

This project now has full backend integration with MongoDB. Follow these steps to run the complete application.

## Prerequisites

1. **Node.js** (v16 or higher)
2. **MongoDB** (local installation or MongoDB Atlas)
3. **Git**

## Installation Steps

### 1. Install Backend Dependencies

```bash
cd server
npm install
```

### 2. Install Frontend Dependencies

```bash
cd ..
npm install
```

### 3. Database Setup

#### Option A: Local MongoDB
1. Install MongoDB locally
2. Start MongoDB service:
   ```bash
   mongod
   ```
3. The app will connect to `mongodb://localhost:27017/agritrack`

#### Option B: MongoDB Atlas (Cloud)
1. Create a MongoDB Atlas account
2. Create a new cluster
3. Get your connection string
4. Update the `.env` file in the server directory:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/agritrack
   ```

### 4. Environment Configuration

Update `server/.env` file:
```env
MONGODB_URI=mongodb://localhost:27017/agritrack
JWT_SECRET=your_super_secure_jwt_secret_key_change_this_in_production
PORT=5000
NODE_ENV=development
```

## Running the Application

### 1. Start the Backend Server

```bash
cd server
npm run dev
```

The backend will run on `http://localhost:5000`

### 2. Start the Frontend (in a new terminal)

```bash
cd ..
npm run dev
```

The frontend will run on `http://localhost:5173`

## Database Models

### User Model
- **username**: Unique identifier
- **password**: Encrypted password
- **role**: farmer, distributor, or retailer
- **address**: Full address
- **aadhar**: 12-digit Aadhar number (unique)
- **walletId**: Blockchain wallet ID (unique)

### Transaction Model
- **cropDetails**: Name, quantity, quality, price
- **targetEntity**: Next entity in supply chain
- **transactionDate**: Date of transaction
- **supplyChain**: Stage tracking (production → distribution → retail)
- **status**: pending, confirmed, completed, cancelled

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Transactions
- `POST /api/transactions` - Create new transaction
- `GET /api/transactions` - Get user's transactions
- `GET /api/transactions/:id` - Get specific transaction
- `PUT /api/transactions/:id` - Update transaction
- `DELETE /api/transactions/:id` - Delete transaction

## Features Integrated

✅ **User Registration**: Admin can create farmers, distributors, retailers
✅ **User Authentication**: Login with username/password
✅ **Supply Chain Tracking**: 6-field transaction forms
✅ **Role-based Access**: Different dashboards for each role
✅ **Database Persistence**: All data stored in MongoDB
✅ **Real-time Updates**: Frontend connected to backend APIs

## Testing the Integration

1. **Create a User**: 
   - Go to admin panel: `/asdfghfdkjbwefihwedfvoijhnemdfvoi/admin`
   - Create a new user with role (farmer/distributor/retailer)

2. **Login**:
   - Use the username and password you created
   - You'll be redirected to the appropriate dashboard

3. **Create Transactions**:
   - Fill out the 6-field form (crop name, quantity, quality, price, target entity, date)
   - Data will be saved to MongoDB and displayed in real-time

## Troubleshooting

### Backend Issues
- Ensure MongoDB is running
- Check server logs for connection errors
- Verify environment variables in `.env`

### Frontend Issues
- Ensure backend is running on port 5000
- Check browser console for API errors
- Verify CORS settings if needed

### Database Issues
- Check MongoDB connection string
- Ensure database permissions are correct
- Verify network connectivity for Atlas

## Project Structure

```
AGRITRACK/
├── server/                 # Backend (Node.js + Express)
│   ├── models/            # MongoDB models
│   ├── routes/            # API routes
│   ├── middleware/        # Auth middleware
│   ├── config/            # Database config
│   └── server.js          # Main server file
├── src/                   # Frontend (React + Vite)
│   ├── components/        # React components
│   ├── utils/            # API client & utilities
│   └── ...
└── README_SETUP.md        # This file
```

## Next Steps

- Set up blockchain integration
- Add supply chain visualization
- Implement QR code generation
- Add email notifications
- Deploy to production

## Support

If you encounter any issues:
1. Check the console logs (both frontend and backend)
2. Verify all dependencies are installed
3. Ensure MongoDB is running and accessible
4. Check that all environment variables are set correctly
