import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { api } from "../api/client";
import { Link } from "react-router-dom";

interface Project {
    _id: string;
    name: string;
    description?: string;
}

export const ProjectsPage = () => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(false);

    const fetchProjects = async () => {
        const { data } = await api.get("/projects");
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

    const handleEditProject = async (project: Project) => {
        const newName = window.prompt(
            "Nuevo nombre del proyecto:",
            project.name
        );
        if (!newName || !newName.trim()) return;

        const newDescription = window.prompt(
            "Nueva descripción (opcional):",
            project.description || ""
        );

        await api.put(`/projects/${project._id}`, {
            name: newName.trim(),
            description: newDescription ?? "",
        });

        fetchProjects();
    };

    const handleDeleteProject = async (project: Project) => {
        const confirmed = window.confirm(
            `¿Seguro que deseas eliminar el proyecto "${project.name}"?`
        );
        if (!confirmed) return;

        await api.delete(`/projects/${project._id}`);
        fetchProjects();
    };

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-semibold text-slate-900">Mis proyectos</h1>
                <p className="text-sm text-slate-500 mt-1">
                    Crea y gestiona tus proyectos. Accede a sus tareas y colaboradores.
                </p>
            </div>

            {/* Crear proyecto */}
            <form
                onSubmit={handleCreate}
                className="bg-white shadow-sm border border-slate-200 rounded-xl p-5 space-y-3"
            >
                <div>
                    <label className="text-xs text-slate-600">Nombre del proyecto</label>
                    <input
                        className="w-full border rounded-lg px-3 py-2 text-sm bg-slate-50"
                        placeholder="Ej: Plataforma de tareas internas"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>

                <div>
                    <label className="text-xs text-slate-600">Descripción (opcional)</label>
                    <input
                        className="w-full border rounded-lg px-3 py-2 text-sm bg-slate-50"
                        placeholder="Descripción breve del proyecto"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </div>

                <button
                    disabled={loading}
                    className="px-4 py-2 bg-sky-600 text-white rounded-lg text-sm hover:bg-sky-700 disabled:opacity-50"
                >
                    {loading ? "Creando..." : "Crear proyecto"}
                </button>
            </form>

            {/* Lista de proyectos */}
            <div className="grid gap-4 md:grid-cols-2">
                {projects.map((project) => (
                    <div
                        key={project._id}
                        className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:shadow-md transition"
                    >
                        <div className="flex flex-col space-y-1">
                            <h2 className="text-lg font-semibold">{project.name}</h2>
                            <p className="text-sm text-slate-500">{project.description}</p>
                        </div>

                        <div className="flex items-center justify-between mt-4">
                            <Link
                                to={`/projects/${project._id}/tasks`}
                                className="text-sky-600 text-sm hover:underline"
                            >
                                Ver tareas
                            </Link>

                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => handleEditProject(project)}
                                    className="px-3 py-1 text-xs border rounded-full hover:bg-slate-100"
                                >
                                    Editar
                                </button>
                                <button
                                    onClick={() => handleDeleteProject(project)}
                                    className="px-3 py-1 text-xs bg-red-50 text-red-600 border border-red-200 rounded-full hover:bg-red-100"
                                >
                                    Eliminar
                                </button>
                            </div>
                        </div>
                    </div>
                ))}

                {projects.length === 0 && (
                    <div className="text-slate-600 text-sm col-span-full text-center p-6 bg-white border border-dashed rounded-xl">
                        No tienes proyectos creados aún.
                    </div>
                )}
            </div>
        </div>
    );
};
