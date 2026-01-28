import { z } from 'zod';

export const signupSchema = z.object({
    name: z.string(),
    email: z.email(),
    password: z.string(),
    role: z.string(),
    phone: z.string().optional(),
})

export const loginSchema = z.object({
    name: z.string(),
    email: z.email(),
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
    amenities: z.array(string()).optional(),
})

export const createRoomSchema = z.object({
    roomNumber: z.string(),
    roomType: z.string(),
    pricePerNight: z.number(),
    maxOccupancy: z.number(),
})

export const giveReviewSchema = z.object({
    bookingId: z.string(),
    rating: z.number(),
    comment: z.string().optional(),
})