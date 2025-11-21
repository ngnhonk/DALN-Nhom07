import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import express, { type Router } from "express";
import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";
import { validateRequest } from "@/common/utils/httpHandlers";
import { authenticate, authorize } from "@/common/middleware/auth";
import { routeStopController } from "./route_stop.controller";
import {
  RouteStopSchema,
  CreateRouteStopSchema,
  CreateRouteStopResponseSchema,
  GetRouteStopsByRouteSchema,
  GetAllRouteStopsResponseSchema,
} from "./route_stop.model";

export const routeStopRegistry = new OpenAPIRegistry();
export const routeStopRouter: Router = express.Router();

routeStopRegistry.register("RouteStop", RouteStopSchema);

// --- GET STOPS BY ROUTE ---
routeStopRegistry.registerPath({
  method: "get",
  path: "/route_stops/route/{routeId}",
  tags: ["Route Stop"],
  summary: "Get all stops of a specific route",
  request: { params: GetRouteStopsByRouteSchema.shape.params },
  responses: createApiResponse(GetAllRouteStopsResponseSchema, "Success"),
});

routeStopRouter.get(
  "/route/:routeId",
  // authenticate,
  // authorize(["admin", "operator"]),
  routeStopController.getStopsByRoute
);

// --- CREATE ROUTE STOP ---
routeStopRegistry.registerPath({
  method: "post",
  path: "/route_stops",
  tags: ["Route Stop"],
  summary: "Add a stop to a route",
  request: {
    body: {
      content: {
        "application/json": { schema: CreateRouteStopSchema.shape.body },
      },
    },
  },
  responses: createApiResponse(CreateRouteStopResponseSchema, "Success"),
});

routeStopRouter.post(
  "/",
  // authenticate,
  // authorize(["admin", "operator"]),
  validateRequest(CreateRouteStopSchema),
  routeStopController.createRouteStop
);

// --- DELETE ---
routeStopRegistry.registerPath({
    method: "delete",
    path: "/route_stops/{id}",
    tags: ["Route Stop"],
    summary: "Delete a stop",
    responses: createApiResponse(CreateRouteStopResponseSchema, "Success")
})
routeStopRouter.delete(
    "/:id",
    // authenticate,
    // authorize(["admin", "operator"]),
    routeStopController.deleteRouteStop
)