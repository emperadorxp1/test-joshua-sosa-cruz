import { Router } from "express";
import { authMiddleware } from "../../middleware/auth.middleware";
import {
    createTask,
    deleteTask,
    getTask,
    listTasks,
    updateTask
} from "./task.controller";

const router = Router();

router.use(authMiddleware);

// GET /api/tasks
router.get("/", listTasks);

// POST /api/tasks
router.post("/", createTask);

// GET /api/tasks/:id
router.get("/:id", getTask);

// PUT /api/tasks/:id
router.put("/:id", updateTask);

// DELETE /api/tasks/:id
router.delete("/:id", deleteTask);

export default router;
