import db from "@/configs/knex";
import { nanoid } from "nanoid";

export class PaymentRepository {
  
  async createPayment(booking_id: string, amount: number, method: string): Promise<string> {
    const id = nanoid(10);
    await db("payments").insert({
      id,
      booking_id,
      amount,
      method,
      status: 'pending'
    });
    return id;
  }

  // TRANSACTION: Cập nhật Payment -> Cập nhật Booking
  async completePaymentTransaction(paymentId: string): Promise<void> {
    await db.transaction(async (trx) => {
      // 1. Update Payment status
      await trx("payments")
        .where({ id: paymentId })
        .update({ 
          status: 'success', 
          paid_at: new Date() 
        });

      // 2. Get Booking info
      const payment = await trx("payments").where({ id: paymentId }).first();
      
      if (payment) {
        // 3. Update Booking status
        await trx("bookings")
          .where({ id: payment.booking_id })
          .update({ status: 'paid' });
      }
    });
  }
  
  async updateStatusOnly(paymentId: string, status: string): Promise<void> {
    await db("payments").where({ id: paymentId }).update({ status });
  }
}