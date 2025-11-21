import type { RouteStop } from "@/api/route_stop/route_stop.model";
import db from "@/configs/knex";

export class RouteStopRepository {
  // Lấy danh sách điểm dừng của 1 tuyến, sắp xếp theo thứ tự
  async getStopsByRouteId(routeId: string): Promise<any[]> {
    return await db("route_stops")
      .join("bus_stations", "route_stops.station_id", "bus_stations.id")
      .where("route_stops.route_id", routeId)
      .orderBy("route_stops.stop_order", "asc")
      .select(
        "route_stops.*",
        "bus_stations.name as station_name",
        "bus_stations.address"
      );
  }

  // Kiểm tra xem cặp (route_id, stop_order) đã tồn tại chưa để tránh trùng order
  async checkStopOrderExists(route_id: string, stop_order: number): Promise<boolean> {
    const result = await db("route_stops").where({ route_id, stop_order }).first();
    return !!result;
  }

  async createRouteStop(
    id: string, 
    route_id: string, 
    station_id: string, 
    stop_order: number, 
    arrival_time: string, 
    departure_time: string
  ): Promise<void> {
    await db("route_stops").insert({
      id,
      route_id,
      station_id,
      stop_order,
      arrival_time,
      departure_time,
    });
  }

  async deleteRouteStop(id: string): Promise<void> {
    await db("route_stops").where({ id }).del();
  }
}