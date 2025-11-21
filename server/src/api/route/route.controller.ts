import type { Request, RequestHandler, Response } from "express";
import { routeService } from "./route.service";

class RouteController {
  public getAllRoutes: RequestHandler = async (_req: Request, res: Response) => {
    const serviceResponse = await routeService.getAllRoutes();
    res.status(serviceResponse.statusCode).send(serviceResponse);
  };

  public getRouteById: RequestHandler = async (req: Request, res: Response) => {
    const { id } = req.params;
    const serviceResponse = await routeService.getRouteById(id);
    res.status(serviceResponse.statusCode).send(serviceResponse);
  };

  public createRoute: RequestHandler = async (req: Request, res: Response) => {
    const { operator_id, start_station_id, end_station_id, name, distance_km, estimated_hours, active } = req.body;
    const serviceResponse = await routeService.createRoute(
      operator_id,
      start_station_id,
      end_station_id,
      name,
      distance_km,
      estimated_hours,
      active
    );
    res.status(serviceResponse.statusCode).send(serviceResponse);
  };

  public updateRoute: RequestHandler = async (req: Request, res: Response) => {
    const { id } = req.params;
    const serviceResponse = await routeService.updateRoute(id, req.body);
    res.status(serviceResponse.statusCode).send(serviceResponse);
  };

  public deleteRoute: RequestHandler = async (req: Request, res: Response) => {
    const { id } = req.params;
    const serviceResponse = await routeService.deleteRoute(id);
    res.status(serviceResponse.statusCode).send(serviceResponse);
  };
}

export const routeController = new RouteController();