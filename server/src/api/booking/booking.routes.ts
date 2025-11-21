import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import express, { type Router } from "express";
import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";
import { validateRequest } from "@/common/utils/httpHandlers";
import { authenticate } from "@/common/middleware/auth"; // Booking phải có auth
import { bookingController } from "./booking.controller";
import {
  CreateBookingSchema,
  CreateBookingResponseSchema,
  GetUserBookingsResponseSchema,
  GetBookingSchema,
} from "./booking.model";

export const bookingRegistry = new OpenAPIRegistry();
export const bookingRouter: Router = express.Router();

bookingRegistry.register("Booking", CreateBookingSchema);

// 1. Create Booking
bookingRegistry.registerPath({
  method: "post",
  path: "/bookings",
  tags: ["Booking"],
  security: [{ bearerAuth: [] }], // Yêu cầu token
  summary: "Book tickets for a trip",
  request: {
    body: {
        content: { "application/json": { schema: CreateBookingSchema.shape.body } }
    }
  },
  responses: createApiResponse(CreateBookingResponseSchema, "Success"),
});

bookingRouter.post(
  "/",
  authenticate, // Bắt buộc phải đăng nhập
  validateRequest(CreateBookingSchema),
  bookingController.createBooking
);

// 2. Get My History
bookingRegistry.registerPath({
  method: "get",
  path: "/bookings/me",
  tags: ["Booking"],
  security: [{ bearerAuth: [] }],
  summary: "My booking history",
  responses: createApiResponse(GetUserBookingsResponseSchema, "Success"),
});
bookingRouter.get(
    "/me",
    authenticate,
    bookingController.getMyBookings
);

// 3. Cancel Booking
bookingRegistry.registerPath({
  method: "post",
  path: "/bookings/{id}/cancel",
  tags: ["Booking"],
  security: [{ bearerAuth: [] }],
  summary: "My booking history",
  request: { params: GetBookingSchema.shape.params },
  responses: createApiResponse(GetUserBookingsResponseSchema, "Success"),
});
bookingRouter.post(
    "/:id/cancel",
    authenticate,
    bookingController.cancelBooking
)