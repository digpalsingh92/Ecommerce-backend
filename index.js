import './config/config.js'

import express from 'express'
const app = express();

import morgan from 'morgan';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

import DBConnect from './config/db.js'
import authRoutes from './routes/auth.routes.js';
import productRoutes from './routes/product.route.js'
import cartRoutes from './routes/cart.routes.js'


const Port = process.env.PORT;

//Middlewares
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: "Too many requests from this IP, please try again later"
});
app.use(limiter); // rateLimiter

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);

app.get('/', (req, res) => {
    res.send("API is running....");
})
app.listen(Port, async () => {
    await DBConnect();
    console.log(`Server running on Port http://localhost:${Port}`)
})