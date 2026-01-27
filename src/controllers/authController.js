import bcrypt from "bcryptjs";
import User from "../models/userModel.js";
import genToken from "../utils/genToken.js";

export const signup = async (req, res) => {
    try {
        const {
            name,
            email,
            password,
            role,
            phone,
        } = req.body;
        role = role.toLowerCase();

        if (!name || !email || !password || (role != '' && (role != 'customer' || role != 'owner'))) {
            return res.status(400).json({
                success: false,
                data: null,
                error: "INVALID_REQUEST"
            });
        }

        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({
                success: false,
                data: null,
                error: "EMAIL_ALREADY_EXISTS"
            });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPass = await bcrypt.hash(pass, salt);

        const newUser = new User({
            name,
            email,
            password: hashedPass,
            role,
            phone,
        });

        if (newUser) {
            res.status(201).json({
                success: true,
                data: {
                    id: newUser._id,
                    name: newUser.name,
                    email: newUser.email,
                    role: newUser.role,
                    phone: newUser.phone,
                },
                error: null,
            });
        }
    } catch (error) {
        console.log("Error in signup controller", error.message);
        res.status(500).json({
            success: false,
            data: null,
            error: "Internal Server Error"
        });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                data: null,
                error: "INVALID_REQUEST"
            });
        }

        const user = await User.findOne({ email });
        const isPasswordCorrect = await bcrypt.compare(password, user?.password || "");
        if (!email || !isPasswordCorrect) {
            return res.status(401).json({
                success: false,
                data: null,
                error: "INVALID_CREDENTIALS"
            });
        }

        const jwt = genToken(user._id);

        res.status(200).json({
            success: true,
            data: {
                token: jwt,
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                },
            },
            error: null,
        });
    } catch (error) {
        console.log("Error in login controller", error.message);
        res.status(500).json({
            success: false,
            data: null,
            error: "Internal Server Error"
        });
    }
};