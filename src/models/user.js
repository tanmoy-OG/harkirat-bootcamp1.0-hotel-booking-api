import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        name: {
            type: string,
            required: true,
        },
        emsil: {
            type: string,
            required: true,
            unique: true,
        },
        password: {
            type: string,
            required: true,
        },
        role: {
            type: string,
            required: true,
            enum: ['customer', 'owner'],
        },
        createdAt: {
            type: date,
            default: Date.now,
        }
    },
);

const User = mongoose.model('User', userSchema);

export default User;