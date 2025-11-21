import type { User } from "@/api/user/user.model";
import db from "@/configs/knex";

export class UserRepository {
	async getAllUsers(): Promise<User[]> {
		const result = await db("users").select("*");
		return result;
	}

	async getUserById(id: string): Promise<User> {
		const result = await db("users").select("users.name", "users.email", "users.phone").where({ id }).first();
		return result;
	}

	async getUserByEmail(email: string): Promise<User | null> {
		const result = await db("users").select("*").where({ email }).first();
		return result;
	}

	async getUserByPhone(phone: string): Promise<User | null> {
		const result = await db("users").select("*").where({ phone }).first();
		return result;
	}
	
	async updateInformation(id: string, name: string, email: string, phone: string): Promise<number> {
		const result = await db("users").update({ name, email, phone }).where({ id });
		return result;
	}

	async changePassword(email: string, hash_password: string): Promise<number> {
		const result = await db("users").update({ hash_password }).where({ email });
		return result;
	}

	async changeEmail(id: string, email: string): Promise<number> {
		const result = await db('users').update({ email }).where({ id });
		return result;
	}
}
