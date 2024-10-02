import express from "express";
import { task } from "../controllers/task.controller.js";

const router = express.Router();

router.post("/task", task);

export default router;
