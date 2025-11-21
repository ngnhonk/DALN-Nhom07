import { z } from "zod";
import { commonValidations } from "@/common/utils/commonValidation";

export const LoginSchema = z.object({
  body: z.object({
    email: commonValidations.email,
    password: commonValidations.password,
  }),
});

export const RegisterSchema = z.object({
  body: z.object({
    name: commonValidations.name,
    email: commonValidations.email,
    phone: commonValidations.phone,
    password: commonValidations.password,
  }),
});

export const RegisterResponseSchema = z.object({
  id: z.number(),
});

export const LoginResponseSchema = z.object({ token: z.string() });
