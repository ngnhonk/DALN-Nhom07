import { StatusCodes } from "http-status-codes";
import { ProvinceRepository } from "./province.repository";
import { ServiceResponse } from "@/common/models/serviceResponse";
import { logger } from "@/server";
import { nanoid } from "nanoid";

export class ProvinceService {
  private provinceRepository: ProvinceRepository;

  constructor(repository: ProvinceRepository = new ProvinceRepository()) {
    this.provinceRepository = repository;
  }

  async getAllProvinces(): Promise<ServiceResponse<any>> {
    try {
      const provinces = await this.provinceRepository.getAllProvinces();
      return ServiceResponse.success("Provinces retrieved successfully", provinces);
    } catch (error) {
      const errorMessage = `Error retrieving provinces: ${(error as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred while retrieving provinces.",
        errorMessage,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  async getProvinceById(id: string): Promise<ServiceResponse<any>> {
    try {
      const province = await this.provinceRepository.getProvinceById(id);
      if (!province) {
        return ServiceResponse.failure("Province not found", null, StatusCodes.NOT_FOUND);
      }
      return ServiceResponse.success("Province retrieved successfully", province);
    } catch (error) {
      const errorMessage = `Error retrieving province: ${(error as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "Internal Server Error",
        errorMessage,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  async createProvince(name: string, code: string): Promise<ServiceResponse<any>> {
    try {
      // Check trùng code
      const existingProvince = await this.provinceRepository.getProvinceByCode(code);
      if (existingProvince) {
        return ServiceResponse.failure("Province code already exists", null, StatusCodes.CONFLICT);
      }

      const id = nanoid(10);
      await this.provinceRepository.createProvince(id, name, code);
      
      return ServiceResponse.success("Province created successfully", { id }, StatusCodes.CREATED);
    } catch (error) {
      const errorMessage = `Error creating province: ${(error as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "Internal Server Error",
        errorMessage,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  async updateProvince(id: string, name?: string, code?: string): Promise<ServiceResponse<any>> {
    try {
      const province = await this.provinceRepository.getProvinceById(id);
      if (!province) {
        return ServiceResponse.failure("Province not found", null, StatusCodes.NOT_FOUND);
      }

      // Nếu update code, check xem code mới có trùng với tỉnh KHÁC không
      if (code && code !== province.code) {
        const existingCode = await this.provinceRepository.getProvinceByCode(code);
        if (existingCode) {
             return ServiceResponse.failure("Province code already exists", null, StatusCodes.CONFLICT);
        }
      }

      await this.provinceRepository.updateProvince(id, name, code);
      return ServiceResponse.success("Province updated successfully", { id });
    } catch (error) {
      const errorMessage = `Error updating province: ${(error as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "Internal Server Error",
        errorMessage,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  async deleteProvince(id: string): Promise<ServiceResponse<any>> {
    try {
      const province = await this.provinceRepository.getProvinceById(id);
      if (!province) {
        return ServiceResponse.failure("Province not found", null, StatusCodes.NOT_FOUND);
      }
      
      // TODO: Có thể check thêm ràng buộc khóa ngoại (Foreign Key)
      // Ví dụ: Nếu tỉnh này đang được dùng trong bảng bus_stations thì không được xóa.
      
      await this.provinceRepository.deleteProvince(id);
      return ServiceResponse.success("Province deleted successfully", null);
    } catch (error) {
      const errorMessage = `Error deleting province: ${(error as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "Internal Server Error",
        errorMessage,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }
}

export const provinceService = new ProvinceService();