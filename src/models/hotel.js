import mongoose from "mongoose";

const hotelSchema = new mongoose.Schema(
    {
        ownerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        name: {
            type: String,
            required: true,
        },
        desc: {
            type: String,
        },
        city: {
            type: String,
            required: true,
        },
        country: {
            type: String,
            required: true,
        },
        amenities: {
            type: [String],
            default: [],
        },
        rating: {
            type: Number,
            default: 0.0,
        },
        totalReviews: {
            type: Number,
            default: 0,
        },
        createdAt: {
            type: Date,
            default: Date.now,
        }
    },
);

const Hotel = mongoose.model('Hotel', hotelSchema);

export default Hotel;