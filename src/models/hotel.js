import mongoose from "mongoose";

const hotelSchema = new mongoose.Schema(
    {
        ownerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        name: {
            type: string,
            required: true,
        },
        desc: {
            type: string,
        },
        city: {
            type: string,
            required: true,
        },
        country: {
            type: string,
            required: true,
        },
        amenities: {
            type: [string],
            default: [],
        },
        rating: {
            type: number,
            default: 0.0,
        },
        totalReviews: {
            type: number,
            default: 0,
        },
        createdAt: {
            type: date,
            default: Date.now,
        }
    },
);

const Hotel = mongoose.model('Hotel', hotelSchema);

export default Hotel;