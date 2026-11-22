
import swaggerJsdoc from "swagger-jsdoc";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "SupportDesk API",
      version: "1.0.0",
      description: "API documentation for SupportDesk application",
    },
    servers: [
      {
        url: "http://localhost:5000",
        description: "Local development server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        ErrorResponse: {
          type: "object",
          properties: {
            data: { type: "null" },
            error: {
              type: "object",
              properties: {
                message: { type: "string" },
              },
            },
            meta: { type: "null" },
          },
        },
        Ticket: {
          type: "object",
          properties: {
            id: { type: "integer" },
            title: { type: "string" },
            description: { type: "string" },
            status: {
              type: "string",
              enum: ["OPEN", "IN_PROGRESS", "CLOSED"],
            },
            priority: {
              type: "string",
              enum: ["LOW", "MEDIUM", "HIGH"],
            },
            userId: { type: "integer" },
            assigneeId: { type: "integer", nullable: true },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        Comment: {
          type: "object",
          properties: {
            id: { type: "integer" },
            message: { type: "string" },
            ticketId: { type: "integer" },
            userId: { type: "integer" },
            createdAt: { type: "string", format: "date-time" },
          },
        },
      },
    },
  },
  apis: ["src/routes/*.ts"],
};

export const swaggerSpec = swaggerJsdoc(options);
