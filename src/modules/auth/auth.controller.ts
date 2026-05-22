import type { Request, Response } from "express";
import { createUser, loginUser } from "./auth.service";
import sendResponse from "../../utility/sendResponse";

export const signup = async (req: Request, res: Response) => {
  const result = await createUser(req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "User created successfully",
    data: result,
  });
};

export const login = async (req: Request, res: Response) => {
  const result = await loginUser(req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Login successful",
    data: result,
  });
};
