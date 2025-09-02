import { Request, Response, NextFunction } from "express";

const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  // Use the status code from the error if it exists, otherwise default to 500
  const statusCode = res.statusCode ? res.statusCode : 500;

  res.status(statusCode);

  res.json({
    success: false,
    message: err.message,
    // Provide stack trace only in development environment for debugging
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};

export { errorHandler };