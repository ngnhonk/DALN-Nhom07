import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";
import { commonValidations } from "@/common/utils/commonValidation";

extendZodWithOpenApi(z);

export type Seat = z.infer<typeof SeatSchema>;

// 1. Schema hiển thị ra ngoài (Output)
export const SeatSchema = z.object({
  id: z.string(),
  bus_id: z.string(),
  seat_number: z.string(),
});

// 2. Schema Input: Tự động sinh ghế
export const CreateAutoSeatsSchema = z.object({
  body: z.object({
    bus_id: commonValidations.id,
    // Nhập tổng số chỗ ngồi ghi trên đăng kiểm (ví dụ 34 chỗ)
    // Hệ thống sẽ tự trừ 2 (tài + phụ) = 32 ghế khách
    number_of_seats: z.number().int()
      .min(3, "Total seats must be at least 3 (to have at least 1 passenger seat)")
      .max(100, "Seat limit exceeded"), 
  }),
});

// 3. Validate Params cho API Get/Delete
export const GetSeatsByBusSchema = z.object({
  params: z.object({ busId: commonValidations.id }),
});

// 4. Response Schemas
export const CreateSeatsResponseSchema = z.object({
  message: z.string(),
  count: z.number(),
});

export const GetSeatsResponseSchema = z.array(SeatSchema);