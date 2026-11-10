import type { Request, Response } from "express";
import { loginUser, registerUser } from "../services/auth.services";

const loginHandler = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const {
    id,
    email: userEmail,
    name,
    token,
  } = await loginUser(email, password);

  res.cookie("token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
  });

  return res.status(200).json({ id, email: userEmail, name });
};

const registerHandler = async (req: Request, res: Response) => {
  const { email, password, name } = req.body;

  const user = await registerUser(email, password, name);

  return res.status(201).json({ ...user });
};

export { loginHandler, registerHandler };
