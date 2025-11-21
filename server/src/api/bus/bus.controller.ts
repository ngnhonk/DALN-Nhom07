import type { Request, RequestHandler, Response } from "express";
import { busService } from "./bus.service";

class BusController {
  public getAllBuses: RequestHandler = async (_req: Request, res: Response) => {
    const serviceResponse = await busService.getAllBuses();
    res.status(serviceResponse.statusCode).send(serviceResponse);
  };

  public getBusById: RequestHandler = async (req: Request, res: Response) => {
    const { id } = req.params;
    const serviceResponse = await busService.getBusById(id);
    res.status(serviceResponse.statusCode).send(serviceResponse);
  };

  public createBus: RequestHandler = async (req: Request, res: Response) => {
    const { operator_id, plate_number, bus_type, seat_count } = req.body;
    const serviceResponse = await busService.createBus(operator_id, plate_number, bus_type, seat_count);
    res.status(serviceResponse.statusCode).send(serviceResponse);
  };

  public updateBus: RequestHandler = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { operator_id, plate_number, bus_type, seat_count } = req.body;
    const serviceResponse = await busService.updateBus(id, operator_id, plate_number, bus_type, seat_count);
    res.status(serviceResponse.statusCode).send(serviceResponse);
  };

  public deleteBus: RequestHandler = async (req: Request, res: Response) => {
    const { id } = req.params;
    const serviceResponse = await busService.deleteBus(id);
    res.status(serviceResponse.statusCode).send(serviceResponse);
  };
}

export const busController = new BusController();