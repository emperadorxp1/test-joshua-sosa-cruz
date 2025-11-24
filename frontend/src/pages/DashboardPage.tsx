import { useEffect, useState } from "react";
import { api } from "../api/client";

interface DashboardData {
    totalProjects: number;
    totalTasks: number;
    tasksByStatus: Record<string, number>;
    tasksByPriority: Record<string, number>;
}

export const DashboardPage = () => {
    const [data, setData] = useState<DashboardData | null>(null);

    const fetchDashboard = async () => {
        const { data } = await api.get<DashboardData>("/dashboard/me");
        setData(data);
    };

    useEffect(() => {
        fetchDashboard();
    }, []);

    if (!data) return <p>Cargando...</p>;

    return (
        <div className="space-y-6">
            <h2 className="text-xl font-semibold mb-4">Dashboard</h2>

            <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded shadow">
                    <p className="text-sm text-slate-500">Total proyectos</p>
                    <p className="text-2xl font-bold">{data.totalProjects}</p>
                </div>
                <div className="bg-white p-4 rounded shadow">
                    <p className="text-sm text-slate-500">Total tareas</p>
                    <p className="text-2xl font-bold">{data.totalTasks}</p>
                </div>
                <div className="bg-white p-4 rounded shadow">
                    <p className="text-sm text-slate-500">Por completar</p>
                    <p className="text-2xl font-bold">
                        {data.tasksByStatus["pending"] || 0}
                    </p>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div className="bg-white p-4 rounded shadow">
                    <h3 className="font-semibold mb-2">Tareas por estado</h3>
                    <ul className="space-y-1">
                        {Object.entries(data.tasksByStatus).map(([status, count]) => (
                            <li key={status} className="flex justify-between">
                                <span>{status}</span>
                                <span className="font-semibold">{count}</span>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="bg-white p-4 rounded shadow">
                    <h3 className="font-semibold mb-2">Tareas por prioridad</h3>
                    <ul className="space-y-1">
                        {Object.entries(data.tasksByPriority).map(([prio, count]) => (
                            <li key={prio} className="flex justify-between">
                                <span>{prio}</span>
                                <span className="font-semibold">{count}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};
