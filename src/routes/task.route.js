import express from "express";
import {
  deleteTask,
  filterAndSortTasks,
  getUserTasks,
  newtask,
  updateTask,
} from "../controllers/task.controller.js";

const router = express.Router();

router.post("/task", newtask);

router.get("/my-tasks", getUserTasks);

router.patch("/update/:id", updateTask);

router.delete("/delete/:id", deleteTask);

router.get("/tasks/filter", filterAndSortTasks);

export default router;
