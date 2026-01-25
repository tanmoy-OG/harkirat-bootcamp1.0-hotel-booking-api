import Hotel from "../models/hotel";
import User from "../models/user"
import verifyToken from "../utils/verifyToken.js";

export const createHotel = async (req, res) => {
    try {
        const {
            name,
            description,
            city,
            country,
            amenities,
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

        if (!name || !city || !country) {
            return res.status(400).json({
                success: false,
                data: null,
                error: "INVALID_REQUEST"
            });
        }

        const user = await User.find({ userId });
        if (user.role == 'customer') {
            return res.status(401).json({
                success: false,
                data: null,
                error: "FORBIDDEN"
            });
        }

        const newHotel = new User({
            ownerId: userId,
            name,
            description,
            city,
            country,
            amenities,
        });

        if (newHotel) {
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