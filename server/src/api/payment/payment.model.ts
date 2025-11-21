import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";
import { commonValidations } from "@/common/utils/commonValidation";

extendZodWithOpenApi(z);

// Schema
export const PaymentSchema = z.object({
  id: commonValidations.id,
  booking_id: commonValidations.id,
  amount: commonValidations.positive_number,
  method: commonValidations.PaymentMethodEnum,
  status: commonValidations.PaymentStatusEnum,
  paid_at: z.date().nullable(),
});

// Params ID
export const GetPaymentSchema = z.object({
  params: z.object({ id: commonValidations.id }),
});

// Body Create (User thanh toán)
export const CreatePaymentSchema = z.object({
  body: z.object({
    booking_id: commonValidations.id,
    amount: commonValidations.positive_number,
    method: commonValidations.PaymentMethodEnum,
  }),
});

// Body Update Webhook (Giả lập)
export const UpdatePaymentStatusSchema = z.object({
  params: z.object({ id: commonValidations.id }),
  body: z.object({ status: commonValidations.PaymentStatusEnum }),
});

export const CreatePaymentResponseSchema = z.object({ id: z.string() });