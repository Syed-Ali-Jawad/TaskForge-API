import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";

const validate = (
  schema: ZodSchema,
  target: "body" | "query" | "params" = "body",
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req[target]);

    if (!result.success) {
      return res.status(400).json({
        error: result.error.issues[0].message,
      });
    }

    req.body = result.data;
    next();
  };
};

export default validate;
