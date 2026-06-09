import type { Response } from "express";
import { StatusCodes } from "http-status-codes";




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

// reusable error handler — same pattern everywhere
const handleError = (res: Response, err: unknown): void => {
  const error = err as { statusCode?: number; message?: string };
  if (error.statusCode) {
    sendError(res, error.statusCode, error.message ?? 'Something went wrong');
  } else {
    sendError(res, StatusCodes.INTERNAL_SERVER_ERROR, 'Internal server error', err);
  }
};


export { sendError, sendSuccess,handleError };
