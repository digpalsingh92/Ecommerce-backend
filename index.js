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
import orderRoutes from './routes/order.routes.js';


const Port = process.env.PORT;

app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: "Too many requests from this IP, please try again later"
});
app.use(limiter);
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/order', orderRoutes);

app.get('/', (req, res) => {
    res.send("API is running....");
})
app.listen(Port, async () => {
    await DBConnect();
    console.log(`Server running on Port http://localhost:${Port}`)
})