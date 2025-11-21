import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import express, { type Router } from "express";
import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";
import { validateRequest } from "@/common/utils/httpHandlers";
import { authenticate, authorize } from "@/common/middleware/auth";
import { routeController } from "./route.controller";
import {
  RouteSchema,
  CreateRouteSchema,
  CreateRouteResponseSchema,
  GetAllRoutesResponseSchema,
  GetRouteSchema,
  GetRouteResponseSchema,
  UpdateRouteSchema,
  UpdateRouteResponseSchema,
} from "./route.model";

export const routeRegistry = new OpenAPIRegistry();
export const routeRouter: Router = express.Router();

routeRegistry.register("Route", RouteSchema);

// --- GET ALL (Public) ---
routeRegistry.registerPath({
  method: "get",
  path: "/routes",
  tags: ["Route"],
  summary: "Get all routes",
  responses: createApiResponse(GetAllRoutesResponseSchema, "Success"),
});

routeRouter.get("/", routeController.getAllRoutes);

// --- GET BY ID (Public) ---
routeRegistry.registerPath({
  method: "get",
  path: "/routes/{id}",
  tags: ["Route"],
  summary: "Get route by ID",
  request: { params: GetRouteSchema.shape.params },
  responses: createApiResponse(GetRouteResponseSchema, "Success"),
});

routeRouter.get("/:id", routeController.getRouteById);

// --- CREATE (Admin, Operator) ---
routeRegistry.registerPath({
  method: "post",
  path: "/routes",
  tags: ["Route"],
  summary: "Create a new route",
  request: {
    body: {
      content: {
        "application/json": { schema: CreateRouteSchema.shape.body },
      },
    },
  },
  responses: createApiResponse(CreateRouteResponseSchema, "Success"),
});

routeRouter.post(
  "/",
  // authenticate,
  // authorize(["admin", "operator"]), // Chỉ Admin hoặc Nhà xe được tạo tuyến
  validateRequest(CreateRouteSchema),
  routeController.createRoute
);

// --- UPDATE (Admin, Operator) ---
routeRegistry.registerPath({
  method: "patch",
  path: "/routes/{id}",
  tags: ["Route"],
  summary: "Update a route",
  request: {
    params: UpdateRouteSchema.shape.params,
    body: {
      content: {
        "application/json": { schema: UpdateRouteSchema.shape.body },
      },
    },
  },
  responses: createApiResponse(UpdateRouteResponseSchema, "Success"),
});

routeRouter.patch(
  "/:id",
  // authenticate,
  // authorize(["admin", "operator"]),
  validateRequest(UpdateRouteSchema),
  routeController.updateRoute
);

// --- DELETE (Admin, Operator) ---
routeRegistry.registerPath({
  method: "delete",
  path: "/routes/{id}",
  tags: ["Route"],
  summary: "Delete a route",
  request: { params: GetRouteSchema.shape.params },
  responses: createApiResponse(RouteSchema, "Success"),
});

routeRouter.delete(
  "/:id",
  // authenticate,
  // authorize(["admin", "operator"]),
  routeController.deleteRoute
);