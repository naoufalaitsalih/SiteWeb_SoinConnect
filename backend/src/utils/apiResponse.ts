import { Response } from "express";

export function sendSuccess<T>(
  res: Response,
  options: { message?: string; data?: T; status?: number } = {}
) {
  const { message = "OK", data, status = 200 } = options;
  return res.status(status).json({
    success: true,
    message,
    ...(data !== undefined ? { data } : {}),
  });
}

export function sendError(
  res: Response,
  options: { message: string; status?: number; data?: unknown }
) {
  const { message, status = 400, data } = options;
  return res.status(status).json({
    success: false,
    message,
    ...(data !== undefined ? { data } : {}),
  });
}
