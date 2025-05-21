import { Request, Response, NextFunction } from "express";
import { ZodSchema, ZodError } from "zod";

const reqKeys = ["body", "params", "query", "headers"] as const;
type ReqKey = (typeof reqKeys)[number];

type Schema = Partial<Record<ReqKey, ZodSchema<any>>>;

export const validationMiddleware = (schema: Schema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const errors: string[] = [];

    for (const key of reqKeys) {
      const validator = schema[key];
      if (validator) {
        try {
          validator.parse(req[key]);
        } catch (err) {
          if (err instanceof ZodError) {
            errors.push(
              ...err.errors.map((e) => {
                const path = e.path.length > 0 ? e.path.join(".") : key;
                return `${path} - ${e.message}`;
              })
            );
          } else {
            errors.push("Unknown validation error");
          }
        }
      }
    }

    if (errors.length > 0) {
      res.status(400).json({
        err_msg: "validation error",
        errors,
      });
      return;
    }

    next();
  };
};
