import { Response } from "express";
import { AuthRequest } from "../../middleware/auth.middleware";
import { Project } from "../../models/project.model";
import { Task } from "../../models/task.model";

export const getMyDashboard = async (req: AuthRequest, res: Response) => {
    const userId = req.userId!;

    // Proyectos donde soy owner o colaborador
    const projects = await Project.find({
        $or: [{ owner: userId }, { collaborators: userId }]
    }).select("_id");

    const projectIds = projects.map((p) => p._id);

    const [totalProjects, totalTasks, tasksByStatusAgg, tasksByPriorityAgg] =
        await Promise.all([
            Project.countDocuments({
                $or: [{ owner: userId }, { collaborators: userId }]
            }),
            Task.countDocuments({ project: { $in: projectIds } }),
            Task.aggregate([
                { $match: { project: { $in: projectIds } } },
                { $group: { _id: "$status", count: { $sum: 1 } } }
            ]),
            Task.aggregate([
                { $match: { project: { $in: projectIds } } },
                { $group: { _id: "$priority", count: { $sum: 1 } } }
            ])
        ]);

    const tasksByStatus: Record<string, number> = {};
    tasksByStatusAgg.forEach((item) => (tasksByStatus[item._id] = item.count));

    const tasksByPriority: Record<string, number> = {};
    tasksByPriorityAgg.forEach(
        (item) => (tasksByPriority[item._id] = item.count)
    );

    return res.json({
        totalProjects,
        totalTasks,
        tasksByStatus,
        tasksByPriority
    });
};
