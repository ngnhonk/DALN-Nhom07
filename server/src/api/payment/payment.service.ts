import { StatusCodes } from "http-status-codes";
import { PaymentRepository } from "./payment.repository";
import { BookingRepository } from "@/api/booking/booking.repository"; // Import để check booking
import { ServiceResponse } from "@/common/models/serviceResponse";
import { logger } from "@/server";

export class PaymentService {
  private paymentRepository: PaymentRepository;
  private bookingRepository: BookingRepository;

  constructor() {
    this.paymentRepository = new PaymentRepository();
    this.bookingRepository = new BookingRepository();
  }

  async createPayment(booking_id: string, amount: number, method: string): Promise<ServiceResponse<any>> {
    try {
      // 1. Check Booking Exists
      const booking = await this.bookingRepository.getBookingById(booking_id);
      if (!booking) {
        return ServiceResponse.failure("Booking not found", null, StatusCodes.NOT_FOUND);
      }
      
      // 2. Check Status
      if (booking.status === 'paid') {
        return ServiceResponse.failure("Booking is already paid", null, StatusCodes.BAD_REQUEST);
      }

      // 3. Validate Amount (Tránh user sửa tiền ở Client)
      if (Number(booking.total_price) !== amount) {
        return ServiceResponse.failure("Invalid payment amount", null, StatusCodes.BAD_REQUEST);
      }

      // 4. Create Payment Pending
      const paymentId = await this.paymentRepository.createPayment(booking_id, amount, method);
      
      return ServiceResponse.success("Payment initiated", { id: paymentId }, StatusCodes.CREATED);
    } catch (error) {
      const errorMessage = `Error initiating payment: ${(error as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure("Internal Error", errorMessage, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  async updatePaymentStatus(paymentId: string, status: string): Promise<ServiceResponse<any>> {
    try {
      if (status === 'success') {
        // Nếu thành công -> Dùng transaction để update cả booking
        await this.paymentRepository.completePaymentTransaction(paymentId);
        return ServiceResponse.success("Payment completed & Booking verified", null);
      } else {
        // Nếu thất bại -> Chỉ update payment log
        await this.paymentRepository.updateStatusOnly(paymentId, status);
        return ServiceResponse.success("Payment status updated", null);
      }
    } catch (error) {
      logger.error(`Error updating payment: ${(error as Error).message}`);
      return ServiceResponse.failure("Internal Error", null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }
}

export const paymentService = new PaymentService();