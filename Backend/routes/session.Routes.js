import express from "express";
import { 
    createSession, 
    deleteSession, 
    getSessions, 
    getActiveSessions,
    getMachineStatus
} from "../controllers/session.controller.js";

const router = express.Router();

// Machine status route
router.get("/machine-status", getMachineStatus);

// Session routes
router.post("/create", createSession);
router.get("/all", getSessions);
router.get("/active", getActiveSessions);
router.delete("/:id", deleteSession);

export default router;
