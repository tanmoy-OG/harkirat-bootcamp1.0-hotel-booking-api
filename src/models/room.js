import mongoose from "mongoose";

const roomSchema = new mongoose.Schema(
    {
        hotelId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Hotel",
        },
        roomNo: {
            type: String,
            required: true,
        },
        roomType: {
            type: String,
            required: true,
        },
        rate: {
            type: Number,
            required: true,
        },
        maxOccupancy: {
            type: Number,
            required: true,
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
    },
);

const Room = mongoose.model('Room', roomSchema);

export default Room;