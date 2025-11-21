import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import express, { type Router } from "express";
import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";
import { validateRequest } from "@/common/utils/httpHandlers";
import { authenticate, authorize } from "@/common/middleware/auth";
import { seatController } from "./seat.controller";
import {
  SeatSchema,
  CreateAutoSeatsSchema,
  CreateSeatsResponseSchema,
  GetSeatsByBusSchema,
  GetSeatsResponseSchema,
} from "./seat.model";

export const seatRegistry = new OpenAPIRegistry();
export const seatRouter: Router = express.Router();

seatRegistry.register("Seat", SeatSchema);

// --- GET SEATS BY BUS (Public) ---
seatRegistry.registerPath({
  method: "get",
  path: "/seats/bus/{busId}",
  tags: ["Seat"],
  summary: "Get seat layout of a bus",
  request: { params: GetSeatsByBusSchema.shape.params },
  responses: createApiResponse(GetSeatsResponseSchema, "Success"),
});

seatRouter.get(
  "/bus/:busId", 
  seatController.getSeatsByBus
);

// --- CREATE AUTO SEATS (Admin/Operator Only) ---
seatRegistry.registerPath({
  method: "post",
  path: "/seats/auto-generate",
  tags: ["Seat"],
  summary: "Auto generate seats based on total capacity (minus 2 for staff)",
  request: {
    body: {
      content: {
        "application/json": { schema: CreateAutoSeatsSchema.shape.body },
      },
    },
  },
  responses: createApiResponse(CreateSeatsResponseSchema, "Success"),
});

seatRouter.post(
  "/auto-generate",
  authenticate,
  authorize(["admin", "operator"]),
  validateRequest(CreateAutoSeatsSchema),
  seatController.createAutoSeats
);

// --- RESET SEATS (Admin/Operator Only) ---
seatRegistry.registerPath({
    method: "delete",
    path: "/seats/bus/{busId}",
    tags: ["Seat"],
    summary: "Delete all seats of a bus",
    request: { params: GetSeatsByBusSchema.shape.params },
    responses: createApiResponse(CreateSeatsResponseSchema, "Success"),
});

seatRouter.delete(
    "/bus/:busId",
    authenticate,
    authorize(["admin", "operator"]),
    seatController.resetSeats
);