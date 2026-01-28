import Hotel from "../models/hotel";
import Room from "../models/room";
import Booking from "../models/booking";
import verifyToken from "../utils/verifyToken.js";

export const createBooking = async (req, res) => {
    try {
        const {
            roomId,
            checkInDate,
            checkOutDate,
            guests,
        } = req.body;
        const token = req.headers['authorization']?.split(' ')[1];
        const userId = verifyToken(token);

        if (!userId) {
            return res.status(401).json({
                success: false,
                data: null,
                error: "UNAUTHORIZED"
            });
        }

        if (!roomId || !checkInDate || !checkOutDate || !guests) {
            return res.status(400).json({
                success: false,
                data: null,
                error: "INVALID_REQUEST"
            });
        }

        const room = await Room.findOne({ roomId });
        if (!room) {
            return res.status(404).json({
                success: false,
                data: null,
                error: "ROOM_NOT_FOUND",
            });
        }

        const checkIn = new Date(checkInDate);
        const checkOut = new Date(checkOutDate);
        const today = new Date();

        if (checkIn >= checkOut || checkIn < today) {
            return res.status(400).json({
                success: false,
                data: null,
                error: "INVALID_DATES",
            });
        }

        if (guests > room.maxOccupancy) {
            return res.status(400).json({
                success: false,
                data: null,
                error: "INVALID_CAPACITY",
            });
        }

        const hotel = await Hotel.findOne(room.hotelId);
        if (!hotel) {
            return res.status(404).json({
                success: false,
                data: null,
                error: "HOTEL_NOT_FOUND"
            });
        }

        if (hotel.ownerId.toString() === userId) {
            return res.status(403).json({
                success: false,
                data: null,
                error: "FORBIDDEN"
            });
        }

        const overlap = await Booking.findOne({
            roomId,
            status: 'confirmed',
            checkIn: { $lt: checkOut },
            checkOut: { $gt: checkIn },
        })
        if (overlap) {
            res.status(400).json({
                success: false,
                data: null,
                error: "ROOM_NOT_AVAILABLE",
            })
        }

        const nights = (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24);
        const totalPrice = nights * room.rate;

        const booking = new Booking({
            userId,
            roomId,
            hotelId: hotel._id,
            checkIn,
            checkOut,
            guests,
            totalPrice,
            status: "confirmed"
        });

        if (booking) {
            await booking.save();

            res.status(201).json({
                success: true,
                data: {
                    id: booking._id,
                    userId: booking.userId,
                    roomId: booking.roomId,
                    hotelId: booking.hotelId,
                    checkInDate: booking.checkIn,
                    checkOutDate: booking.checkOut,
                    guests: booking.guests,
                    totalPrice: booking.totalPrice,
                    status: booking.totalRevistatusews,
                    bookingDate: booking.bookingDate,
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

export const getBooking = async (req, res) => {
    try {
        const { status } = req.query;
        const filter = [];
        const token = req.headers['authorization']?.split(' ')[1];
        const userId = verifyToken(token);

        if (!userId) {
            return res.status(401).json({
                success: false,
                data: null,
                error: "UNAUTHORIZED"
            });
        }

        filter.userId = userId;
        if (status) filter.status = status;

        const bookings = await Booking.find(filter)
            .populate({
                path: "roomId",
                select: "roomNo roomType",
            })
            .populate({
                path: "hotelId",
                select: "name",
            })
            .sort({ bookingDate: -1 });

        res.status(200).json({
            success: true,
            data: bookings.map(booking => ({
                id: booking._id,
                roomId: booking.roomId._id,
                hotelId: booking.hotelId._id,
                hotelName: booking.hotelId.name,
                roomNumber: booking.roomId.roomNo,
                roomType: booking.roomType,
                checkInDate: booking.checkIn,
                checkOutDate: booking.checkOut,
                guests: booking.guests,
                totalPrice: booking.totalPrice,
                status: booking.totalRevistatusews,
                bookingDate: booking.bookingDate,
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

export const cancelBooking = async (req, res) => {
    try {
        const { bookingId } = req.params;
        const filter = [];
        const token = req.headers['authorization']?.split(' ')[1];
        const userId = verifyToken(token);

        if (!userId) {
            return res.status(401).json({
                success: false,
                data: null,
                error: "UNAUTHORIZED"
            });
        }

        const booking = Booking.findOne({ bookingId });
        if (!booking) {
            return res.status(404).json({
                success: false,
                data: null,
                error: "BOOKING_NOT_FOUND",
            });
        }

        if (booking.userId.toString() !== userId) {
            return res.status(403).json({
                success: false,
                data: null,
                error: "FORBIDDEN",
            });
        }

        if (booking.status === "cancelled") {
            return res.status(400).json({
                success: false,
                data: null,
                error: "ALREADY_CANCELLED",
            });
        }

        const now = new Date();
        const checkIn = new Date(booking.checkIn)
        const hoursUntilCheckIn = (checkIn.getTime() - now.getTime()) / (1000 * 60 * 60);

        if (hoursUntilCheckIn < 24) {
            return res.status(400).json({
                success: false,
                data: null,
                error: "CANCELLATION_DEADLINE_PASSED",
            });
        }

        booking.status = "cancelled";
        booking.cancelledAt = now;
        await booking.save();

        res.status(200).json({
            success: true,
            data: {
                id: booking._id,
                status: booking.status,
                cancelledAt: booking.cancelledAt,
            },
            error: null,
        });
    } catch (error) {
        console.log("Error in signup controller", error.message);
        res.status(500).json({
            success: false,
            data: null,
            error: "Internal Server Error",
        });
    }
};