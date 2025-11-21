import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";
import { commonValidations } from "@/common/utils/commonValidation";

extendZodWithOpenApi(z);

export type Trip = z.infer<typeof TripSchema>;

export const TripStatusEnum = z.enum(['scheduled', 'running', 'canceled', 'finished']);

export const TripSchema = z.object({
  id: z.string(),
  route_id: z.string(),
  bus_id: z.string(),
  departure_date: z.string(), 
  departure_time: z.string(),
  price: z.number(),
  status: TripStatusEnum,
  
  // Thông tin join & tính toán
  route_name: z.string().optional(),
  bus_plate: z.string().optional(),
  bus_type: z.string().optional(),
  total_seats: z.number().optional(),
  available_seats: z.number().optional(), // Vẫn giữ để biết còn bao nhiêu chỗ
  pickup_time: z.string().optional(),     
  dropoff_time: z.string().optional(),    
});

export const GetTripSchema = z.object({
  params: z.object({ id: commonValidations.id }),
});

export const CreateTripSchema = z.object({
  body: z.object({
    route_id: commonValidations.id,
    bus_id: commonValidations.id,
    departure_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Format YYYY-MM-DD"),
    departure_time: z.string().regex(/^\d{2}:\d{2}(:\d{2})?$/, "Format HH:mm:ss or HH:mm"),
    price: z.number().positive(),
  }),
});

export const SearchTripQuerySchema = z.object({
  query: z.object({
    from_station_id: z.string().optional(),
    to_station_id: z.string().optional(),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Format YYYY-MM-DD").optional(),
  }),
});

export const SearchTripByCoordinatesSchema = z.object({
  query: z.object({
    // Tọa độ điểm đi
    from_lat: z.string().transform(Number),
    from_lng: z.string().transform(Number),
    
    // Tọa độ điểm đến
    to_lat: z.string().transform(Number),
    to_lng: z.string().transform(Number),
    
    // Ngày đi (Optional)
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Format YYYY-MM-DD").optional(),
  }),
});

export const CreateTripResponseSchema = z.object({ id: z.string() });
export const GetTripResponseSchema = TripSchema;
export const GetAllTripsResponseSchema = z.array(TripSchema);