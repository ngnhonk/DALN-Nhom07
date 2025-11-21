import { StatusCodes } from "http-status-codes";
import { BookingRepository } from "./booking.repository";
import { ServiceResponse } from "@/common/models/serviceResponse";
import { logger } from "@/server";
import { nanoid } from "nanoid";
import db from "@/configs/knex";

export class BookingService {
  private bookingRepository: BookingRepository;

  constructor() {
    this.bookingRepository = new BookingRepository();
  }

  async createBooking(userId: string, data: any): Promise<ServiceResponse<any>> {
    try {
      const { trip_id, pickup_station_id, dropoff_station_id } = data;

      // 1. Lấy thông tin chuyến xe để check tồn tại (không cần lấy giá nữa)
      const trip = await db("trips").where({ id: trip_id }).first();
      if (!trip) {
        return ServiceResponse.failure("Trip not found", null, StatusCodes.NOT_FOUND);
      }


      // 3. (BỎ QUA BƯỚC TÍNH TIỀN)
      
      // 4. Lưu vào DB
      const bookingId = nanoid(10);
      const newBooking = {
        id: bookingId,
        user_id: userId,
        trip_id,
        pickup_station_id,
        dropoff_station_id,
        status: 'pending', 
      };

      await this.bookingRepository.createBooking(newBooking);

      return ServiceResponse.success(
        "Booking created successfully", 
        { id: bookingId }, // Không trả về total_price
        StatusCodes.CREATED
      );

    } catch (error) {
      logger.error(`Booking Error: ${(error as Error).message}`);
      return ServiceResponse.failure("Internal Server Error", null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  async getUserHistory(userId: string): Promise<ServiceResponse<any>> {
      try {
          const history = await this.bookingRepository.getBookingsByUser(userId);
          return ServiceResponse.success("History retrieved", history);
      } catch(e) {
          return ServiceResponse.failure("Error", null, StatusCodes.INTERNAL_SERVER_ERROR);
      }
  }

  async cancelBooking(userId: string, bookingId: string): Promise<ServiceResponse<any>> {
      const booking = await this.bookingRepository.getBookingById(bookingId);
      if(!booking || booking.user_id !== userId) {
          return ServiceResponse.failure("Booking not found or access denied", null, StatusCodes.FORBIDDEN);
      }
      await this.bookingRepository.updateStatus(bookingId, 'canceled');
      return ServiceResponse.success("Booking canceled", null);
  }
}

export const bookingService = new BookingService();