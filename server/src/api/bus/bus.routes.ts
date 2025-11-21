import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import express, { type Router } from "express";
import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";
import { validateRequest } from "@/common/utils/httpHandlers";
import { authenticate, authorize } from "@/common/middleware/auth";
import { busController } from "./bus.controller";

import {
  BusSchema,
  CreateBusSchema,
  CreateBusResponseSchema,
  GetAllBusesResponseSchema,
  GetBusSchema,
  GetBusResponseSchema,
  UpdateBusSchema,
  UpdateBusResponseSchema,
} from "./bus.model";
export const busRegistry = new OpenAPIRegistry();
export const busRouter: Router = express.Router();

busRegistry.register("Bus", BusSchema);

// --- GET ALL ---
busRegistry.registerPath({
  method: "get",
  path: "/buses",
  tags: ["Bus"],
  summary: "Get all buses",
  responses: createApiResponse(GetAllBusesResponseSchema, "Success"),
});

busRouter.get(
    "/", 
    // authenticate, 
    // authorize(["admin", "operator"]), 
    busController.getAllBuses
);

// --- GET BY ID ---
busRegistry.registerPath({
  method: "get",
  path: "/buses/{id}",
  tags: ["Bus"],
  summary: "Get bus by ID",
  request: { params: GetBusSchema.shape.params },
  responses: createApiResponse(GetBusResponseSchema, "Success"),
});

busRouter.get(
    "/:id", 
    // authenticate, 
    // authorize(["admin", "operator"]), 
    busController.getBusById
);

// --- CREATE ---
busRegistry.registerPath({
  method: "post",
  path: "/buses",
  tags: ["Bus"],
  summary: "Create a new bus",
  request: {
    body: {
      content: {
        "application/json": { schema: CreateBusSchema.shape.body },
      },
    },
  },
  responses: createApiResponse(CreateBusResponseSchema, "Success"),
});

busRouter.post(
  "/",
  // authenticate,
  // authorize(["admin", "operator"]), // Admin hoặc Operator được tạo xe
  validateRequest(CreateBusSchema),
  busController.createBus
);

// --- UPDATE ---
busRegistry.registerPath({
  method: "patch",
  path: "/buses/{id}",
  tags: ["Bus"],
  summary: "Update a bus",
  request: {
    params: UpdateBusSchema.shape.params,
    body: {
      content: {
        "application/json": { schema: UpdateBusSchema.shape.body },
      },
    },
  },
  responses: createApiResponse(UpdateBusResponseSchema, "Success"),
});

busRouter.patch(
  "/:id",
  // authenticate,
  // authorize(["admin", "operator"]),
  validateRequest(UpdateBusSchema),
  busController.updateBus
);

// --- DELETE ---
busRegistry.registerPath({
  method: "delete",
  path: "/buses/{id}",
  tags: ["Bus"],
  summary: "Delete a bus",
  request: { params: GetBusSchema.shape.params },
  responses: createApiResponse(BusSchema, "Success"),
});

busRouter.delete(
  "/:id",
  // authenticate,
  // authorize(["admin", "operator"]),
  busController.deleteBus
);