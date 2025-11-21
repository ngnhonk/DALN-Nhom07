import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import express, { type Router } from "express";
import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";
import { validateRequest } from "@/common/utils/httpHandlers";
import { authenticate, authorize } from "@/common/middleware/auth";
import { busOperatorController } from "./bus_operator.controller";
import {
  BusOperatorSchema,
  CreateBusOperatorSchema,
  CreateBusOperatorResponseSchema,
  GetAllBusOperatorsResponseSchema,
  GetBusOperatorSchema,
  GetBusOperatorResponseSchema,
  UpdateBusOperatorSchema,
  UpdateBusOperatorResponseSchema,
} from "./bus_operator.model";

export const busOperatorRegistry = new OpenAPIRegistry();
export const busOperatorRouter: Router = express.Router();

busOperatorRegistry.register("BusOperator", BusOperatorSchema);

// --- GET ALL (Public) ---
busOperatorRegistry.registerPath({
  method: "get",
  path: "/bus_operators",
  tags: ["Bus Operator"],
  summary: "Get all bus operators",
  responses: createApiResponse(GetAllBusOperatorsResponseSchema, "Success"),
});

busOperatorRouter.get("/", busOperatorController.getAllBusOperators);

// --- GET BY ID (Public) ---
busOperatorRegistry.registerPath({
  method: "get",
  path: "/bus_operators/{id}",
  tags: ["Bus Operator"],
  summary: "Get bus operator by ID",
  request: { params: GetBusOperatorSchema.shape.params },
  responses: createApiResponse(GetBusOperatorResponseSchema, "Success"),
});

busOperatorRouter.get("/:id", busOperatorController.getBusOperatorById);

// --- CREATE (Admin Only) ---
busOperatorRegistry.registerPath({
  method: "post",
  path: "/bus_operators",
  tags: ["Bus Operator"],
  summary: "Create a new bus operator",
  request: {
    body: {
      content: {
        "application/json": { schema: CreateBusOperatorSchema.shape.body },
      },
    },
  },
  responses: createApiResponse(CreateBusOperatorResponseSchema, "Success"),
});

busOperatorRouter.post(
  "/",
//   authenticate,
//   authorize(["admin"]),
  validateRequest(CreateBusOperatorSchema),
  busOperatorController.createBusOperator
);

// --- UPDATE (Admin Only) ---
busOperatorRegistry.registerPath({
  method: "patch",
  path: "/bus_operators/{id}",
  tags: ["Bus Operator"],
  summary: "Update a bus operator",
  request: {
    params: UpdateBusOperatorSchema.shape.params,
    body: {
      content: {
        "application/json": { schema: UpdateBusOperatorSchema.shape.body },
      },
    },
  },
  responses: createApiResponse(UpdateBusOperatorResponseSchema, "Success"),
});

busOperatorRouter.patch(
  "/:id",
//   authenticate,
//   authorize(["admin"]),
  validateRequest(UpdateBusOperatorSchema),
  busOperatorController.updateBusOperator
);

// --- DELETE (Admin Only) ---
busOperatorRegistry.registerPath({
  method: "delete",
  path: "/bus_operators/{id}",
  tags: ["Bus Operator"],
  summary: "Delete a bus operator",
  request: { params: GetBusOperatorSchema.shape.params },
  responses: createApiResponse(BusOperatorSchema, "Success"),
});

busOperatorRouter.delete(
  "/:id",
//   authenticate,
//   authorize(["admin"]),
  busOperatorController.deleteBusOperator
);