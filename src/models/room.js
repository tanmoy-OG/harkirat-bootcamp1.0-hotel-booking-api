import mongoose from "mongoose";

const roomSchema = new mongoose.Schema(
    {
        hotelId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Hotel",
        },
        roomNo: {
            type: string,
            required: true,
        },
        roomType: {
            type: string,
            required: true,
        },
        rate: {
            type: number,
            required: true,
        },
        maxOccupancy: {
            type: number,
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