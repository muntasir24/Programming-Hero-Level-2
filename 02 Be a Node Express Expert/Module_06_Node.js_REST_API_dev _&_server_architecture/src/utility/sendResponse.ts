import type { ServerResponse } from "node:http";

export const sendResponse = (
  res: ServerResponse,
  success: boolean,
  message: string,
  statusCode: number,
  data?: any,
) => {
  const responseBody = {
    success,
    message,
    data,
  };
  res.writeHead(statusCode, { "Content-Type": "application/json" });
  res.end(JSON.stringify(responseBody));
};
