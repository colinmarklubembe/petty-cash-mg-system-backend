import { Response } from "express";

class Responses {
  static successResponse(
    res: Response,
    statusCode: number,
    message: any,
    data: any = null
  ) {
    res.status(statusCode).json({
      success: true,
      message,
      data,
    });
  }

  static errorResponse(res: Response, statusCode: number, error: any) {
    res.status(statusCode).json({
      success: false,
      error,
    });
  }
}

export default Responses;
