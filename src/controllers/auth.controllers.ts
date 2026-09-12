import type { Request, Response } from "express";
import { loginUser, registerUser } from "../services/auth.services";

const loginHandler = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const { user, token } = await loginUser(email, password);

 return res.status(200).json({ user, token });
};

const registerHandler = async (req: Request, res: Response) => {
    const { email, password, name } = req.body;

    const user=await registerUser(email, password, name);

    return res.status(201).json({ user });
};

export { loginHandler, registerHandler };
