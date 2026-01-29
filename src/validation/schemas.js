import { z } from 'zod';

export const signupSchema = z.object({
    name: z.string(),
    email: z.email(),
    password: z.string(),
    role: z.enum(["owner", "customer"]).optional(),
    phone: z.string().optional(),
})

export const loginSchema = z.object({
    email: z.email(),
    password: z.string(),
})

export const createBookingSchema = z.object({
    roomId: z.string(),
    checkInDate: z.string(),
    checkOutDate: z.string(),
    guests: z.number(),
})

export const createHotelSchema = z.object({
    name: z.string(),
    description: z.string().optional(),
    city: z.string(),
    country: z.string(),
    amenities: z.array(z.string()).optional(),
})

export const createRoomSchema = z.object({
    roomNumber: z.string(),
    roomType: z.string(),
    pricePerNight: z.number(),
    maxOccupancy: z.number(),
})

export const giveReviewSchema = z.object({
    bookingId: z.string(),
    rating: z.number().min(1).max(5),
    comment: z.string().optional(),
})