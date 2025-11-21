import type { Request, RequestHandler, Response } from "express";
import { bookingService } from "./booking.service";

class BookingController {
  
  // Tạo booking (Cần login)
  public createBooking: RequestHandler = async (req: Request, res: Response) => {
    const userId = (req as any).user?.id; 
    const serviceResponse = await bookingService.createBooking(userId, req.body);
    res.status(serviceResponse.statusCode).send(serviceResponse);
  };

  // Lấy lịch sử đặt vé (Cần login)
  public getMyBookings: RequestHandler = async (req: Request, res: Response) => {
    const userId = (req as any).user?.id;
    const serviceResponse = await bookingService.getUserHistory(userId);
    res.status(serviceResponse.statusCode).send(serviceResponse);
  };

  // Hủy vé
  public cancelBooking: RequestHandler = async (req: Request, res: Response) => {
      const userId = (req as any).user?.id;
      const { id } = req.params;
      const serviceResponse = await bookingService.cancelBooking(userId, id);
      res.status(serviceResponse.statusCode).send(serviceResponse);
  }
}

export const bookingController = new BookingController();