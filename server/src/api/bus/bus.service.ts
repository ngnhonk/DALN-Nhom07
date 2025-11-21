import { StatusCodes } from "http-status-codes";
import { BusRepository } from "./bus.repository";
import { BusOperatorRepository } from "@/api/bus_operator/bus_operator.repository";
import { ServiceResponse } from "@/common/models/serviceResponse";
import { logger } from "@/server";
import { nanoid } from "nanoid";

export class BusService {
  private busRepository: BusRepository;
  private busOperatorRepository: BusOperatorRepository;

  constructor(
    busRepository: BusRepository = new BusRepository(),
    busOperatorRepository: BusOperatorRepository = new BusOperatorRepository()
  ) {
    this.busRepository = busRepository;
    this.busOperatorRepository = busOperatorRepository;
  }

  async getAllBuses(): Promise<ServiceResponse<any>> {
    try {
      const buses = await this.busRepository.getAllBuses();
      return ServiceResponse.success("Buses retrieved successfully", buses);
    } catch (error) {
      const errorMessage = `Error retrieving buses: ${(error as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "Internal Server Error",
        errorMessage,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  async getBusById(id: string): Promise<ServiceResponse<any>> {
    try {
      const bus = await this.busRepository.getBusById(id);
      if (!bus) {
        return ServiceResponse.failure("Bus not found", null, StatusCodes.NOT_FOUND);
      }
      return ServiceResponse.success("Bus retrieved successfully", bus);
    } catch (error) {
      const errorMessage = `Error retrieving bus: ${(error as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "Internal Server Error",
        errorMessage,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  async createBus(
    operator_id: string,
    plate_number: string,
    bus_type: string,
    seat_count: number
  ): Promise<ServiceResponse<any>> {
    try {
      // 1. Check nhà xe có tồn tại không
      const operatorExists = await this.busOperatorRepository.getBusOperatorById(operator_id);
      if (!operatorExists) {
        return ServiceResponse.failure("Operator ID does not exist", null, StatusCodes.BAD_REQUEST);
      }

      // 2. Check biển số xe có trùng không
      const existingBus = await this.busRepository.getBusByPlateNumber(plate_number);
      if (existingBus) {
        return ServiceResponse.failure("Bus plate number already exists", null, StatusCodes.CONFLICT);
      }

      const id = nanoid(10);
      await this.busRepository.createBus(id, operator_id, plate_number, bus_type, seat_count);

      return ServiceResponse.success("Bus created successfully", { id }, StatusCodes.CREATED);
    } catch (error) {
      const errorMessage = `Error creating bus: ${(error as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "Internal Server Error",
        errorMessage,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  async updateBus(
    id: string,
    operator_id?: string,
    plate_number?: string,
    bus_type?: string,
    seat_count?: number
  ): Promise<ServiceResponse<any>> {
    try {
      const bus = await this.busRepository.getBusById(id);
      if (!bus) {
        return ServiceResponse.failure("Bus not found", null, StatusCodes.NOT_FOUND);
      }

      // Nếu cập nhật operator_id, check tồn tại
      if (operator_id) {
        const operatorExists = await this.busOperatorRepository.getBusOperatorById(operator_id);
        if (!operatorExists) {
            return ServiceResponse.failure("Operator ID does not exist", null, StatusCodes.BAD_REQUEST);
        }
      }

      // Nếu cập nhật biển số, check trùng với xe KHÁC
      if (plate_number && plate_number !== bus.plate_number) {
        const existingBus = await this.busRepository.getBusByPlateNumber(plate_number);
        if (existingBus) {
          return ServiceResponse.failure("Bus plate number already exists", null, StatusCodes.CONFLICT);
        }
      }

      await this.busRepository.updateBus(id, operator_id, plate_number, bus_type, seat_count);
      return ServiceResponse.success("Bus updated successfully", { id });
    } catch (error) {
      const errorMessage = `Error updating bus: ${(error as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "Internal Server Error",
        errorMessage,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  async deleteBus(id: string): Promise<ServiceResponse<any>> {
    try {
      const bus = await this.busRepository.getBusById(id);
      if (!bus) {
        return ServiceResponse.failure("Bus not found", null, StatusCodes.NOT_FOUND);
      }

      // TODO: Check ràng buộc với bảng Trips/Seats trước khi xóa
      
      await this.busRepository.deleteBus(id);
      return ServiceResponse.success("Bus deleted successfully", null);
    } catch (error) {
      const errorMessage = `Error deleting bus: ${(error as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "Internal Server Error",
        errorMessage,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }
}

export const busService = new BusService();