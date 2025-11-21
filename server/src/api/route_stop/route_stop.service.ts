import { StatusCodes } from "http-status-codes";
import { RouteStopRepository } from "./route_stop.repository";
import { RouteRepository } from "@/api/route/route.repository";
import { BusStationRepository } from "@/api/bus_station/bus_station.repository";
import { ServiceResponse } from "@/common/models/serviceResponse";
import { logger } from "@/server";
import { nanoid } from "nanoid";

export class RouteStopService {
  private routeStopRepository: RouteStopRepository;
  private routeRepository: RouteRepository;
  private busStationRepository: BusStationRepository;

  constructor() {
    this.routeStopRepository = new RouteStopRepository();
    this.routeRepository = new RouteRepository();
    this.busStationRepository = new BusStationRepository();
  }

  async getStopsByRoute(routeId: string): Promise<ServiceResponse<any>> {
    try {
      // Check route có tồn tại không
      const route = await this.routeRepository.getRouteById(routeId);
      if (!route) return ServiceResponse.failure("Route not found", null, StatusCodes.NOT_FOUND);

      const stops = await this.routeStopRepository.getStopsByRouteId(routeId);
      return ServiceResponse.success("Route stops retrieved", stops);
    } catch (error) {
      logger.error(`Error getting route stops: ${(error as Error).message}`);
      return ServiceResponse.failure("Internal Server Error", null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  async createRouteStop(
    route_id: string, 
    station_id: string, 
    stop_order: number, 
    arrival_time: string, 
    departure_time: string
  ): Promise<ServiceResponse<any>> {
    try {
      // 1. Validate Route exists
      const route = await this.routeRepository.getRouteById(route_id);
      if (!route) return ServiceResponse.failure("Route not found", null, StatusCodes.NOT_FOUND);

      // 2. Validate Station exists
      const station = await this.busStationRepository.getBusStationById(station_id);
      if (!station) return ServiceResponse.failure("Station not found", null, StatusCodes.NOT_FOUND);

      // 3. Validate Stop Order (Option: Không cho phép trùng thứ tự trong cùng 1 tuyến)
      const isDuplicateOrder = await this.routeStopRepository.checkStopOrderExists(route_id, stop_order);
      if (isDuplicateOrder) {
        return ServiceResponse.failure(`Stop order ${stop_order} already exists in this route`, null, StatusCodes.CONFLICT);
      }

      const id = nanoid(10);
      await this.routeStopRepository.createRouteStop(id, route_id, station_id, stop_order, arrival_time, departure_time);
      
      return ServiceResponse.success("Route stop added successfully", { id }, StatusCodes.CREATED);
    } catch (error) {
      logger.error(`Error creating route stop: ${(error as Error).message}`);
      return ServiceResponse.failure("Internal Server Error", null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }
  
  async deleteRouteStop(id: string): Promise<ServiceResponse<any>> {
      // Logic delete đơn giản
      try {
        await this.routeStopRepository.deleteRouteStop(id);
        return ServiceResponse.success("Route stop deleted", null);
      } catch(e) {
         return ServiceResponse.failure("Error", null, StatusCodes.INTERNAL_SERVER_ERROR);
      }
  }
}

export const routeStopService = new RouteStopService();