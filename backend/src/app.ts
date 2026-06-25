import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import requestsRouter from "./routes/requests";
import adminAuthRouter from "./routes/adminAuth";
import adminDemandesRouter from "./routes/adminDemandes";
import adminRequestsRouter from "./routes/adminRequests";
import logsRouter from "./routes/logs";
import adminLogsRouter from "./routes/adminLogs";
import adminAuditRouter from "./routes/adminAudit";
import { globalApiLimiter } from "./middleware/rateLimiters";
import { prisma } from "./prisma/client";

const app = express();

app.set("trust proxy", 1);

app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
  })
);

const defaultDevOrigins = "http://localhost:3000,http://127.0.0.1:3000";
const corsOrigins = (process.env.CORS_ORIGIN ?? defaultDevOrigins)
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: corsOrigins,
    methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(express.json({ limit: "1mb" }));
app.use("/api", globalApiLimiter);

app.get("/api/health", async (_req: Request, res: Response) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({
      success: true,
      message: "SoinsConnect API is running",
      data: { database: "connected" },
    });
  } catch (error) {
    console.error("[health] Database check failed:", error);
    res.status(503).json({
      success: false,
      message: "API en ligne mais base de données inaccessible",
      data: { database: "disconnected" },
    });
  }
});

app.use("/api/requests", requestsRouter);
app.use("/api/admin/auth", adminAuthRouter);
app.use("/api/admin/demandes", adminDemandesRouter);
app.use("/api/admin/requests", adminRequestsRouter);
app.use("/api/logs", logsRouter);
app.use("/api/admin/logs", adminLogsRouter);
app.use("/api/admin/audit", adminAuditRouter);

app.use((_req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: "Route non trouvée",
  });
});

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error("[API Error]", err);

  res.status(500).json({
    success: false,
    message:
      process.env.NODE_ENV === "production"
        ? "Une erreur interne est survenue"
        : err.message,
  });
});

export default app;
