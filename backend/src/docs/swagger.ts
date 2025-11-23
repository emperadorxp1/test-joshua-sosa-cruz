import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options: swaggerJsdoc.Options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Project Management API",
            version: "1.0.0"
        }
    },
    apis: ["./src/modules/**/*.ts"]
};

export const swaggerSpec = swaggerJsdoc(options);
export { swaggerUi };
