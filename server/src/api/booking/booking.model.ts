import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";
import { commonValidations } from "@/common/utils/commonValidation";

extendZodWithOpenApi(z);

// Enum trạng thái
export const BookingStatusEnum = z.enum(['pending', 'paid', 'canceled', 'refunded']);

// Schema hiển thị chi tiết Booking
export const BookingSchema = z.object({
  id: z.string(),
  user_id: z.string(),
  trip_id: z.string(),
  pickup_station_id: z.string(),
  dropoff_station_id: z.string(),
  status: BookingStatusEnum,
  created_at: z.date(),
});

// Input khi người dùng đặt vé
export const CreateBookingSchema = z.object({
  body: z.object({
    trip_id: commonValidations.id,
    pickup_station_id: commonValidations.id,
    dropoff_station_id: commonValidations.id,
  }),
});

export const GetBookingSchema = z.object({
  params: z.object({ id: commonValidations.id }),
});

// Response
// Chỉ trả về ID, không trả về giá tiền nữa
export const CreateBookingResponseSchema = z.object({ id: z.string() });
export const GetUserBookingsResponseSchema = z.array(BookingSchema);