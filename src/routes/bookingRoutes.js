import express from "express";
import { createBooking, cancelBooking, getBooking } from "../controllers/bookingController.js";

const router = express.Router();

router.post("/", createBooking);
router.get("/", getBooking);
router.put("/:bookingId/cancel", cancelBooking);

export default router;