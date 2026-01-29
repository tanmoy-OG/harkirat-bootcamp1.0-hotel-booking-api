import { giveReviewSchema } from "../validation/schemas.js";
import Booking from "../models/booking.js";
import Review from "../models/review.js"
import verifyToken from "../utils/verifyToken.js";
import mongoose from "mongoose";

export const giveReview = async (req, res) => {
    try {
        const body = giveReviewSchema.safeParse(req.body);

        if (!body.success) {
            return res.status(400).json({
                success: false,
                data: null,
                error: "INVALID_REQUEST"
            });
        }

        const { bookingId, rating, comment } = body.data;
        const token = req.headers['authorization']?.split(' ')[1];
        const userId = verifyToken(token);

        if (!userId) {
            return res.status(401).json({
                success: false,
                data: null,
                error: "UNAUTHORIZED"
            });
        }

        if (!mongoose.Types.ObjectId.isValid(bookingId)) {
            return res.status(404).json({
                success: false,
                data: null,
                error: "BOOKING_NOT_FOUND"
            });
        }

        const booking = await Booking.findById(bookingId);
        if (!booking) {
            return res.status(404).json({
                success: false,
                data: null,
                error: "BOOKING_NOT_FOUND"
            });
        }

        if (booking.userId.toString() !== userId) {
            return res.status(403).json({
                success: false,
                data: null,
                error: "FORBIDDEN",
            });
        }

        const review = await Review.findOne({ bookingId });
        if (review) {
            return res.status(400).json({
                success: false,
                data: null,
                error: "ALREADY_REVIEWED",
            });
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const checkOut = new Date(booking.checkOut);
        const canReview = checkOut < today && booking.status === 'confirmed';
        if (!canReview) {
            return res.status(400).json({
                success: false,
                data: null,
                error: "BOOKING_NOT_ELIGIBLE",
            });
        }

        const newReview = new Review({
            userId,
            hotelId: booking.hotelId,
            bookingId: booking.bookingId,
            rating,
            comment,
        })

        if (newReview) {
            await newReview.save();

            res.status(201).json({
                success: true,
                data: {
                    id: newReview._id,
                    userId: newReview.userId,
                    hotelId: newReview.hotelId,
                    bookingId: newReview.bookingId,
                    rating: newReview.rating,
                    comment: newReview.comment,
                    createdAt: newReview.createdAt,
                },
                error: null,
            });
        }
    } catch (error) {
        console.log("Error in giveReview controller", error.message);
        res.status(500).json({
            success: false,
            data: null,
            error: "Internal Server Error",
        });
    }
}