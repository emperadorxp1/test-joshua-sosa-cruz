import { useState } from "react";
import type { FormEvent } from "react";
import { useAuthStore } from "../store/authStore";
import { useNavigate, Link } from "react-router-dom";

export const LoginPage = () => {
    const { login, loading } = useAuthStore();
    const [email, setEmail] = useState("joshua"); // para test con tu backend
    const [password, setPassword] = useState("joshua123");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError("");
        try {
            await login(email, password);
            navigate("/projects");
        } catch {
            setError("Credenciales inválidas");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-slate-100">
            <form
                onSubmit={handleSubmit}
                className="bg-white shadow-md rounded-lg p-6 w-full max-w-md space-y-4"
            >
                <h2 className="text-xl font-semibold text-center">Iniciar sesión</h2>

                {error && (
                    <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded">
                        {error}
                    </p>
                )}

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
                    {loading ? "Ingresando..." : "Entrar"}
                </button>

                <p className="text-xs text-center">
                    ¿No tienes cuenta?{" "}
                    <Link to="/register" className="text-sky-600 hover:underline">
                        Regístrate aquí
                    </Link>
                </p>
            </form>
        </div>
    );
};
