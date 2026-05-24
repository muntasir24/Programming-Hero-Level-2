import type { Response } from "express";

type SuccessResponse<T> = {
  success: true;
  message: string;
  data: T;
};

type ErrorResponse = {
  success: false;
  message: string;
  errors?: unknown;
};

const sendSuccess = <T>(
  res: Response,
  statusCode: number,
  message: string,
  data: T,
) => {
  const payload: SuccessResponse<T> = {
    success: true,
    message,
    data,
  };

  return res.status(statusCode).json(payload);
};

const sendError = (
  res: Response,
  statusCode: number,
  message: string,
  errors?: unknown,
) => {
  const payload: ErrorResponse = {
    success: false,
    message,
    errors,
  };

  return res.status(statusCode).json(payload);
};

export { sendError, sendSuccess };
