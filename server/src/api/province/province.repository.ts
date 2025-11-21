import type { Province } from "@/api/province/province.model";
import db from "@/configs/knex";

export class ProvinceRepository {
  async getAllProvinces(): Promise<Province[]> {
    return await db("provinces").select("*");
  }

  async getProvinceById(id: string): Promise<Province | null> {
    return await db("provinces").where({ id }).first();
  }

  // Tìm theo Code để check trùng lặp
  async getProvinceByCode(code: string): Promise<Province | null> {
    return await db("provinces").where({ code }).first();
  }

  async createProvince(id: string, name: string, code: string): Promise<void> {
    await db("provinces").insert({ id, name, code });
  }

  async updateProvince(id: string, name?: string, code?: string): Promise<void> {
    await db("provinces").where({ id }).update({ name, code });
  }

  async deleteProvince(id: string): Promise<void> {
    await db("provinces").where({ id }).del();
  }
}