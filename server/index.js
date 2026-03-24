import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import connectDB from './src/config/db.js';
import authRoutes from './src/routes/auth.routes.js';
import eventRoutes from './src/routes/event.routes.js';
import registrationRoutes from './src/routes/registration.routes.js';
import societyRoutes from './src/routes/society.routes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

const allowedOrigins = [
  'http://localhost:3000',
  'https://society-management-project-mern-4yr.vercel.app',
  'https://society-management-project-mern.vercel.app',
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'], // 👈 Yahan 'PATCH' add kar diya hai
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/registrations', registrationRoutes);
app.use('/api/societies', societyRoutes);

app.get('/', (req, res) => {
  res.send('API is running...');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});