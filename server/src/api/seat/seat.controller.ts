import type { Request, RequestHandler, Response } from "express";
import { seatService } from "./seat.service";

class SeatController {
  // Lấy danh sách ghế của 1 xe
  public getSeatsByBus: RequestHandler = async (req: Request, res: Response) => {
    const { busId } = req.params;
    const serviceResponse = await seatService.getSeatsByBusId(busId);
    res.status(serviceResponse.statusCode).send(serviceResponse);
  };

  // API tạo ghế tự động
  public createAutoSeats: RequestHandler = async (req: Request, res: Response) => {
    const { bus_id, number_of_seats } = req.body;
    const serviceResponse = await seatService.createAutoSeats(bus_id, number_of_seats);
    res.status(serviceResponse.statusCode).send(serviceResponse);
  };

  // API xóa hết ghế của xe
  public resetSeats: RequestHandler = async (req: Request, res: Response) => {
    const { busId } = req.params;
    const serviceResponse = await seatService.resetBusSeats(busId);
    res.status(serviceResponse.statusCode).send(serviceResponse);
  };
}

export const seatController = new SeatController();