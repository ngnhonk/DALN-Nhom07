import type { Request, RequestHandler, Response } from "express";
import { routeStopService } from "./route_stop.service";

class RouteStopController {
  public getStopsByRoute: RequestHandler = async (req: Request, res: Response) => {
    const { routeId } = req.params;
    const serviceResponse = await routeStopService.getStopsByRoute(routeId);
    res.status(serviceResponse.statusCode).send(serviceResponse);
  };

  public createRouteStop: RequestHandler = async (req: Request, res: Response) => {
    const { route_id, station_id, stop_order, arrival_time, departure_time } = req.body;
    const serviceResponse = await routeStopService.createRouteStop(
      route_id, station_id, stop_order, arrival_time, departure_time
    );
    res.status(serviceResponse.statusCode).send(serviceResponse);
  };
  
  public deleteRouteStop: RequestHandler = async (req: Request, res: Response) => {
     const { id } = req.params;
     const serviceResponse = await routeStopService.deleteRouteStop(id);
     res.status(serviceResponse.statusCode).send(serviceResponse);
  }
}

export const routeStopController = new RouteStopController();