import { StatusCodes } from "http-status-codes";
import { RouteRepository } from "./route.repository";
import { BusOperatorRepository } from "@/api/bus_operator/bus_operator.repository"; 
import { ServiceResponse } from "@/common/models/serviceResponse";
import { logger } from "@/server";
import { nanoid } from "nanoid";

export class RouteService {
  private routeRepository: RouteRepository;
  private busOperatorRepository: BusOperatorRepository;

  constructor(
    routeRepo: RouteRepository = new RouteRepository(),
    busOperatorRepo: BusOperatorRepository = new BusOperatorRepository()
  ) {
    this.routeRepository = routeRepo;
    this.busOperatorRepository = busOperatorRepo;
  }

  async getAllRoutes(): Promise<ServiceResponse<any>> {
    try {
      const routes = await this.routeRepository.getAllRoutes();
      return ServiceResponse.success("Routes retrieved successfully", routes);
    } catch (error) {
      const errorMessage = `Error retrieving routes: ${(error as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "Internal Server Error",
        errorMessage,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  async getRouteById(id: string): Promise<ServiceResponse<any>> {
    try {
      const route = await this.routeRepository.getRouteById(id);
      if (!route) {
        return ServiceResponse.failure("Route not found", null, StatusCodes.NOT_FOUND);
      }
      return ServiceResponse.success("Route retrieved successfully", route);
    } catch (error) {
      const errorMessage = `Error retrieving route: ${(error as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "Internal Server Error",
        errorMessage,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  async createRoute(
    operator_id: string,
    start_station_id: string,
    end_station_id:string,
    name: string,
    distance_km: number,
    estimated_hours: number,
    active: boolean = true
  ): Promise<ServiceResponse<any>> {
    try {
      // 1. Check Bus Operator exists
      const operator = await this.busOperatorRepository.getBusOperatorById(operator_id);
      if (!operator) {
        return ServiceResponse.failure("Bus operator not found", null, StatusCodes.BAD_REQUEST);
      }

      // 2. Create Route
      const id = nanoid(10);
      await this.routeRepository.createRoute(id, operator_id,start_station_id, end_station_id, name, distance_km, estimated_hours, active);

      return ServiceResponse.success("Route created successfully", { id }, StatusCodes.CREATED);
    } catch (error) {
      const errorMessage = `Error creating route: ${(error as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "Internal Server Error",
        errorMessage,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  async updateRoute(id: string, data: any): Promise<ServiceResponse<any>> {
    try {
      const route = await this.routeRepository.getRouteById(id);
      if (!route) {
        return ServiceResponse.failure("Route not found", null, StatusCodes.NOT_FOUND);
      }

      // Nếu có update operator_id, cần check tồn tại
      if (data.operator_id) {
        const operator = await this.busOperatorRepository.getBusOperatorById(data.operator_id);
        if (!operator) {
            return ServiceResponse.failure("Bus operator not found", null, StatusCodes.BAD_REQUEST);
        }
      }

      await this.routeRepository.updateRoute(id, data);
      return ServiceResponse.success("Route updated successfully", { id });
    } catch (error) {
      const errorMessage = `Error updating route: ${(error as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "Internal Server Error",
        errorMessage,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  async deleteRoute(id: string): Promise<ServiceResponse<any>> {
    try {
      const route = await this.routeRepository.getRouteById(id);
      if (!route) {
        return ServiceResponse.failure("Route not found", null, StatusCodes.NOT_FOUND);
      }
      
      // Lưu ý: Cần xử lý logic nếu Route đang có RouteStops hoặc Trips (Database sẽ báo lỗi Foreign Key)
      // Tốt nhất là nên dùng try/catch để bắt lỗi DB constraint
      
      await this.routeRepository.deleteRoute(id);
      return ServiceResponse.success("Route deleted successfully", null);
    } catch (error) {
      const errorMessage = `Error deleting route: ${(error as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "Internal Server Error",
        errorMessage,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }
}

export const routeService = new RouteService();