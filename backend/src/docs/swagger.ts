import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Express } from "express";

export const setupSwagger = (app: Express) => {
    const options: swaggerJSDoc.Options = {
        definition: {
            openapi: "3.0.0",
            info: {
                title: "Project Management API - Prueba Técnica",
                version: "1.0.0",
                description:
                    "API REST para gestión de proyectos, tareas. Documentación generada con Swagger.",
            },
            servers: [
                {
                    url: "http://localhost:4000/api",
                    description: "Servidor local",
                },
            ],
            components: {
                securitySchemes: {
                    BearerAuth: {
                        type: "http",
                        scheme: "bearer",
                        bearerFormat: "JWT",
                    },
                },
            },
            security: [
                {
                    BearerAuth: [],
                },
            ],
        },

        apis: ["./src/modules/**/*.ts"], // ⬅ IMPORTANTE: busca anotaciones en controladores
    };

    const swaggerSpec = swaggerJSDoc(options);
    app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};
