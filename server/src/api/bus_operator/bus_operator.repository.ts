import type { BusOperator } from "@/api/bus_operator/bus_operator.model";
import db from "@/configs/knex";

export class BusOperatorRepository {
  async getAllBusOperators(): Promise<BusOperator[]> {
    return await db("bus_operators").select("*");
  }

  async getBusOperatorById(id: string): Promise<BusOperator | null> {
    return await db("bus_operators").where({ id }).first();
  }

  // Tìm theo tên để check trùng (tùy chọn)
  async getBusOperatorByName(name: string): Promise<BusOperator | null> {
    return await db("bus_operators").where({ name }).first();
  }

  async createBusOperator(
    id: string,
    name: string,
    hotline?: string,
    description?: string
  ): Promise<void> {
    await db("bus_operators").insert({
      id,
      name,
      hotline: hotline || null,
      description: description || null,
    });
  }

  async updateBusOperator(
    id: string,
    name?: string,
    hotline?: string,
    description?: string
  ): Promise<void> {
    // Chỉ update các trường được truyền vào (logic build query dynamic của Knex hỗ trợ object này)
    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (hotline !== undefined) updateData.hotline = hotline;
    if (description !== undefined) updateData.description = description;

    await db("bus_operators").where({ id }).update(updateData);
  }

  async deleteBusOperator(id: string): Promise<void> {
    await db("bus_operators").where({ id }).del();
  }
}