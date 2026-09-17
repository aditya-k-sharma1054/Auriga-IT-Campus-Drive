import cors from "cors";
import express from "express";
import { AppError } from "./lib.js";
import { appRouter, authRouter } from "./routes.js";

export const app = express();

app.use(cors({ origin: process.env.WEB_ORIGIN ?? "http://localhost:5173" }));
app.use(express.json());

app.get("/api/v1/health", (_request, response) => {
  response.json({ status: "ok", service: "parkops-api" });
});

app.use("/api/v1/auth", authRouter);
app.use("/api/v1", appRouter);

app.use((_request, response) => {
  response.status(404).json({ error: { code: "NOT_FOUND", message: "Route not found." } });
});

app.use((error: unknown, _request: express.Request, response: express.Response, _next: express.NextFunction) => {
  if (error instanceof AppError) return response.status(error.status).json({ error: { code: error.code, message: error.message } });
  if (error instanceof Error && error.name === "ZodError") return response.status(400).json({ error: { code: "VALIDATION_ERROR", message: error.message } });
  console.error(error);
  return response.status(500).json({ error: { code: "INTERNAL_ERROR", message: "Something went wrong." } });
});
