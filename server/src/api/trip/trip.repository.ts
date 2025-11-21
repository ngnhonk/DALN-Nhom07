import type { Trip } from "@/api/trip/trip.model";
import db from "@/configs/knex";

export class TripRepository {
  
  // Admin: Lấy list chuyến
  async getTrips(): Promise<Trip[]> {
    return await db("trips")
      .join("routes", "trips.route_id", "routes.id")
      .join("buses", "trips.bus_id", "buses.id")
      .select(
        "trips.*",
        "routes.name as route_name",
        "buses.plate_number as bus_plate",
        "buses.bus_type",
        "buses.seat_count as total_seats"
      )
      .orderBy("trips.departure_date", "desc");
  }

  async getAllTrips(): Promise<Trip[]> {
     return await db("trips").select("*");
  }

  // User: Search (Logic Nâng Cao: A -> X -> Y -> B)
  async searchTrips(fromStationId: string, toStationId: string, date: string): Promise<Trip[]> {
    const trips = await db.with('all_stops', (qb) => {
        qb.select('route_id', 'station_id', 'stop_order', 'arrival_time', 'departure_time')
          .from('route_stops')
          .union(function() {
            this.select('id as route_id', 'start_station_id as station_id', db.raw('-1 as stop_order'), db.raw('NULL'), db.raw('NULL')).from('routes')
          })
          .union(function() {
            this.select('id as route_id', 'end_station_id as station_id', db.raw('9999 as stop_order'), db.raw('NULL'), db.raw('NULL')).from('routes')
          })
      })
      .select(
        "trips.*",
        "routes.name as route_name",
        "buses.plate_number as bus_plate",
        "buses.bus_type",
        "buses.seat_count as total_seats",
        "pickup.departure_time as pickup_time", 
        "dropoff.arrival_time as dropoff_time",
        // UPDATE: Đếm số Booking thay vì đếm Booking_Seats
        db.raw(`(
            buses.seat_count - (
                SELECT COUNT(b.id) 
                FROM bookings b 
                WHERE b.trip_id = trips.id 
                AND b.status IN ('paid', 'pending')
            )
        ) as available_seats`)
      )
      .from("trips")
      .join("routes", "trips.route_id", "routes.id")
      .join("buses", "trips.bus_id", "buses.id")
      .join("all_stops as pickup", "routes.id", "pickup.route_id")
      .join("all_stops as dropoff", "routes.id", "dropoff.route_id")
      .where("pickup.station_id", fromStationId)
      .andWhere("dropoff.station_id", toStationId)
      .andWhereRaw("pickup.stop_order < dropoff.stop_order") 
      .andWhere("trips.departure_date", date)
      .andWhere("trips.status", "scheduled");

    return trips;
  }

  // Xóa hàm getTripSeatStatus

  async getTripById(id: string): Promise<Trip | null> {
    return await db("trips")
      .join("routes", "trips.route_id", "routes.id")
      .join("buses", "trips.bus_id", "buses.id")
      .where("trips.id", id)
      .select(
        "trips.*",
        "routes.name as route_name",
        "buses.plate_number as bus_plate",
        "buses.seat_count as total_seats"
      )
      .first();
  }

  async createTrip(id: string, route_id: string, bus_id: string, departure_date: string, departure_time: string, price: number): Promise<void> {
    await db("trips").insert({
      id, route_id, bus_id, departure_date, departure_time, price, status: 'scheduled'
    });
  }

async searchTripsByCoordinates(
    fromLat: number, fromLng: number, 
    toLat: number, toLng: number, 
    date?: string
  ): Promise<any[]> {
    
    // Công thức Haversine (như cũ)
    const haversine = (latCol: string, lngCol: string, latVal: number, lngVal: number) => {
      return `(6371 * acos(cos(radians(${latVal})) * cos(radians(${latCol})) * cos(radians(${lngCol}) - radians(${lngVal})) + sin(radians(${latVal})) * sin(radians(${latCol}))))`;
    };

    const query = db("trips")
      .join("routes", "trips.route_id", "routes.id")
      .join("buses", "trips.bus_id", "buses.id")
      .join("bus_operators", "routes.operator_id", "bus_operators.id")
      
      // Join Điểm Đón
      .join("route_stops as pickup_stop", "routes.id", "pickup_stop.route_id")
      .join("bus_stations as pickup_st", "pickup_stop.station_id", "pickup_st.id")
      
      // Join Điểm Trả
      .join("route_stops as dropoff_stop", "routes.id", "dropoff_stop.route_id")
      .join("bus_stations as dropoff_st", "dropoff_stop.station_id", "dropoff_st.id")

      .select(
        "trips.*",
        "routes.name as route_name",
        "bus_operators.name as operator_name",
        "buses.plate_number",
        "buses.bus_type",
        "pickup_st.name as pickup_station_name",
        "pickup_st.latitude as pickup_lat",
        "pickup_st.longitude as pickup_lng",
        "dropoff_st.name as dropoff_station_name",
        "dropoff_st.latitude as dropoff_lat",
        "dropoff_st.longitude as dropoff_lng",
        // Tính khoảng cách
        db.raw(`${haversine('pickup_st.latitude', 'pickup_st.longitude', fromLat, fromLng)} as dist_to_pickup`),
        db.raw(`${haversine('dropoff_st.latitude', 'dropoff_st.longitude', toLat, toLng)} as dist_from_dropoff`)
      )
      
      // Điều kiện cơ bản
      .where("trips.status", "scheduled")
      .andWhereRaw("pickup_stop.stop_order < dropoff_stop.stop_order"); // Chiều đi đúng

      // [BỎ] Không còn điều kiện check bán kính (radius) ở đây nữa

    // Lọc theo ngày (nếu có)
    if (date) {
        query.andWhere("trips.departure_date", date);
    } else {
        query.andWhere("trips.departure_date", ">=", new Date());
    }

    // Sắp xếp: Quan trọng nhất
    // Cộng tổng khoảng cách (User->Trạm Đón) + (Trạm Trả->User)
    // Số càng nhỏ -> Càng tiện lợi cho khách -> Xếp lên đầu
    query.orderByRaw("(dist_to_pickup + dist_from_dropoff) ASC");

    // Giới hạn kết quả để tối ưu hiệu năng (Chỉ lấy 50 chuyến phù hợp nhất)
    query.limit(50);

    return await query;
  }
}