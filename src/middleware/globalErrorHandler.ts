import type { NextFunction, Request, Response } from "express";

import config from "../config";

const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",

    stack: config.node_env === "development" ? err.stack : undefined,
  });
};

export default globalErrorHandler;
