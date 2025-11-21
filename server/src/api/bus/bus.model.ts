import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";
import { commonValidations } from "@/common/utils/commonValidation";

extendZodWithOpenApi(z);

export type Bus = z.infer<typeof BusSchema>;

// Schema chuẩn khớp với DB
export const BusSchema = z.object({
  id: z.string(),
  operator_id: z.string(),
  plate_number: z.string(),
  bus_type: commonValidations.BusTypeEnum,
  seat_count: z.number().int().positive(),
});

// Validate Params ID
export const GetBusSchema = z.object({
  params: z.object({ id: commonValidations.id }),
});

// Validate Create Body
export const CreateBusSchema = z.object({
  body: z.object({
    operator_id: commonValidations.id,
    plate_number: commonValidations.plate_number,
    bus_type: commonValidations.BusTypeEnum,
    seat_count: commonValidations.positive_number
  }),
});

// Validate Update (Body + Params)
export const UpdateBusSchema = z.object({
  params: z.object({
    id: commonValidations.id,
  }),
  body: z.object({
    operator_id: commonValidations.id.optional(),
    plate_number: commonValidations.plate_number.optional(),
    bus_type: commonValidations.BusTypeEnum.optional(),
    seat_count: commonValidations.positive_number.optional(),
  }),
});

// Response Schemas
export const CreateBusResponseSchema = z.object({
  id: z.string(),
});

export const UpdateBusResponseSchema = z.object({
  id: z.string(),
});

export const GetBusResponseSchema = BusSchema;
export const GetAllBusesResponseSchema = z.array(BusSchema);