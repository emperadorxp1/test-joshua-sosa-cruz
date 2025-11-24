import { Response } from "express";
import { AuthRequest } from "../../middleware/auth.middleware";
import { Project } from "../../models/project.model";
import { User } from "../../models/user.model";
import { Task } from "../../models/task.model";

// Crear proyecto
export const createProject = async (req: AuthRequest, res: Response) => {
    const { name, description } = req.body;
    const owner = req.userId!;

    if (!name) {
        return res.status(400).json({ message: "El nombre del proyecto es obligatorio" });
    }

    const project = await Project.create({
        name,
        description,
        owner,
        collaborators: []
    });

    return res.status(201).json(project);
};

// Listar proyectos del usuario (owner o colaborador) con paginación y búsqueda
export const listProjects = async (req: AuthRequest, res: Response) => {
    const userId = req.userId!;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const search = (req.query.search as string) || "";

    const filter: any = {
        $or: [{ owner: userId }, { collaborators: userId }]
    };

    if (search) {
        filter.name = { $regex: search, $options: "i" };
    }

    const [projects, total] = await Promise.all([
        Project.find(filter)
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit),
        Project.countDocuments(filter)
    ]);

    return res.json({
        data: projects,
        meta: {
            page,
            limit,
            total
        }
    });
};

// Obtener detalle de un proyecto
export const getProject = async (req: AuthRequest, res: Response) => {
    const userId = req.userId!;
    const { id } = req.params;

    const project = await Project.findById(id)
        .populate("owner", "name email")
        .populate("collaborators", "name email");

    if (!project) {
        return res.status(404).json({ message: "Proyecto no encontrado" });
    }

    const isMember =
        project.owner.toString() === userId ||
        project.collaborators.some((c) => c.toString() === userId);

    if (!isMember) {
        return res.status(403).json({ message: "No tienes acceso a este proyecto" });
    }

    return res.json(project);
};

// Actualizar proyecto (solo owner)
export const updateProject = async (req: AuthRequest, res: Response) => {
    const userId = req.userId!;
    const { id } = req.params;
    const { name, description } = req.body;

    const project = await Project.findById(id);

    if (!project) {
        return res.status(404).json({ message: "Proyecto no encontrado" });
    }

    if (project.owner.toString() !== userId) {
        return res.status(403).json({ message: "Solo el creador puede editar el proyecto" });
    }

    if (name !== undefined) project.name = name;
    if (description !== undefined) project.description = description;

    await project.save();

    return res.json(project);
};

// Eliminar proyecto (solo owner)
export const deleteProject = async (req: AuthRequest, res: Response) => {
    const userId = req.userId!;
    const { id } = req.params;

    const project = await Project.findById(id);

    if (!project) {
        return res.status(404).json({ message: "Proyecto no encontrado" });
    }

    if (project.owner.toString() !== userId) {
        return res
            .status(403)
            .json({ message: "Solo el creador puede eliminar el proyecto" });
    }

    // 🔹 Extra: eliminar también las tareas del proyecto
    await Task.deleteMany({ project: project._id });

    await project.deleteOne();
    return res.status(204).send();
};

// Añadir colaborador por email (solo owner)
export const addCollaborator = async (req: AuthRequest, res: Response) => {
    const userId = req.userId!;
    const { id } = req.params;
    const { email } = req.body;

    const project = await Project.findById(id);

    if (!project) {
        return res.status(404).json({ message: "Proyecto no encontrado" });
    }

    if (project.owner.toString() !== userId) {
        return res.status(403).json({
            message: "Solo el creador puede gestionar colaboradores"
        });
    }

    const user = await User.findOne({ email });

    if (!user) {
        return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const already = project.collaborators.some(
        (c) => c.toString() === user._id.toString()
    );

    if (!already) {
        project.collaborators.push(user._id);
        await project.save();
    }

    return res.json(project);
};

// Eliminar colaborador (solo owner)
export const removeCollaborator = async (req: AuthRequest, res: Response) => {
    const userId = req.userId!;
    const { id, collaboratorId } = req.params;

    const project = await Project.findById(id);

    if (!project) {
        return res.status(404).json({ message: "Proyecto no encontrado" });
    }

    if (project.owner.toString() !== userId) {
        return res.status(403).json({
            message: "Solo el creador puede gestionar colaboradores"
        });
    }

    project.collaborators = project.collaborators.filter(
        (c) => c.toString() !== collaboratorId
    );

    await project.save();

    return res.json(project);
};
