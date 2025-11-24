import { Router } from "express";
import { authMiddleware } from "../../middleware/auth.middleware";
import {
    addCollaborator,
    createProject,
    deleteProject,
    getProject,
    listProjects,
    removeCollaborator,
    updateProject
} from "./project.controller";

const router = Router();

// Todas las rutas de proyectos requieren autenticación
router.use(authMiddleware);

// GET /api/projects
router.get("/", listProjects);

// POST /api/projects
router.post("/", createProject);

// GET /api/projects/:id
router.get("/:id", getProject);

// PUT /api/projects/:id
router.put("/:id", updateProject);

// DELETE /api/projects/:id
router.delete("/:id", deleteProject);

// POST /api/projects/:id/collaborators
router.post("/:id/collaborators", addCollaborator);

// DELETE /api/projects/:id/collaborators/:collaboratorId
router.delete("/:id/collaborators/:collaboratorId", removeCollaborator);

export default router;
