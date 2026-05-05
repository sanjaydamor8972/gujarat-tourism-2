import express from "express";
import { getPlaces, addPlace, deletePlace } from "../controllers/placeController.js";
import { verifyToken, isAdmin } from "../middleware/auth.js";

const router = express.Router();

router.get("/", getPlaces);
router.post("/", verifyToken, isAdmin, addPlace);
router.delete("/:id", verifyToken, isAdmin, deletePlace);

export default router;