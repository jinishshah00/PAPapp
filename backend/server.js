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
import formRoutes from './routes/formRoutes.js';
import resourceRoutes from './routes/resourceRoutes.js';
import httpProxy from 'http-proxy';

connectDB();

const app = express();

app.use(cors({
    origin: ['http://localhost:3000', 'http://127.0.0.1:5001'],  // Replace with your frontend's origin
    credentials: true // Allows cookies to be sent with requests
  }));
app.use(express.json());
app.use(express.urlencoded({ extended: true}));

//chatbot code
const chatbotProxy = httpProxy.createProxyServer();

app.use('/api/chatbot', (req, res) => {
  chatbotProxy.web(req, res, { target: 'http://127.0.0.1:5001' });
});

chatbotProxy.on('error', (err, req, res) => {
  console.error('Proxy error:', err);
  res.status(500).send('Error communicating with chatbot service.');
});


//CHATBOT END
app.use(cookieParser());
app.use('/api/users', userRoutes);
app.use('/api/pets', petRoutes);
app.use('/api/forms', formRoutes);
app.use('/api/resources', resourceRoutes);

app.get('/', (req, res) => res.send('Server is Ready'));

app.use(notFound);
app.use(errorHandler);

app.listen(port, () => console.log(`Server started at port ${port}`));