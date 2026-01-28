import express from "express";
import { giveReview } from "../controllers/reviewController.js";

const router = express.Router();

router.post("/", giveReview);

export default router;