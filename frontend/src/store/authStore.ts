import { create } from "zustand";
import { api } from "../api/client";

interface User {
    _id: string;
    name: string;
    email: string;
}

interface AuthState {
    user: User | null;
    token: string | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (name: string, email: string, password: string) => Promise<void>;
    fetchMe: () => Promise<void>;
    logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    token: localStorage.getItem("token"),
    loading: false,

    login: async (email, password) => {
        set({ loading: true });
        try {
            const { data } = await api.post<{ token: string }>("/auth/login", {
                email,
                password,
            });
            localStorage.setItem("token", data.token);
            set({ token: data.token });
            await useAuthStore.getState().fetchMe();
        } finally {
            set({ loading: false });
        }
    },

    register: async (name, email, password) => {
        set({ loading: true });
        try {
            await api.post("/auth/register", { name, email, password });
            await useAuthStore.getState().login(email, password);
        } finally {
            set({ loading: false });
        }
    },

    fetchMe: async () => {
        try {
            const { data } = await api.get<User>("/auth/me");
            set({ user: data });
        } catch {
            localStorage.removeItem("token");
            set({ user: null, token: null });
        }
    },

    logout: () => {
        localStorage.removeItem("token");
        set({ user: null, token: null });
    },
}));
