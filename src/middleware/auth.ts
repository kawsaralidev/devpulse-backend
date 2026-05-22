import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

import config from "../config";
import { pool } from "../db";
import type { ROLES, TJwtPayload } from "../type";

const auth = (...roles: ROLES[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // 1. Get token
      const token = req.headers.authorization;

      // 2. Check token exists
      if (!token) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized access",
        });
      }

      // 3. Verify token
      const decoded = jwt.verify(
        token,
        config.jwt_secret as string,
      ) as TJwtPayload;

      // 4. Find user from database
      const result = await pool.query(
        `
    SELECT * FROM users
    WHERE email = $1
  `,
        [decoded.email],
      );

      // 5. Check user exists
      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      const user = result.rows[0];

      // 6. Role verification
      if (roles.length && !roles.includes(user.role)) {
        return res.status(403).json({
          success: false,
          message: "Forbidden access",
        });
      }

      // 7. Save user info
      req.user = decoded as TJwtPayload;

      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired token",
      });
    }
  };
};

export default auth;
