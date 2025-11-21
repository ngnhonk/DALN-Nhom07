import type { Seat } from "@/api/seat/seat.model";
import db from "@/configs/knex";

export class SeatRepository {
  // Lấy danh sách ghế của 1 xe, sắp xếp tăng dần
  async getSeatsByBusId(busId: string): Promise<Seat[]> {
    return await db("seats")
      .where({ bus_id: busId })
      .orderBy("seat_number", "asc"); 
  }

  // Kiểm tra các số ghế đã tồn tại để tránh trùng lặp
  async getExistingSeatNumbers(busId: string, seatNumbers: string[]): Promise<string[]> {
    const results = await db("seats")
      .where({ bus_id: busId })
      .whereIn("seat_number", seatNumbers)
      .select("seat_number");
    
    return results.map(r => r.seat_number);
  }

  // Insert nhiều ghế cùng lúc (Bulk Insert)
  async createBulkSeats(seatsData: { id: string; bus_id: string; seat_number: string }[]): Promise<void> {
    await db("seats").insert(seatsData);
  }

  // Xóa toàn bộ ghế của 1 xe (Reset sơ đồ)
  async deleteAllSeatsByBusId(busId: string): Promise<void> {
    await db("seats").where({ bus_id: busId }).del();
  }
}