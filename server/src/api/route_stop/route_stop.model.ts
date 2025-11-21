import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";
import { commonValidations } from "@/common/utils/commonValidation";

extendZodWithOpenApi(z);

export type RouteStop = z.infer<typeof RouteStopSchema>;

export const RouteStopSchema = z.object({
  id: z.string(),
  route_id: z.string(),
  station_id: z.string(),
  stop_order: z.number().int(),
  arrival_time: z.string(), // Format HH:mm:ss
  departure_time: z.string(),
});

// Create: Cần truyền route_id để biết điểm dừng này thuộc tuyến nào
export const CreateRouteStopSchema = z.object({
  body: z.object({
    route_id: commonValidations.id,
    station_id: commonValidations.id,
    stop_order: z.number().int().min(1),
    arrival_time: z.string().regex(/^\d{2}:\d{2}(:\d{2})?$/, "Invalid time HH:mm:ss"),
    departure_time: z.string().regex(/^\d{2}:\d{2}(:\d{2})?$/, "Invalid time HH:mm:ss"),
  }),
});

// Get Stops by RouteId
export const GetRouteStopsByRouteSchema = z.object({
  params: z.object({ routeId: commonValidations.id }),
});

export const CreateRouteStopResponseSchema = z.object({ id: z.string() });
export const GetAllRouteStopsResponseSchema = z.array(RouteStopSchema);