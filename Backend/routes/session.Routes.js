import express from "express";
import { 
    createSession, 
    deleteSession, 
    getSessions, 
    getActiveSessions
} from "../controllers/session.controller.js";

const router = express.Router();


router.post("/create", createSession);
router.get("/all", getSessions);
router.get("/active", getActiveSessions);
router.delete("/:id", deleteSession);


export default router;
