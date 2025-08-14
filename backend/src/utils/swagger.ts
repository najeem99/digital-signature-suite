import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Express, Request, Response } from "express";
import path from "path";

const options: swaggerJsdoc.Options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "PDF Signing API",
            version: "1.0.0",
            description: "API for PDF Signing Application"
        },
        components: {
            securitySchemes: { // typo: 'securitySchemas' -> 'securitySchemes'
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT"
                }
            }
        },
        security: [{ bearerAuth: [] }],
        servers: [{ url: "/" }]

    },
    apis: [path.join(__dirname, "../routes/*.ts")] // <- FIXED
};

const swaggerSpec = swaggerJsdoc(options);

function swaggerDocs(app: Express, port: number) {

    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

    app.get("/api-docs.json", (req: Request, res: Response) => {
        res.setHeader("Content-Type", "application/json");
        res.send(swaggerSpec);
    });

    console.log(`Swagger JSON docs available at http://localhost:${port}/api-docs.json`);
}

export default swaggerDocs;
