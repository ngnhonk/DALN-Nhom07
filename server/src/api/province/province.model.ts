import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";
import { commonValidations } from "@/common/utils/commonValidation";

extendZodWithOpenApi(z);

export type Province = z.infer<typeof ProvinceSchema>;

// Schema chuẩn cho DB
export const ProvinceSchema = z.object({
  id: z.string(),
  name: z.string(),
  code: z.string(), // Mã tỉnh (VD: HN, SG, 01, 79)
});

// Validate params ID
export const GetProvinceSchema = z.object({
  params: z.object({ id: commonValidations.id }),
});

// Validate Create Body
export const CreateProvinceSchema = z.object({
  body: z.object({
    name: z.string().min(1, "Name is required"),
    code: z.string().min(1, "Code is required"),
  }),
});

// Validate Update (Body + Params)
export const UpdateProvinceSchema = z.object({
  params: z.object({
    id: commonValidations.id,
  }),
  body: z.object({
    name: z.string().min(1).optional(),
    code: z.string().min(1).optional(),
  }),
});

// Response Schemas
export const CreateProvinceResponseSchema = z.object({
  id: z.string(),
});

export const UpdateProvinceResponseSchema = z.object({
  id: z.string(),
});

export const GetProvinceResponseSchema = ProvinceSchema;
export const GetAllProvincesResponseSchema = z.array(ProvinceSchema);