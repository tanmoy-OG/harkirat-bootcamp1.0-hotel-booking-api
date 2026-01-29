import express from 'express';
import connectToMongoDB from './config/connectDB.js';
import authRoutes from './routes/authRoutes.js'
import hotelRoutes from './routes/hotelRoutes.js'
import bookingRoutes from './routes/bookingRoutes.js'
import reviewRoutes from './routes/reviewRoutes.js'
import dotenv from "dotenv";

dotenv.config();
const app = express();
const port = 5000;
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/hotels", hotelRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/reviews", reviewRoutes);

app.listen(port, () => {
    connectToMongoDB();
    console.log(`app listening to port ${port}`);
});

export default app;