import { StatusCodes } from "http-status-codes";
import { BusOperatorRepository } from "./bus_operator.repository";
import { ServiceResponse } from "@/common/models/serviceResponse";
import { logger } from "@/server";
import { nanoid } from "nanoid";

export class BusOperatorService {
  private busOperatorRepository: BusOperatorRepository;

  constructor(repository: BusOperatorRepository = new BusOperatorRepository()) {
    this.busOperatorRepository = repository;
  }

  async getAllBusOperators(): Promise<ServiceResponse<any>> {
    try {
      const operators = await this.busOperatorRepository.getAllBusOperators();
      return ServiceResponse.success("Bus operators retrieved successfully", operators);
    } catch (error) {
      const errorMessage = `Error retrieving bus operators: ${(error as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred while retrieving bus operators.",
        errorMessage,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  async getBusOperatorById(id: string): Promise<ServiceResponse<any>> {
    try {
      const operator = await this.busOperatorRepository.getBusOperatorById(id);
      if (!operator) {
        return ServiceResponse.failure("Bus operator not found", null, StatusCodes.NOT_FOUND);
      }
      return ServiceResponse.success("Bus operator retrieved successfully", operator);
    } catch (error) {
      const errorMessage = `Error retrieving bus operator: ${(error as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "Internal Server Error",
        errorMessage,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  async createBusOperator(
    name: string,
    hotline?: string,
    description?: string
  ): Promise<ServiceResponse<any>> {
    try {
      // Check trùng tên nhà xe
      const existingOperator = await this.busOperatorRepository.getBusOperatorByName(name);
      if (existingOperator) {
        return ServiceResponse.failure("Bus operator name already exists", null, StatusCodes.CONFLICT);
      }

      const id = nanoid(10);
      await this.busOperatorRepository.createBusOperator(id, name, hotline, description);
      
      return ServiceResponse.success("Bus operator created successfully", { id }, StatusCodes.CREATED);
    } catch (error) {
      const errorMessage = `Error creating bus operator: ${(error as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "Internal Server Error",
        errorMessage,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  async updateBusOperator(
    id: string,
    name?: string,
    hotline?: string,
    description?: string
  ): Promise<ServiceResponse<any>> {
    try {
      const operator = await this.busOperatorRepository.getBusOperatorById(id);
      if (!operator) {
        return ServiceResponse.failure("Bus operator not found", null, StatusCodes.NOT_FOUND);
      }

      // Nếu đổi tên, check xem tên mới có bị trùng không
      if (name && name !== operator.name) {
        const existingName = await this.busOperatorRepository.getBusOperatorByName(name);
        if (existingName) {
             return ServiceResponse.failure("Bus operator name already exists", null, StatusCodes.CONFLICT);
        }
      }

      await this.busOperatorRepository.updateBusOperator(id, name, hotline, description);
      return ServiceResponse.success("Bus operator updated successfully", { id });
    } catch (error) {
      const errorMessage = `Error updating bus operator: ${(error as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "Internal Server Error",
        errorMessage,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  async deleteBusOperator(id: string): Promise<ServiceResponse<any>> {
    try {
      const operator = await this.busOperatorRepository.getBusOperatorById(id);
      if (!operator) {
        return ServiceResponse.failure("Bus operator not found", null, StatusCodes.NOT_FOUND);
      }
      
      // TODO: Check ràng buộc khóa ngoại với bảng Buses hoặc Routes trước khi xóa
      
      await this.busOperatorRepository.deleteBusOperator(id);
      return ServiceResponse.success("Bus operator deleted successfully", null);
    } catch (error) {
      const errorMessage = `Error deleting bus operator: ${(error as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "Internal Server Error",
        errorMessage,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }
}

export const busOperatorService = new BusOperatorService();