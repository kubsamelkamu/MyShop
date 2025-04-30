import path from 'path';
import { fileURLToPath } from 'url';
import express from "express";
import xss from "xss-clean";
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';
//import { limiter } from './middleware/authMiddleware.js';
import authRoutes from './routes/authRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import productRoutes from './routes/productRoutes.js';
import uploadRoutes from './routes/uploadsRoutes.js';
import userRoutes from './routes/userRoute.js';
import wishListRoutes from './routes/wishListRoutes.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors());
app.use(express.json());
app.use(xss()); 
//app.use(limiter);  
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

app.use("/api/auth", authRoutes);
app.use("/api/cart",cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/products", productRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/users",userRoutes);
app.use("/api/wishlist", wishListRoutes);


app.get("/", (req, res) => {
    res.send("API is running...");
});

mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log('MongoDB connected successfully'))
.catch((err) => console.log(err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

