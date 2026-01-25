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
            type: date,
            required: true,
        },
        checkOut: {
            type: date,
            required: true,
        },
        guests: {
            type: number,
            required: true,
        },
        totalPrice: {
            type: number,
            required: true,
        },
        status: {
            type: string,
            default: 'confirmed',
            enum: ['confirmed', 'cancelled'],
        },
        bookingDate: {
            type: date,
            default: Date.now,
        },
        cancelledAt: {
            type: date,
        }
    },
);

const Booking = mongoose.model('Booking', bookingSchema);

export default Booking;