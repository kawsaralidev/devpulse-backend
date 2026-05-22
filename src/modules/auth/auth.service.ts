import bcrypt from "bcrypt";
import { pool } from "../../db";
import config from "../../config";
import jwt from "jsonwebtoken";
import type { IUser } from "../../interface/user.interface";

export const createUser = async (payload: IUser) => {
  const { name, email, password, role } = payload;

  // check user exist
  const userData = await pool.query(`SELECT * FROM users WHERE email = $1`, [
    email,
  ]);

  if (userData.rows.length > 0) {
    throw new Error("Email already exists");
  }

  // hash password
  const hashPassword = await bcrypt.hash(password, 10);

  // insert user
  const query = `
    INSERT INTO users(name,email,password,role)
    VALUES($1,$2,$3,$4)
    RETURNING id,name,email,role,created_at,updated_at
  `;

  const values = [name, email, hashPassword, role ?? "contributor"];

  const result = await pool.query(query, values);

  return result.rows[0];
};

export const loginUser = async (payload: {
  email: string;
  password: string;
}) => {
  const { email, password } = payload;

  // check user exists
  const userResult = await pool.query(`SELECT * FROM users WHERE email = $1`, [
    email,
  ]);

  const user = userResult.rows[0];

  if (!user) {
    throw new Error("User not found");
  }

  // compare password
  const isPasswordMatched = await bcrypt.compare(password, user.password);

  if (!isPasswordMatched) {
    throw new Error("Password does not match");
  }

  // generate jwt token
  const token = jwt.sign(
    {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    config.jwt_secret as string,
    {
      expiresIn: "7d",
    },
  );

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      created_at: user.created_at,
      updated_at: user.updated_at,
    },
  };
};
