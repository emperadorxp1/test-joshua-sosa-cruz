import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import type { ReactElement } from "react";

interface Props {
    children: ReactElement;
}

export const ProtectedRoute = ({ children }: Props) => {
    const { token } = useAuthStore();
    if (!token) {
        return <Navigate to="/login" replace />;
    }
    return children;
};
