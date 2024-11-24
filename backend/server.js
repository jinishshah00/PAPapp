import express from 'express';
import dotenv from 'dotenv'; 
import cors from 'cors';
import path from 'path';
dotenv.config(); //getting port number from dotenv 
import cookieParser from 'cookie-parser';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import connectDB from './config/db.js';
const port = process.env.PORT || 5000;
import userRoutes from './routes/userRoutes.js';
import petRoutes from './routes/petRoutes.js';

connectDB();

const app = express();

app.use(cors({
    origin: 'http://localhost:3000', // Replace with your frontend's origin
    credentials: true // Allows cookies to be sent with requests
  }));
app.use(express.json());
app.use(express.urlencoded({ extended: true}));

app.use(cookieParser());
app.use('/api/users', userRoutes);
app.use('/api/pets', petRoutes);

app.get('/', (req, res) => res.send('Server is Ready'));

app.use(notFound);
app.use(errorHandler);

app.listen(port, () => console.log(`Server started at port ${port}`));