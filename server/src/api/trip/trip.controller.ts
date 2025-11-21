import type { Request, RequestHandler, Response } from "express";
import { tripService } from "./trip.service";

class TripController {
  public getAllOrSearch: RequestHandler = async (req: Request, res: Response) => {
    const query = req.query;
    const serviceResponse = await tripService.getTrips(query);
    res.status(serviceResponse.statusCode).send(serviceResponse);
  };

  public getAllTrips: RequestHandler = async (req: Request, res: Response) => {
    const serviceResponse = await tripService.getAllTrips();
    res.status(serviceResponse.statusCode).send(serviceResponse);
  };

  // Đã xóa hàm getTripSeatStatus handler

  public getTripById: RequestHandler = async (req: Request, res: Response) => {
    const { id } = req.params;
    const serviceResponse = await tripService.getTripById(id);
    res.status(serviceResponse.statusCode).send(serviceResponse);
  };

  public searchTrips: RequestHandler = async (req: Request, res: Response) => {
    // req.query sẽ chứa: from_lat, from_lng, to_lat, to_lng, date (optional)
    // Zod middleware đã validate và transform string -> number cho các toạ độ rồi.
    const query = req.query;
    const serviceResponse = await tripService.searchTripsAdvanced(query);
    res.status(serviceResponse.statusCode).send(serviceResponse);
  };

  public createTrip: RequestHandler = async (req: Request, res: Response) => {
    const { route_id, bus_id, departure_date, departure_time, price } = req.body;
    const serviceResponse = await tripService.createTrip(route_id, bus_id, departure_date, departure_time, price);
    res.status(serviceResponse.statusCode).send(serviceResponse);
  };
}

export const tripController = new TripController();