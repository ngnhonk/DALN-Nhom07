import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import express, { type Router } from "express";
import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";
import { validateRequest } from "@/common/utils/httpHandlers";
import { authenticate } from "@/common/middleware/auth";
import { paymentController } from "./payment.controller";
import {
  CreatePaymentSchema,
  CreatePaymentResponseSchema,
  UpdatePaymentStatusSchema,
} from "./payment.model";

export const paymentRegistry = new OpenAPIRegistry();
export const paymentRouter: Router = express.Router();

paymentRegistry.register("Payment", CreatePaymentSchema);

// --- CREATE PAYMENT (User) ---
paymentRegistry.registerPath({
  method: "post",
  path: "/payments",
  tags: ["Payment"],
  summary: "Initiate a payment",
  request: {
    body: {
      content: { "application/json": { schema: CreatePaymentSchema.shape.body } },
    },
  },
  responses: createApiResponse(CreatePaymentResponseSchema, "Success"),
});

paymentRouter.post(
  "/",
  authenticate,
  validateRequest(CreatePaymentSchema),
  paymentController.createPayment
);

// --- WEBHOOK UPDATE STATUS (System/Admin) ---
paymentRegistry.registerPath({
  method: "patch",
  path: "/payments/{id}/status",
  tags: ["Payment"],
  summary: "Update payment status (Webhook)",
  request: {
    params: UpdatePaymentStatusSchema.shape.params,
    body: {
      content: { "application/json": { schema: UpdatePaymentStatusSchema.shape.body } },
    },
  },
  responses: createApiResponse(CreatePaymentResponseSchema, "Success"),
});

paymentRouter.patch(
  "/:id/status",
  // authenticate, // Thực tế nên check IP hoặc Signature của Payment Gateway
  validateRequest(UpdatePaymentStatusSchema),
  paymentController.updateStatus
);