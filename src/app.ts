import express, { type Application } from "express";
import type { Request, Response } from "express";
import authRoutes from "./modules/auth/auth.route";
import { IssueRoutes } from "./modules/issues/issue.route";
import globalErrorHandler from "./middleware/globalErrorHandler";

const app: Application = express();

// middleware
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("hello world");
});

// routes
app.use("/api/auth", authRoutes);
app.use("/api/issues", IssueRoutes);

app.use(globalErrorHandler);

export default app;
