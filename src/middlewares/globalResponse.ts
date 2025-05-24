/**
 * The `globalResponse` function handles error responses in an Express application by sending a JSON
 * response with the error status and message.
 * @param {ErrorWithStatus} err - The `err` parameter in the `globalResponse` function is an object
 * that represents an error. It is defined as an `ErrorWithStatus` interface, which extends the
 * built-in `Error` interface and adds an optional `status` property to it. This `status` property can
 * be used
 * @param {Request} req - `req` is the request object representing the HTTP request made by the client
 * to the server. It contains information about the request such as headers, parameters, body, etc.
 * @param {Response} res - The `res` parameter in the `globalResponse` function is the response object
 * representing the HTTP response that an Express app sends when it receives an HTTP request. It is
 * used to send a response back to the client with the specified status code and JSON data.
 * @param {NextFunction} next - The `next` parameter in the `globalResponse` function is a callback
 * function that is used to pass control to the next middleware function in the stack. It is typically
 * used in Express middleware functions to pass control to the next middleware or route handler. If an
 * error occurs in the current middleware function and
 */
import { Request, Response, NextFunction } from "express";

interface ErrorWithStatus extends Error {
  status?: number;
}

export const globalResponse = (
  err: ErrorWithStatus,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal server error",
  });
};
