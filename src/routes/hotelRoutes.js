import express from "express";
import { createHotel, createRoom, getHotel, getRoom } from "../controllers/hotelController.js";

const router = express.Router();

router.post("/", createHotel);
router.post("/:hotelId/rooms", createRoom);
router.get("/", getHotel);
router.get("/:hotelId", getRoom);

export default router;