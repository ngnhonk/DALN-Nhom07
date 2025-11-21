import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";
import { commonValidations } from "@/common/utils/commonValidation";

extendZodWithOpenApi(z);

export type Route = z.infer<typeof RouteSchema>;

// 1. Schema chuẩn khớp với Database
export const RouteSchema = z.object({
  id: z.string(),
  operator_id: z.string(),
  start_station_id: z.string(),
  end_station_id: z.string(),
  name: z.string(),
  distance_km: z.number(),
  estimated_hours: z.number(),
  active: z.boolean(),
  operator_name: z.string().optional(),
});

// 2. Validate Params (ID)
export const GetRouteSchema = z.object({
  params: z.object({ id: commonValidations.id }),
});

// 3. Validate Create Body
export const CreateRouteSchema = z.object({
  body: z.object({
    operator_id: commonValidations.id,
    start_station_id: commonValidations.id,
    end_station_id: commonValidations.id,
    name: commonValidations.name,
    distance_km: commonValidations.positive_number,
    estimated_hours: commonValidations.positive_number,
    active: z.boolean().default(true).optional(),
  }),
});

// 4. Validate Update Body
export const UpdateRouteSchema = z.object({
  params: z.object({ id: commonValidations.id }),
  body: z.object({
    operator_id: commonValidations.id.optional(),
    start_station_id: commonValidations.id.optional(),
    end_station_id: commonValidations.id.optional(),
    name: commonValidations.name.optional(),
    distance_km: commonValidations.positive_number.optional(),
    estimated_hours: commonValidations.positive_number.optional(),
    active: z.boolean().default(true).optional(),
  }),
});

// 5. Response Schemas
export const CreateRouteResponseSchema = z.object({
  id: z.string(),
});

export const UpdateRouteResponseSchema = z.object({
  id: z.string(),
});

export const GetRouteResponseSchema = RouteSchema;
export const GetAllRoutesResponseSchema = z.array(RouteSchema);