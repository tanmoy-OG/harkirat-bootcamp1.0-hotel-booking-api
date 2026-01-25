import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            unique: true,
        },
        hotelId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Hotel",
        },
        bookingId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Booking",
            unique: true,
        },
        rating: {
            type: Number,
            min: 1,
            max: 5,
            required: true,
        },
        comment: {
            type: string,
        },
        createdAt: {
            type: date,
            default: Date.now,
        }
    },
);

const Review = mongoose.model('Review', reviewSchema);

export default Review;