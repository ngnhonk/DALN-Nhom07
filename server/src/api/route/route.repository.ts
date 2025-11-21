import type { Route } from "@/api/route/route.model";
import db from "@/configs/knex";

export class RouteRepository {
  // Lấy tất cả routes kèm tên nhà xe
  async getAllRoutes(): Promise<Route[]> {
    return await db("routes")
      .join("bus_operators", "routes.operator_id", "bus_operators.id")
      .select(
        "routes.*",
        "bus_operators.name as operator_name"
      );
  }

  // Lấy chi tiết route theo ID
  async getRouteById(id: string): Promise<Route | null> {
    return await db("routes")
      .join("bus_operators", "routes.operator_id", "bus_operators.id")
      .where("routes.id", id)
      .select(
        "routes.*",
        "bus_operators.name as operator_name"
      )
      .first();
  }

  // Tìm route theo tên (để check trùng nếu cần)
  async getRouteByName(name: string): Promise<Route | null> {
    return await db("routes").where({ name }).first();
  }

  async createRoute(
    id: string,
    operator_id: string,
    start_station_id: string,
    end_station_id: string,
    name: string,
    distance_km: number,
    estimated_hours: number,
    active: boolean
  ): Promise<void> {
    await db("routes").insert({
      id,
      operator_id,
      start_station_id,
      end_station_id,
      name,
      distance_km,
      estimated_hours,
      active,
    });
  }

  async updateRoute(id: string, data: Partial<Route>): Promise<void> {
    // Loại bỏ các trường undefined trước khi update
    const updateData: any = {};
    if (data.operator_id !== undefined) updateData.operator_id = data.operator_id;
    if (data.start_station_id !== undefined) updateData.start_station_id = data.start_station_id;
    if (data.end_station_id !== undefined) updateData.end_station_id = data.end_station_id;
    if (data.name !== undefined) updateData.name = data.name;
    if (data.distance_km !== undefined) updateData.distance_km = data.distance_km;
    if (data.estimated_hours !== undefined) updateData.estimated_hours = data.estimated_hours;
    if (data.active !== undefined) updateData.active = data.active;

    await db("routes").where({ id }).update(updateData);
  }

  async deleteRoute(id: string): Promise<void> {
    await db("routes").where({ id }).del();
  }
}