import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";
import { commonValidations } from "@/common/utils/commonValidation";

extendZodWithOpenApi(z);

export type BusOperator = z.infer<typeof BusOperatorSchema>;

// Schema chuẩn khớp với DB
export const BusOperatorSchema = z.object({
  id: z.string(),
  name: z.string(),
  hotline: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
});

// Validate params ID
export const GetBusOperatorSchema = z.object({
  params: z.object({ id: commonValidations.id }),
});

// Validate Create Body
export const CreateBusOperatorSchema = z.object({
  body: z.object({
    name: z.string().min(1, "Operator name is required"),
    hotline: z.string().max(20).optional(), // Hotline có thể không bắt buộc
    description: z.string().optional(),
  }),
});

// Validate Update (Body + Params)
export const UpdateBusOperatorSchema = z.object({
  params: z.object({
    id: commonValidations.id,
  }),
  body: z.object({
    name: z.string().min(1).optional(),
    hotline: z.string().max(20).optional(),
    description: z.string().optional(),
  }),
});

// Response Schemas
export const CreateBusOperatorResponseSchema = z.object({
  id: z.string(),
});

export const UpdateBusOperatorResponseSchema = z.object({
  id: z.string(),
});

export const GetBusOperatorResponseSchema = BusOperatorSchema;
export const GetAllBusOperatorsResponseSchema = z.array(BusOperatorSchema);