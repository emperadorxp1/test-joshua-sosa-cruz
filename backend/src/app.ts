import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import authRoutes from "./modules/auth/auth.routes";
import projectRoutes from "./modules/projects/project.routes";
import dashboardRoutes from "./modules/dashboard/dashboard.routes";
import taskRoutes from "./modules/tasks/task.routes";
import { errorHandler } from "./middleware/error.middleware";
import { setupSwagger } from "./docs/swagger";
const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
setupSwagger(app);

// Rutas
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/dashboard", dashboardRoutes);


// Middleware de errores
app.use(errorHandler);

export default app;
