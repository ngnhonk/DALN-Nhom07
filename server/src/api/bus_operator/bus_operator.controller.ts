import type { Request, RequestHandler, Response } from "express";
import { busOperatorService } from "./bus_operator.service";

class BusOperatorController {
  public getAllBusOperators: RequestHandler = async (_req: Request, res: Response) => {
    const serviceResponse = await busOperatorService.getAllBusOperators();
    res.status(serviceResponse.statusCode).send(serviceResponse);
  };

  public getBusOperatorById: RequestHandler = async (req: Request, res: Response) => {
    const { id } = req.params;
    const serviceResponse = await busOperatorService.getBusOperatorById(id);
    res.status(serviceResponse.statusCode).send(serviceResponse);
  };

  public createBusOperator: RequestHandler = async (req: Request, res: Response) => {
    const { name, hotline, description } = req.body;
    const serviceResponse = await busOperatorService.createBusOperator(name, hotline, description);
    res.status(serviceResponse.statusCode).send(serviceResponse);
  };

  public updateBusOperator: RequestHandler = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, hotline, description } = req.body;
    const serviceResponse = await busOperatorService.updateBusOperator(id, name, hotline, description);
    res.status(serviceResponse.statusCode).send(serviceResponse);
  };

  public deleteBusOperator: RequestHandler = async (req: Request, res: Response) => {
    const { id } = req.params;
    const serviceResponse = await busOperatorService.deleteBusOperator(id);
    res.status(serviceResponse.statusCode).send(serviceResponse);
  };
}

export const busOperatorController = new BusOperatorController();