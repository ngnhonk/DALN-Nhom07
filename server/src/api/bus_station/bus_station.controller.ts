import type { Request, RequestHandler, Response } from "express";

import { busStationService } from "./bus_station.service";

class BusStationController {
	public getAllBusStations: RequestHandler = async (_req: Request, res: Response) => {
		const serviceResponse = await busStationService.getAllBusStations();
		res.status(serviceResponse.statusCode).send(serviceResponse);
	};

    public getBusStationById: RequestHandler = async (req: Request, res: Response) => {
        const id = req.params.id;
        const serviceResponse = await busStationService.getBusStationById(id);
        res.status(serviceResponse.statusCode).send(serviceResponse);
    }

    public createBusStation: RequestHandler = async (req: Request, res: Response) => {
        const { name, address, province_id, latitude, longitude, type } = req.body;
        const serviceResponse = await busStationService.createBusStation(name, address, province_id, latitude, longitude, type);
        res.status(serviceResponse.statusCode).send(serviceResponse);
    }
    public updateBusStation: RequestHandler = async (req: Request, res: Response) => {
        const id = req.params.id;
        const { name, address, province_id, latitude, longitude, type } = req.body;
        const serviceResponse = await busStationService.updateBusStation(id, name, address, province_id, latitude, longitude, type);
        res.status(serviceResponse.statusCode).send(serviceResponse);
    }
    public deleteBusStation: RequestHandler = async (req: Request, res: Response) => {
        const id = req.params.id;
        const serviceResponse = await busStationService.deleteBusStation(id);
        res.status(serviceResponse.statusCode).send(serviceResponse);
    }

}

export const busStationController = new BusStationController();
