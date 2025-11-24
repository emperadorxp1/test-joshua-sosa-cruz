import { useEffect } from "react";
import type { ReactNode } from "react";
import { useAuthStore } from "../store/authStore";
import { useNavigate, Link, useLocation } from "react-router-dom";

interface Props {
    children: ReactNode;
}

export const Layout = ({ children }: Props) => {
    const { user, fetchMe, logout } = useAuthStore();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (!user && localStorage.getItem("token")) {
            fetchMe();
        }
    }, [user, fetchMe]);

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    const isActive = (path: string) =>
        location.pathname.startsWith(path)
            ? "text-sky-600"
            : "text-slate-500 hover:text-slate-800";

    return (
        <div className="min-h-screen bg-slate-100 text-slate-900">
            {/* Top bar */}
            <header className="border-b border-slate-200 bg-white/80 backdrop-blur-md">
                <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
                    <div className="flex flex-col">
                        <span className="text-xs uppercase tracking-[0.18em] text-slate-400">
                            Prueba técnica · Fullstack
                        </span>
                        <h1 className="text-sm md:text-base font-semibold text-slate-900">
                            Plataforma de gestión de proyectos
                        </h1>
                    </div>

                    <nav className="flex items-center gap-4 text-xs md:text-sm">
                        <Link className={isActive("/projects")} to="/projects">
                            Proyectos
                        </Link>
                        <Link className={isActive("/dashboard")} to="/dashboard">
                            Dashboard
                        </Link>

                        {user && (
                            <div className="flex items-center gap-3 pl-3 border-l border-slate-200">
                                <div className="hidden sm:flex flex-col text-right">
                                    <span className="text-xs text-slate-400">Sesión activa</span>
                                    <span className="text-sm font-medium text-slate-800">
                                        {user.name}
                                    </span>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="inline-flex items-center rounded-full bg-slate-900 px-3 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-slate-800 transition-colors"
                                >
                                    Salir
                                </button>
                            </div>
                        )}
                    </nav>
                </div>
            </header>

            {/* Content */}
            <main className="max-w-5xl mx-auto px-4 py-8">
                {children}
            </main>
        </div>
    );
};
