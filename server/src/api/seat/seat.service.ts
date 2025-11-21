import { StatusCodes } from "http-status-codes";
import { SeatRepository } from "./seat.repository";
import { BusRepository } from "@/api/bus/bus.repository"; 
import { ServiceResponse } from "@/common/models/serviceResponse";
import { logger } from "@/server";
import { nanoid } from "nanoid";

export class SeatService {
  private seatRepository: SeatRepository;
  private busRepository: BusRepository;

  constructor() {
    this.seatRepository = new SeatRepository();
    this.busRepository = new BusRepository();
  }

  // Lấy danh sách ghế
  async getSeatsByBusId(busId: string): Promise<ServiceResponse<any>> {
    try {
      const seats = await this.seatRepository.getSeatsByBusId(busId);
      return ServiceResponse.success("Seats retrieved successfully", seats);
    } catch (error) {
      const errorMessage = `Error getting seats: ${(error as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure("Internal Server Error", errorMessage, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  // TỰ ĐỘNG SINH GHẾ: (Tổng - 2)
  async createAutoSeats(busId: string, totalSeats: number): Promise<ServiceResponse<any>> {
    try {
      // 1. Validate Bus exists
      const bus = await this.busRepository.getBusById(busId);
      if (!bus) {
        return ServiceResponse.failure("Bus not found", null, StatusCodes.NOT_FOUND);
      }

      // 2. Tính toán số ghế khách
      const passengerSeatsCount = totalSeats - 2;
      
      if (passengerSeatsCount <= 0) {
        return ServiceResponse.failure(
            "Invalid seat count. Total seats must be greater than 2 (Driver & Assistant).", 
            null, 
            StatusCodes.BAD_REQUEST
        );
      }

      // 3. Sinh danh sách tên ghế: "01", "02", ... "10"
      const generatedSeatNumbers: string[] = [];
      for (let i = 1; i <= passengerSeatsCount; i++) {
        // .padStart(2, '0') giúp số 1 thành "01", 9 thành "09", 10 giữ nguyên "10"
        generatedSeatNumbers.push(i.toString().padStart(2, '0'));
      }

      // 4. Lọc bỏ ghế đã tồn tại (tránh lỗi Duplicate Entry)
      const existingNumbers = await this.seatRepository.getExistingSeatNumbers(busId, generatedSeatNumbers);
      const newSeatNumbers = generatedSeatNumbers.filter(num => !existingNumbers.includes(num));

      if (newSeatNumbers.length === 0) {
        return ServiceResponse.failure("All calculated seats already exist for this bus", null, StatusCodes.CONFLICT);
      }

      // 5. Chuẩn bị data insert
      const seatsData = newSeatNumbers.map(num => ({
        id: nanoid(10),
        bus_id: busId,
        seat_number: num
      }));

      // 6. Lưu vào DB
      await this.seatRepository.createBulkSeats(seatsData);

      return ServiceResponse.success(
        `Generated ${seatsData.length} seats (01 to ${passengerSeatsCount.toString().padStart(2,'0')}). Excluded 2 staff seats.`,
        { count: seatsData.length },
        StatusCodes.CREATED
      );

    } catch (error) {
      const errorMessage = `Error generating seats: ${(error as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure("Internal Server Error", errorMessage, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  // Reset ghế (Xóa hết làm lại)
  async resetBusSeats(busId: string): Promise<ServiceResponse<any>> {
    try {
       const bus = await this.busRepository.getBusById(busId);
       if (!bus) return ServiceResponse.failure("Bus not found", null, StatusCodes.NOT_FOUND);

       await this.seatRepository.deleteAllSeatsByBusId(busId);
       return ServiceResponse.success("All seats for this bus have been deleted", null);
    } catch (error) {
      const errorMessage = `Error resetting seats: ${(error as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure("Internal Server Error", errorMessage, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }
}

export const seatService = new SeatService();