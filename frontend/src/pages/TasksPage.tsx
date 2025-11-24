import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { useParams, Link } from "react-router-dom";
import { api } from "../api/client";

interface Task {
    _id: string;
    title: string;
    description?: string;
    status: "pending" | "in_progress" | "completed";
    priority: "low" | "medium" | "high";
    // opcional según tu modelo
    project?: { _id: string; name: string };
}

export const TasksPage = () => {
    const { id: projectId } = useParams<{ id: string }>();

    const [tasks, setTasks] = useState<Task[]>([]);
    const [title, setTitle] = useState("");
    const [priority, setPriority] = useState<"low" | "medium" | "high">("medium");
    const [statusFilter, setStatusFilter] = useState<string>("");
    const [priorityFilter, setPriorityFilter] = useState<string>("");

    const [loading, setLoading] = useState(false);

    const fetchTasks = async () => {
        if (!projectId) return;

        const params: any = { projectId, sortBy: "createdAt", order: "desc" };
        if (statusFilter) params.status = statusFilter;
        if (priorityFilter) params.priority = priorityFilter;

        const { data } = await api.get<Task[]>("/tasks", { params });
        setTasks(data);
    };

    useEffect(() => {
        fetchTasks();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [projectId, statusFilter, priorityFilter]);

    const handleCreate = async (e: FormEvent) => {
        e.preventDefault();
        if (!title.trim() || !projectId) return;
        setLoading(true);
        try {
            await api.post("/tasks", {
                title,
                projectId,
                status: "pending",
                priority,
            });
            setTitle("");
            setPriority("medium");
            await fetchTasks();
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (taskId: string, status: string) => {
        await api.put(`/tasks/${taskId}`, { status });
        fetchTasks();
    };

    const handleDeleteTask = async (task: Task) => {
        const confirmed = window.confirm(
            `¿Seguro que deseas eliminar la tarea "${task.title}"?`
        );
        if (!confirmed) return;

        await api.delete(`/tasks/${task._id}`);
        fetchTasks();
    };

    const labelStatus = (status: Task["status"]) => {
        if (status === "pending") return "Pendiente";
        if (status === "in_progress") return "En progreso";
        return "Completada";
    };

    const labelPriority = (priority: Task["priority"]) => {
        if (priority === "low") return "Baja";
        if (priority === "medium") return "Media";
        return "Alta";
    };

    return (
        <div className="space-y-8">
            {/* Encabezado */}
            <div className="flex items-center justify-between gap-3">
                <div>
                    <h1 className="text-2xl font-semibold text-slate-900">
                        Tareas del proyecto
                    </h1>
                    <p className="text-sm text-slate-500 mt-1 max-w-xl">
                        Crea, organiza y actualiza las tareas asociadas a este proyecto.
                        Puedes cambiar su estado, filtrar por prioridad y eliminar las que
                        ya no sean necesarias.
                    </p>
                </div>
                <Link
                    to="/projects"
                    className="text-xs md:text-sm text-sky-600 hover:text-sky-700 underline-offset-2 hover:underline"
                >
                    ← Volver a proyectos
                </Link>
            </div>

            {/* Formulario crear tarea */}
            <form
                onSubmit={handleCreate}
                className="bg-white/90 border border-slate-200 rounded-2xl shadow-sm px-4 py-4 md:px-5 md:py-5 flex flex-col md:flex-row gap-3 items-start md:items-end"
            >
                <div className="flex-1 w-full space-y-2">
                    <label className="text-xs font-medium text-slate-500">
                        Título de la tarea
                    </label>
                    <input
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                        placeholder="Ej. Preparar documentación de API"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-medium text-slate-500">
                        Prioridad
                    </label>
                    <select
                        className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                        value={priority}
                        onChange={(e) =>
                            setPriority(e.target.value as "low" | "medium" | "high")
                        }
                    >
                        <option value="low">Baja</option>
                        <option value="medium">Media</option>
                        <option value="high">Alta</option>
                    </select>
                </div>

                <button
                    disabled={loading}
                    className="inline-flex items-center justify-center rounded-xl bg-sky-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-sky-700 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                    {loading ? "Creando..." : "Crear tarea"}
                </button>
            </form>

            {/* Filtros */}
            <div className="flex flex-wrap items-center gap-3 text-xs md:text-sm">
                <span className="text-slate-500">Filtros rápidos:</span>

                <select
                    className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                >
                    <option value="">Estado: Todos</option>
                    <option value="pending">Pendiente</option>
                    <option value="in_progress">En progreso</option>
                    <option value="completed">Completada</option>
                </select>

                <select
                    className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                    value={priorityFilter}
                    onChange={(e) => setPriorityFilter(e.target.value)}
                >
                    <option value="">Prioridad: Todas</option>
                    <option value="low">Baja</option>
                    <option value="medium">Media</option>
                    <option value="high">Alta</option>
                </select>
            </div>

            {/* Lista de tareas */}
            <div className="space-y-3">
                {tasks.map((task) => (
                    <div
                        key={task._id}
                        className="bg-white/90 border border-slate-200 rounded-2xl p-4 shadow-sm flex justify-between items-center gap-3"
                    >
                        <div className="space-y-1">
                            <p className="text-sm font-medium text-slate-900">
                                {task.title}
                            </p>
                            <p className="text-xs text-slate-500">
                                Estado:{" "}
                                <span className="font-medium">{labelStatus(task.status)}</span>{" "}
                                · Prioridad:{" "}
                                <span className="font-medium">
                                    {labelPriority(task.priority)}
                                </span>
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-2 justify-end">
                            <button
                                className="px-3 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-100 text-xs hover:bg-amber-100"
                                onClick={() => handleStatusChange(task._id, "in_progress")}
                            >
                                En progreso
                            </button>
                            <button
                                className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 text-xs hover:bg-emerald-100"
                                onClick={() => handleStatusChange(task._id, "completed")}
                            >
                                Completar
                            </button>
                            <button
                                className="px-3 py-1 rounded-full bg-red-50 text-red-600 border border-red-100 text-xs hover:bg-red-100"
                                onClick={() => handleDeleteTask(task)}
                            >
                                Eliminar
                            </button>
                        </div>
                    </div>
                ))}

                {tasks.length === 0 && (
                    <div className="text-sm text-slate-500 bg-white/80 border border-dashed border-slate-300 rounded-2xl p-6 text-center">
                        Aún no hay tareas registradas para este proyecto.
                    </div>
                )}
            </div>
        </div>
    );
};
