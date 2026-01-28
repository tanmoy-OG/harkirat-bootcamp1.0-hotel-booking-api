import express from 'express';
import connectToMongoDB from './config/connectDB';
import dotenv from "dotenv";

const app = express();
const port = 5000;
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/hotels", hotelRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/reviews", reviewRoutes);

server.listen(port, () => {
    connectToMongoDB();
    console.log(`app listening to port ${port}`);
});

export default app;