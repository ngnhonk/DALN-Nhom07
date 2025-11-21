import { StatusCodes } from "http-status-codes";
import { BusStationRepository } from "./bus_station.repository";
import { ServiceResponse } from "@/common/models/serviceResponse";
import { logger } from "@/server";
import { nanoid } from "nanoid";

export class BusStationService {
  private busStationRepository: BusStationRepository;

  constructor(
    auth_repository: BusStationRepository = new BusStationRepository()
  ) {
    this.busStationRepository = auth_repository;
  }

  async createBusStation(
    name: string,
    address: string,
    province_id: string,
    latitude: number,
    longitude: number,
    type: string
  ): Promise<ServiceResponse<object | string | null>> {
    try {
      const busStationExists = await this.busStationRepository.getBusStationByName(
        name
      );

      if (busStationExists) {
        return ServiceResponse.failure(
          "Bus stations already exists!",
          null,
          StatusCodes.CONFLICT
        );
      }
      const id = nanoid(10);
      await this.busStationRepository.createBusStation(
        id,
        name,
        address,
        province_id,
        latitude,
        longitude,
        type
      );

      return ServiceResponse.success(
        "Bus station created successfully!",
        null,
        StatusCodes.CREATED
      );
    } catch (error) {
      const errorMessage = `Error while creating a bus station: ${
        (error as Error).message
      }`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred while creating a bus station.",
        errorMessage,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  async getAllBusStations(): Promise<ServiceResponse<object | string | null>> {
    try {
      const busStations = await this.busStationRepository.getAllBusStations();
      return ServiceResponse.success(
        "Bus stations retrieved successfully!",
        busStations,
        StatusCodes.OK
      );
    } catch (error) {
      const errorMessage = `Error while retrieving bus stations: ${
        (error as Error).message
      }`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred while retrieving bus stations.",
        errorMessage,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }
  async getBusStationById(
    id: string
  ): Promise<ServiceResponse<object | string | null>> {
    try {
      const busStations = await this.busStationRepository.getBusStationById(id);
      if (!busStations) {
        return ServiceResponse.failure(
          "Bus station not found!",
          null,
          StatusCodes.NOT_FOUND
        );
      }
      return ServiceResponse.success(
        "Bus station retrieved successfully!",
        busStations,
        StatusCodes.OK
      );
    } catch (error) {
      const errorMessage = `Error while retrieving bus stations: ${
        (error as Error).message
      }`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred while retrieving bus stations.",
        errorMessage,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  async updateBusStation(
    id: string,
    name: string,
    address: string,
    province_id: string,
    latitude: number,
    longitude: number,
    type: string
  ): Promise<ServiceResponse<object | string | null>> {
    try {
      const busStationExists = await this.busStationRepository.getBusStationById(
        id
      );

      if (!busStationExists) {
        return ServiceResponse.failure(
          "Bus station does not exist!",
          null,
          StatusCodes.NOT_FOUND
        );
      }
      await this.busStationRepository.updateBusStation(
        id,
        name,
        address,
        province_id,
        latitude,
        longitude,
        type
      );
      return ServiceResponse.success(
        "Bus station updated successfully!",
        null,
        StatusCodes.OK
      );
    } catch (error) {
      const errorMessage = `Error while updating a bus station: ${
        (error as Error).message
      }`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred while updating a bus station.",
        errorMessage,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  async deleteBusStation(
    id: string
  ): Promise<ServiceResponse<object | string | null>> {
    try {
      const busStationExists = await this.busStationRepository.getBusStationById(
        id
      );

      if (!busStationExists) {
        return ServiceResponse.failure(
          "Bus station does not exist!",
          null,
          StatusCodes.NOT_FOUND
        );
      }
      await this.busStationRepository.deleteBusStation(id);
      return ServiceResponse.success(
        "Bus station deleted successfully!",
        null,
        StatusCodes.OK
      );
    } catch (error) {
      const errorMessage = `Error while deleting a bus station: ${
        (error as Error).message
      }`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred while deleting a bus station.",
        errorMessage,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }
}

export const busStationService = new BusStationService();
