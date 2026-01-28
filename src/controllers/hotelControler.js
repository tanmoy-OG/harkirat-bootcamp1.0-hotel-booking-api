import { createHotelSchema } from "../validation/schemas.js";
import Hotel from "../models/hotel";
import Room from "../models/room";
import User from "../models/user"
import verifyToken from "../utils/verifyToken.js";
import mongoose from "mongoose";

export const createHotel = async (req, res) => {
    try {
        const body = createHotelSchema(req.body);

        if (!body.success) {
            return res.status(400).json({
                success: false,
                data: null,
                error: "INVALID_REQUEST"
            });
        }

        const {
            name,
            description,
            city,
            country,
            amenities,
        } = body;
        const token = req.headers['authorization']?.split(' ')[1];
        const userId = verifyToken(token);

        if (!userId) {
            return res.status(401).json({
                success: false,
                data: null,
                error: "UNAUTHORIZED"
            });
        }

        const user = await User.findOne({ userId });
        if (user.role == 'customer') {
            return res.status(403).json({
                success: false,
                data: null,
                error: "FORBIDDEN"
            });
        }

        const newHotel = new Hotel({
            ownerId: userId,
            name,
            description,
            city,
            country,
            amenities,
        });

        if (newHotel) {
            await newHotel.save();

            res.status(201).json({
                success: true,
                data: {
                    id: newHotel._id,
                    ownerId: newHotel.ownerId,
                    name: newHotel.name,
                    description: newHotel.desc,
                    city: newHotel.city,
                    country: newHotel.country,
                    amenities: newHotel.aminities,
                    rating: newHotel.rating,
                    totalReviews: newHotel.totalReviews
                },
                error: null,
            })
        }
    } catch (error) {
        console.log("Error in signup controller", error.message);
        res.status(500).json({
            success: false,
            data: null,
            error: "Internal Server Error",
        });
    }
};

export const createRoom = async (req, res) => {
    try {
        const body = createHotelSchema(req.body);

        if (!body.success) {
            return res.status(400).json({
                success: false,
                data: null,
                error: "INVALID_REQUEST"
            });
        }

        const {
            roomNumber,
            roomType,
            pricePerNight,
            maxOccupancy,
        } = body;
        const hotelId = req.params.hotelId;
        const token = req.headers['authorization']?.split(' ')[1];
        const userId = verifyToken(token);

        if (!userId) {
            return res.status(401).json({
                success: false,
                data: null,
                error: "UNAUTHORIZED"
            });
        }

        const user = await User.findOne({ userId });
        if (user.role == 'customer' || hotel.ownerId != user._id) {
            return res.status(403).json({
                success: false,
                data: null,
                error: "FORBIDDEN"
            });
        }

        const room = await Room.find({ hotelId })
        if (room.findOne(roomNumber)) {
            return res.status(400).json({
                success: false,
                data: null,
                error: "ROOM_ALREADY_EXISTS"
            });
        }

        const hotel = await Hotel.findOne({ hotelId })
        if (!hotel) {
            return res.status(404).json({
                success: false,
                data: null,
                error: "HOTEL_NOT_FOUND"
            });
        }

        const newRoom = new Room({
            hotelId: hotelId,
            roomNo: roomNumber,
            roomType,
            rate: pricePerNight,
            maxOccupancy,
        });

        if (newRoom) {
            await newRoom.save();

            res.status(201).json({
                success: true,
                data: {
                    id: newRoom._id,
                    hotelId: newRoom.hotelId,
                    roomNumber: newHotel.roomNo,
                    roomType: newHotel.roomType,
                    pricePerNight: newHotel.rate,
                    maxOccupancy: newHotel.maxOccupancy,
                },
                error: null,
            })
        }
    } catch (error) {
        console.log("Error in signup controller", error.message);
        res.status(500).json({
            success: false,
            data: null,
            error: "Internal Server Error",
        });
    }
};

export const getHotel = async (req, res) => {
    try {
        const { city, country, minPrice, maxPrice, minRating } = req.query;
        const pipeline = [];
        const token = req.headers['authorization']?.split(' ')[1];
        const userId = verifyToken(token);

        if (!userId) {
            return res.status(401).json({
                success: false,
                data: null,
                error: "UNAUTHORIZED"
            });
        }

        if (city || country || minRating) {
            if (city) pipeline.push({ $match: { city } });
            if (country) pipeline.push({ $match: { country } });
            if (minRating) pipeline.push({
                $match: { rating: { $gte: Number(minRating) } },
            });
        }
        pipeline.push({
            $lookup: {
                from: 'rooms',
                localField: '_id',
                foreignField: 'hotelId',
                as: 'rooms',
            }
        });
        pipeline.push({ $match: { 'rooms.0': { $exists: true } } });
        pipeline.push({ $addFields: { minRate: { $min: '$rooms.rate' } } });
        if (minPrice || maxPrice) {
            priceFilter = {};
            if (minPrice) priceFilter.$gte = Number(minPrice);
            if (maxPrice) priceFilter$lte = Number(maxPrice);
            pipeline.push({ $match: { minRate: { priceFilter } } });
        };

        const hotels = await Hotel.aggregate(pipeline);
        res.status(200).json({
            success: true,
            data: hotels.map(hotel => ({
                id: hotel._id,
                name: hotel.name,
                description: hotel.desc,
                city: hotel.city,
                country: hotel.country,
                amenities: hotel.amenities,
                rating: hotel.rating,
                totalReviews: hotel.totalReviews,
                minPricePerNight: hotel.minRate,
            })),
            error: null,
        })
    } catch (error) {
        console.log("Error in signup controller", error.message);
        res.status(500).json({
            success: false,
            data: null,
            error: "Internal Server Error",
        });
    }
};

export const getRoom = async (req, res) => {
    try {
        const hotelId = req.params.hotelId;
        const token = req.headers['authorization']?.split(' ')[1];
        const userId = verifyToken(token);

        if (!userId) {
            return res.status(401).json({
                success: false,
                data: null,
                error: "UNAUTHORIZED"
            });
        }

        const pipeline = [
            { $match: { _id: new mongoose.Types.ObjectId(hotelId) } },
            {
                $lookup: {
                    from: 'rooms',
                    localField: '_id',
                    foreignField: 'hotelId',
                    as: 'rooms',
                }

            }]

        const result = await Hotel.aggregate(pipeline);
        if (!result || result.length === 0) {
            return res.status(404).json({
                success: false,
                data: null,
                error: "HOTEL_NOT_FOUND"
            });
        }

        const hotel = result[0];
        res.status(200).json({
            success: true,
            data: {
                id: hotel._id,
                ownerId: hotel.ownerId,
                name: hotel.name,
                description: hotel.desc,
                city: hotel.city,
                country: hotel.country,
                amenities: hotel.amenities,
                rating: hotel.rating,
                totalReviews: hotel.totalReviews,
                rooms: hotel.rooms,
            },
            error: null,
        })
    } catch (error) {
        console.log("Error in signup controller", error.message);
        res.status(500).json({
            success: false,
            data: null,
            error: "Internal Server Error",
        });
    }
};

