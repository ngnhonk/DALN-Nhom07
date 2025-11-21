import type { Bus } from "@/api/bus/bus.model";
import db from "@/configs/knex";

export class BusRepository {
  async getAllBuses(): Promise<Bus[]> {
    return await db("buses").select("*");
  }

  async getBusById(id: string): Promise<Bus | null> {
    return await db("buses").where({ id }).first();
  }

  // Tìm xe theo biển số để check trùng
  async getBusByPlateNumber(plate_number: string): Promise<Bus | null> {
    return await db("buses").where({ plate_number }).first();
  }

  async createBus(
    id: string,
    operator_id: string,
    plate_number: string,
    bus_type: string,
    seat_count: number
  ): Promise<void> {
    await db("buses").insert({
      id,
      operator_id,
      plate_number,
      bus_type,
      seat_count,
    });
  }

  async updateBus(
    id: string,
    operator_id?: string,
    plate_number?: string,
    bus_type?: string,
    seat_count?: number
  ): Promise<void> {
    const updateData: any = {};
    if (operator_id !== undefined) updateData.operator_id = operator_id;
    if (plate_number !== undefined) updateData.plate_number = plate_number;
    if (bus_type !== undefined) updateData.bus_type = bus_type;
    if (seat_count !== undefined) updateData.seat_count = seat_count;

    await db("buses").where({ id }).update(updateData);
  }

  async deleteBus(id: string): Promise<void> {
    await db("buses").where({ id }).del();
  }
}