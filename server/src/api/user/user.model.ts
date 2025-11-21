import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";
import { commonValidations } from "@/common/utils/commonValidation";

extendZodWithOpenApi(z);

export type User = z.infer<typeof UserSchema>;
export const UserSchema = z.object({
	id: z.string(),
	name: z.string(),
	email: z.string().email(),
	phone: z.string(),
	hash_password: z.string(),
	role: z.string(),
	created_at: z.date(),
	updated_at: z.date()
});

export const GetUserSchema = z.object({
	params: z.object({ id: commonValidations.id }),
});

export const GetUserResponseSchema = z.object({
	name: z.string(),
	email: z.string().email(),
	phone: z.string(),
});

export const UpdateUserSchema = z.object({
	body: z.object({ 
		name: commonValidations.name.optional(),
		phone: commonValidations.phone.optional(),
		email: commonValidations.email.optional(),
	 }),
});

export const UpdateUserResponseSchema = z.object({
	id: z.number(),
});


export const ChangePasswordSchema = z.object({
	body: z.object({
		password: commonValidations.password,
		new_password: commonValidations.password,
	}),
});

export const ChangePasswordResponseSchema = z.object({
	id: z.number(),
});
