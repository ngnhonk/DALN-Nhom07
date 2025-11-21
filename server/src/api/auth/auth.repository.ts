import db from "@/configs/knex";
import type { User } from "../user/user.model";
import { z } from "zod";

export class AuthRepository {

    async login(id: string): Promise<string | null> {
        const [result] = await db("users")
            .select("email", "hash_password")
            .where({ id });
        return result;
    }
    
    async register(
        id: string,
        email: string,
        hash_password: string,
        phone: string,
        name: string
    ): Promise<string> {
        const result = await db("users").insert({
            id,
            email,
            hash_password,
            phone,
            name,
        });
        return id;
    }

}
