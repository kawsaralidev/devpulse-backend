import type { TJwtPayload } from "./jwt";

declare global {
  namespace Express {
    interface Request {
      user?: TJwtPayload;
    }
  }
}

export {};
