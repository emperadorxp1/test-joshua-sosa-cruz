import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { useParams } from "react-router-dom";
import { api } from "../api/client";

interface Task {
    _id: string;
    title: string;
    status: "pending" | "in_progress" | "completed";
    priority: "low" | "medium" | "high";
}

export const TasksPage = () => {
    const { id } = useParams<{ id: string }>();
    const [tasks, setTasks] = useState<Task[]>([]);
    const [title, setTitle] = useState("");
    const [priority, setPriority] =
        useState<"low" | "medium" | "high">("medium");
    const [statusFilter, setStatusFilter] = useState<string>("");

    const fetchTasks = async () => {
        if (!id) return;
        const params: any = { projectId: id };
        if (statusFilter) params.status = statusFilter;

        const { data } = await api.get<Task[]>("/tasks", { params });
        setTasks(data);
    };

    useEffect(() => {
        fetchTasks();
    }, [id, statusFilter]);

    const handleCreate = async (e: FormEvent) => {
        e.preventDefault();
        if (!title.trim() || !id) return;
        await api.post("/tasks", {
            title,
            projectId: id,
            status: "pending",
            priority,
        });
        setTitle("");
        fetchTasks();
    };

    const handleStatusChange = async (taskId: string, status: string) => {
        await api.put(`/tasks/${taskId}`, { status });
        fetchTasks();
    };

    return (
        <div className="space-y-6">
            <h2 className="text-xl font-semibold">Tareas del proyecto</h2>

            <form
                onSubmit={handleCreate}
                className="bg-white p-4 rounded shadow flex flex-col md:flex-row gap-3"
            >
                <input
                    className="border rounded px-3 py-2 text-sm flex-1"
                    placeholder="Nueva tarea"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
                <select
                    className="border rounded px-3 py-2 text-sm"
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any)}
                >
                    <option value="low">Baja</option>
                    <option value="medium">Media</option>
                    <option value="high">Alta</option>
                </select>
                <button className="bg-slate-900 text-white px-4 py-2 rounded text-sm hover:bg-slate-800">
                    Crear tarea
                </button>
            </form>

            <div className="flex gap-3 items-center text-sm">
                <span>Filtrar por estado:</span>
                <select
                    className="border rounded px-2 py-1"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                >
                    <option value="">Todos</option>
                    <option value="pending">Pendiente</option>
                    <option value="in_progress">En progreso</option>
                    <option value="completed">Completada</option>
                </select>
            </div>

            <div className="grid gap-3">
                {tasks.map((t) => (
                    <div
                        key={t._id}
                        className="bg-white p-3 rounded shadow flex justify-between items-center text-sm"
                    >
                        <div>
                            <p className="font-semibold">{t.title}</p>
                            <p className="text-xs text-slate-500">
                                Prioridad: {t.priority} · Estado: {t.status}
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <button
                                className="px-2 py-1 rounded bg-amber-100 text-amber-700"
                                onClick={() => handleStatusChange(t._id, "in_progress")}
                            >
                                En progreso
                            </button>
                            <button
                                className="px-2 py-1 rounded bg-emerald-100 text-emerald-700"
                                onClick={() => handleStatusChange(t._id, "completed")}
                            >
                                Completar
                            </button>
                        </div>
                    </div>
                ))}
                {tasks.length === 0 && (
                    <p className="text-sm text-slate-600">
                        Aún no hay tareas para este proyecto.
                    </p>
                )}
            </div>
        </div>
    );
};
