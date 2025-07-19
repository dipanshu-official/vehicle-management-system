import express from "express";
import {
  addVehicle,
  getAvailableVehicles,
  getAllVehicles,
  getVehicleById,
  updateVehicle,
  deleteVehicle,
} from "../controllers/vehicle.Controller.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();
router.post("/", authenticate, addVehicle);
router.get("/available", authenticate, getAvailableVehicles);
router.get("/", authenticate, getAllVehicles);
router.get("/:id", authenticate, getVehicleById);
router.put("/:id", updateVehicle);
router.delete("/:id", authenticate , deleteVehicle);

export default router;
