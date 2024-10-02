import { Task } from "../models/task.modal.js";
import { User } from "../models/user.model.js";

// Create a new task
export async function newtask(req, res) {
  try {
    const task = await Task.create({
      ...req.body,
      // createdBy: req.user._id,
    });

    res.status(201).json(task);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating task", error: error.message });
  }
}

// Fetch tasks for the logged-in user
export async function getUserTasks(req, res) {
  try {
    const tasks = await Task.find();
    res.status(200).json(tasks);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching user tasks", error: error.message });
  }
}

// Update a task status or details
export async function updateTask(req, res) {
  const { id } = req.params;

  try {
    const task = await Task.findByIdAndUpdate(
      id,
      {
        ...req.body,
        updatedAt: Date.now(),
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!task) return res.status(404).json({ message: "Task not found" });

    await task.save();

    res.status(200).json(task);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating task", error: error.message });
  }
}

// Delete a task
export async function deleteTask(req, res) {
  const { id } = req.params;

  try {
    const task = await Task.findByIdAndDelete(id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    res.status(200).json({ message: "Task deleted" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting task", error: error.message });
  }
}

export async function filterAndSortTasks(req, res) {
  try {
    const { priority, status, sortByDate } = req.query;

    // Create a filter object based on query parameters
    const filter = {};
    if (priority) filter.priority = priority; // Filter by priority
    if (status) filter.status = status; // Filter by status

    // Sorting based on query parameter `sortByDate`
    // If `sortByDate=asc` (ascending, closest due date first), otherwise descending
    const sortOption = sortByDate === "asc" ? { dueDate: 1 } : { dueDate: -1 };

    // Fetch filtered and sorted tasks
    const tasks = await Task.find(filter).sort(sortOption);

    res.status(200).json(tasks);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching tasks", error: error.message });
  }
}
