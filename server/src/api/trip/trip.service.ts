import { StatusCodes } from "http-status-codes";
import { TripRepository } from "./trip.repository";
import { RouteRepository } from "@/api/route/route.repository";
import { BusRepository } from "@/api/bus/bus.repository"; 
import { ServiceResponse } from "@/common/models/serviceResponse";
import { logger } from "@/server";
import { nanoid } from "nanoid";

export class TripService {
  private tripRepository: TripRepository;
  private routeRepository: RouteRepository;
  private busRepository: BusRepository;

  constructor() {
    this.tripRepository = new TripRepository();
    this.routeRepository = new RouteRepository();
    this.busRepository = new BusRepository();
  }

  async getTrips(query: any): Promise<ServiceResponse<any>> {
    try {
      if (query?.from_station_id && query?.to_station_id && query?.date) {
        const trips = await this.tripRepository.searchTrips(
          query.from_station_id, 
          query.to_station_id, 
          query.date
        );
        return ServiceResponse.success("Trips found", trips);
      }
      
      const trips = await this.tripRepository.getTrips();
      return ServiceResponse.success("All trips retrieved", trips);
    } catch (error) {
      const errorMessage = `Error getting trips: ${(error as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure("Internal Error", errorMessage, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  async getAllTrips(): Promise<ServiceResponse<any>> {
    try {
      const trips = await this.tripRepository.getAllTrips();
      return ServiceResponse.success("All trips retrieved", trips);
    } catch (error) {
      const errorMessage = `Error getting trips: ${(error as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure("Internal Error", errorMessage, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  // Đã Xóa hàm getTripSeatStatus

  async getTripById(id: string): Promise<ServiceResponse<any>> {
    try {
      const trip = await this.tripRepository.getTripById(id);
      if (!trip) return ServiceResponse.failure("Trip not found", null, StatusCodes.NOT_FOUND);
      return ServiceResponse.success("Trip retrieved", trip);
    } catch (error) {
      logger.error(`Error getting trip: ${(error as Error).message}`);
      return ServiceResponse.failure("Internal Error", null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  async createTrip(route_id: string, bus_id: string, departure_date: string, departure_time: string, price: number): Promise<ServiceResponse<any>> {
    try {
      const route = await this.routeRepository.getRouteById(route_id);
      if (!route) return ServiceResponse.failure("Route not found", null, StatusCodes.NOT_FOUND);

      const bus = await this.busRepository.getBusById(bus_id);
      if (!bus) return ServiceResponse.failure("Bus not found", null, StatusCodes.NOT_FOUND);

      const id = nanoid(10);
      await this.tripRepository.createTrip(id, route_id, bus_id, departure_date, departure_time, price);
      
      return ServiceResponse.success("Trip created", { id }, StatusCodes.CREATED);
    } catch (error) {
      const errorMessage = `Error creating trip: ${(error as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure("Internal Error", errorMessage, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  async searchTripsAdvanced(query: any): Promise<ServiceResponse<any>> {
    try {
      // Search theo tọa độ (Bỏ check radius)
      if (query.from_lat && query.to_lat) {
        const trips = await this.tripRepository.searchTripsByCoordinates(
          query.from_lat, query.from_lng,
          query.to_lat, query.to_lng,
          query.date // Có thể undefined
        );
        
        // Format dữ liệu trả về cho đẹp
        const formattedTrips = trips.map(t => {
            const distPickup = Number(t.dist_to_pickup);
            const distDropoff = Number(t.dist_from_dropoff);
            
            return {
                ...t,
                // Khoảng cách từ chỗ khách đứng đến bến xe đón
                dist_to_pickup: distPickup.toFixed(2) + " km",
                // Khoảng cách từ bến xe trả về đích đến của khách
                dist_from_dropoff: distDropoff.toFixed(2) + " km",
                // Tổng quãng đường khách phải tự di chuyển (trung chuyển)
                transit_distance: (distPickup + distDropoff).toFixed(2) + " km",
                // Gợi ý độ phù hợp
                relevance_score: (distPickup + distDropoff) < 10 ? 'High' : 'Medium'
            };
        });

        return ServiceResponse.success(
            `Top ${trips.length} best matched trips found`, 
            formattedTrips
        );
      } 
      
      return ServiceResponse.failure("Missing coordinates", null, StatusCodes.BAD_REQUEST);
    } catch (error) {
      return ServiceResponse.failure("Internal Error", null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }
}

export const tripService = new TripService();