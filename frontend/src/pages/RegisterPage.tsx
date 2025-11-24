import { useState } from "react";
import type { FormEvent } from "react";
import { useAuthStore } from "../store/authStore";
import { useNavigate, Link } from "react-router-dom";

export const RegisterPage = () => {
    const { register, loading } = useAuthStore();
    const [name, setName] = useState("Joshua");
    const [email, setEmail] = useState("joshua");
    const [password, setPassword] = useState("joshua123");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError("");
        try {
            await register(name, email, password);
            navigate("/projects");
        } catch {
            setError("No se pudo registrar. Intenta con otro email.");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-slate-100">
            <form
                onSubmit={handleSubmit}
                className="bg-white shadow-md rounded-lg p-6 w-full max-w-md space-y-4"
            >
                <h2 className="text-xl font-semibold text-center">Crear cuenta</h2>

                {error && (
                    <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded">
                        {error}
                    </p>
                )}

                <div>
                    <label className="block text-sm mb-1">Nombre</label>
                    <input
                        className="w-full border rounded px-3 py-2 text-sm"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm mb-1">Email</label>
                    <input
                        className="w-full border rounded px-3 py-2 text-sm"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm mb-1">Contraseña</label>
                    <input
                        type="password"
                        className="w-full border rounded px-3 py-2 text-sm"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                <button
                    disabled={loading}
                    className="w-full bg-slate-900 text-white py-2 rounded text-sm hover:bg-slate-800 disabled:opacity-60"
                >
                    {loading ? "Creando cuenta..." : "Registrarse"}
                </button>

                <p className="text-xs text-center">
                    ¿Ya tienes cuenta?{" "}
                    <Link to="/login" className="text-sky-600 hover:underline">
                        Inicia sesión
                    </Link>
                </p>
            </form>
        </div>
    );
};
