import db from "@/configs/knex";
import { nanoid } from "nanoid";

export class BookingRepository {
  // 1. Lấy tổng số vé đã bán của chuyến (Để Service check xem còn chỗ không)
  async getTotalBookedTickets(tripId: string): Promise<number> {
    const result = await db("bookings")
      .where("trip_id", tripId)
      .whereNot("status", "canceled");

    return Number(result[0].total) || 0;
  }

  // 2. Tạo Booking (Không còn Transaction tạo ghế nữa)
  async createBooking(bookingData: any): Promise<void> {
    // Chỉ insert vào bảng bookings
    await db("bookings").insert(bookingData);
  }

  // 3. Lấy lịch sử đặt vé của User
  async getBookingsByUser(userId: string): Promise<any[]> {
    const bookings = await db("bookings")
      .join("trips", "bookings.trip_id", "trips.id")
      // Join bảng trạm cho điểm đón (đặt alias là pickup_station)
      .join(
        "bus_stations as pickup_station",
        "bookings.pickup_station_id",
        "pickup_station.id"
      )
      // Join bảng trạm cho điểm trả (đặt alias là dropoff_station)
      .join(
        "bus_stations as dropoff_station",
        "bookings.dropoff_station_id",
        "dropoff_station.id"
      )
      .where("bookings.user_id", userId) // Chỉ định rõ bookings.user_id để tránh mơ hồ
      .orderBy("bookings.created_at", "desc")
      .select(
        "bookings.*", // Lấy tất cả thông tin của booking

        // Thông tin điểm đón
        "pickup_station.name as pickup_station_name",
        "pickup_station.address as pickup_address", // Lấy thêm địa chỉ cho chi tiết (tùy chọn)

        // Thông tin điểm trả
        "dropoff_station.name as dropoff_station_name",
        "dropoff_station.address as dropoff_address", // Lấy thêm địa chỉ cho chi tiết (tùy chọn)

        // Thông tin thời gian từ bảng trips
        "trips.departure_date",
        "trips.departure_time"
      );

    return bookings;
  }

  async getBookingById(id: string): Promise<any> {
    return await db("bookings")
      .where({ id })
      .first();
  }

  async updateStatus(id: string, status: string): Promise<void> {
    await db("bookings")
      .where({ id })
      .update({ status });
  }
}
