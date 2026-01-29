import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        roomId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Room",
        },
        hotelId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Hotel",
        },
        checkIn: {
            type: Date,
            required: true,
        },
        checkOut: {
            type: Date,
            required: true,
        },
        guests: {
            type: Number,
            required: true,
        },
        totalPrice: {
            type: Number,
            required: true,
        },
        status: {
            type: String,
            default: 'confirmed',
            enum: ['confirmed', 'cancelled'],
        },
        bookingDate: {
            type: Date,
            default: Date.now,
        },
        cancelledAt: {
            type: Date,
        }
    },
);

const Booking = mongoose.model('Booking', bookingSchema);

export default Booking;