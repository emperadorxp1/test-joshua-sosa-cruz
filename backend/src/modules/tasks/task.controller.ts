import { Response } from "express";
import { AuthRequest } from "../../middleware/auth.middleware";
import { Task } from "../../models/task.model";
import { Project } from "../../models/project.model";

// Valida que el usuario tenga acceso al proyecto
const ensureProjectAccess = async (projectId: string, userId: string) => {
    const project = await Project.findById(projectId);

    if (!project) {
        throw { status: 404, message: "Proyecto no encontrado" };
    }

    const isMember =
        project.owner.toString() === userId ||
        project.collaborators.some((c) => c.toString() === userId);

    if (!isMember) {
        throw { status: 403, message: "No tienes acceso a este proyecto" };
    }

    return project;
};

// Crear tarea
export const createTask = async (req: AuthRequest, res: Response) => {
    const userId = req.userId!;
    const {
        title,
        description,
        projectId,
        assigneeId,
        status,
        priority,
        dueDate
    } = req.body;

    if (!title || !projectId) {
        return res
            .status(400)
            .json({ message: "title y projectId son obligatorios" });
    }

    await ensureProjectAccess(projectId, userId);

    const task = await Task.create({
        title,
        description,
        project: projectId,
        assignee: assigneeId,
        status,
        priority,
        dueDate
    });

    return res.status(201).json(task);
};

// Listar tareas con filtros
export const listTasks = async (req: AuthRequest, res: Response) => {
    const userId = req.userId!;
    const {
        projectId,
        status,
        priority,
        assigneeId,
        sortBy = "createdAt",
        order = "desc"
    } = req.query;

    const filter: any = {};

    // Tareas solo en proyectos donde soy miembro
    const projects = await Project.find({
        $or: [{ owner: userId }, { collaborators: userId }]
    }).select("_id");

    const projectIds = projects.map((p) => p._id);

    filter.project = { $in: projectIds };

    if (projectId) filter.project = projectId;
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (assigneeId) filter.assignee = assigneeId;

    const sort: any = {};
    sort[sortBy as string] = order === "asc" ? 1 : -1;

    const tasks = await Task.find(filter)
        .populate("project", "name")
        .populate("assignee", "name email")
        .sort(sort);

    return res.json(tasks);
};
/**
 * @swagger
 * /tasks:
 *   get:
 *     summary: Listar tareas con filtros
 *     tags: [Tasks]
 *     parameters:
 *       - in: query
 *         name: projectId
 *         schema:
 *           type: string
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de tareas
 */


// Obtener una tarea
export const getTask = async (req: AuthRequest, res: Response) => {
    const userId = req.userId!;
    const { id } = req.params;

    const task = await Task.findById(id)
        .populate("project")
        .populate("assignee", "name email");

    if (!task) {
        return res.status(404).json({ message: "Tarea no encontrada" });
    }

    await ensureProjectAccess(task.project.toString(), userId);

    return res.json(task);
};

// Actualizar tarea
export const updateTask = async (req: AuthRequest, res: Response) => {
    const userId = req.userId!;
    const { id } = req.params;
    const { title, description, status, priority, assigneeId, dueDate } =
        req.body;

    const task = await Task.findById(id);

    if (!task) {
        return res.status(404).json({ message: "Tarea no encontrada" });
    }

    await ensureProjectAccess(task.project.toString(), userId);

    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (status !== undefined) task.status = status;
    if (priority !== undefined) task.priority = priority;
    if (assigneeId !== undefined) task.assignee = assigneeId;
    if (dueDate !== undefined) task.dueDate = dueDate;

    await task.save();

    return res.json(task);
};
/**
 * @swagger
 * /tasks/{id}:
 *   put:
 *     summary: Actualizar tarea
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: id
 *     responses:
 *       200:
 *         description: Tarea actualizada
 */


// Eliminar tarea
export const deleteTask = async (req: AuthRequest, res: Response) => {
    const userId = req.userId!;
    const { id } = req.params;

    const task = await Task.findById(id);

    if (!task) {
        return res.status(404).json({ message: "Tarea no encontrada" });
    }

    await ensureProjectAccess(task.project.toString(), userId);

    await task.deleteOne();

    return res.status(204).send();
};
/**
 * @swagger
 * /tasks/{id}:
 *   delete:
 *     summary: Eliminar tarea
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: id
 *     responses:
 *       204:
 *         description: Eliminada correctamente
 */
