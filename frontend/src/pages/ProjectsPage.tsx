import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { api } from "../api/client";
import { Link } from "react-router-dom";

interface Project {
    _id: string;
    name: string;
    description?: string;
}

interface ProjectsResponse {
    data: Project[];
    meta: {
        page: number;
        limit: number;
        total: number;
    };
}

export const ProjectsPage = () => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(false);

    const fetchProjects = async () => {
        const { data } = await api.get<ProjectsResponse>("/projects");
        setProjects(data.data);
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    const handleCreate = async (e: FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;
        setLoading(true);
        try {
            await api.post("/projects", { name, description });
            setName("");
            setDescription("");
            await fetchProjects();
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8">
            {/* Encabezado */}
            <div className="flex flex-col gap-2">
                <h2 className="text-2xl font-semibold text-slate-900">
                    Mis proyectos
                </h2>
                <p className="text-sm text-slate-500 max-w-xl">
                    Crea y administra tus proyectos. Desde aquí podrás gestionar tareas,
                    colaboradores y ver el avance general en el dashboard.
                </p>
            </div>

            {/* Formulario de creación */}
            <form
                onSubmit={handleCreate}
                className="bg-white/90 border border-slate-200 rounded-2xl shadow-sm px-4 py-4 md:px-5 md:py-5 flex flex-col md:flex-row gap-3 items-start md:items-end"
            >
                <div className="flex-1 w-full space-y-2">
                    <label className="text-xs font-medium text-slate-500">
                        Nombre del proyecto
                    </label>
                    <input
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                        placeholder="Ej. Plataforma interna, App de tareas, CRM..."
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>

                <div className="flex-1 w-full space-y-2">
                    <label className="text-xs font-medium text-slate-500">
                        Descripción (opcional)
                    </label>
                    <input
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                        placeholder="Breve contexto para el equipo"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </div>

                <button
                    disabled={loading}
                    className="inline-flex items-center justify-center rounded-xl bg-sky-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-sky-700 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                    {loading ? "Creando..." : "Crear"}
                </button>
            </form>

            {/* Lista de proyectos */}
            <div className="space-y-4">
                <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                    Proyectos recientes
                </h3>

                <div className="grid gap-4 md:grid-cols-2">
                    {projects.map((p) => (
                        <div
                            key={p._id}
                            className="group bg-white/90 border border-slate-200 rounded-2xl p-4 shadow-sm hover:shadow-md hover:border-sky-200 transition-all duration-150 flex flex-col justify-between"
                        >
                            <div className="space-y-1.5">
                                <h4 className="font-semibold text-slate-900 group-hover:text-sky-700">
                                    {p.name}
                                </h4>
                                {p.description && (
                                    <p className="text-sm text-slate-500 line-clamp-3">
                                        {p.description}
                                    </p>
                                )}
                            </div>
                            <div className="mt-3">
                                <Link
                                    to={`/projects/${p._id}/tasks`}
                                    className="inline-flex items-center text-xs font-medium text-sky-600 hover:text-sky-700"
                                >
                                    Ver tareas
                                    <span className="ml-1 text-[11px]">↗</span>
                                </Link>
                            </div>
                        </div>
                    ))}

                    {projects.length === 0 && (
                        <div className="col-span-full bg-white/80 border border-dashed border-slate-300 rounded-2xl p-6 text-center text-sm text-slate-500">
                            Aún no tienes proyectos creados. Usa el formulario superior para
                            crear el primero.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
