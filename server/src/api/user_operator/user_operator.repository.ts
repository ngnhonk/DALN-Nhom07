import type { BusStation } from "@/api/bus_station/bus_station.model";
import db from "@/configs/knex";

export class UserOperatorRepository {

	async getOperatorByUserId(id: string): Promise<BusStation[]> {
		const result = await db("user_operators")
        .join("users as u ", "user_operators.user_id", "u.id")
        .join("bus_operators as o", "user_operators.operator_id", "o.id")
        .select("*");
		return result;
	}
   
}
