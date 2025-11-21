import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import express, { type Router } from "express";

import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";
import { UpdateBusStationResponseSchema, BusStation, BusStationSchema, GetBusStationResponseSchema, CreateBusStationResponseSchema, CreateBusStationSchema, GetAllBusStationsResponseSchema, UpdateBusStationSchema, GetBusStationSchema } from "./bus_station.model";
import { validateRequest } from "@/common/utils/httpHandlers";
import { busStationController } from "./bus_station.controller";
import { authenticate, authorize } from "@/common/middleware/auth";

export const busStationRegistry = new OpenAPIRegistry();
export const busStationRouter: Router = express.Router();

busStationRegistry.register("BusStation", BusStationSchema);

busStationRegistry.registerPath({
    method: "post",
    path: "/bus_stations",
    tags: ["Bus Station"],
    summary: "Create a new bus station",
    request: {
        body: {
            content: {
                "application/json": {
                    schema: CreateBusStationSchema.shape.body,
                },
            },
        },
    },
    responses: createApiResponse(CreateBusStationResponseSchema, "Success"),
});

busStationRouter.post(
    "/",
    // authenticate,
    // authorize(["admin"]),
    validateRequest(CreateBusStationSchema),
    busStationController.createBusStation
);


// Get All Bus Stations
busStationRegistry.registerPath({
  method: "get",
  path: "/bus_stations",
  tags: ["Bus Station"],
  summary: "Get all bus stations",
  responses: createApiResponse(GetAllBusStationsResponseSchema, "Success"),
});

busStationRouter.get(
  "/",
//   authenticate,
//   authorize(["admin"]),
  busStationController.getAllBusStations
);

// Get Bus Stations By Id
busStationRegistry.registerPath({
  method: "get",
  path: "/bus_stations/{id}",
  tags: ["Bus Station"],
  summary: "Get bus stations by ID",
  request: { params: GetBusStationSchema.shape.params },
  responses: createApiResponse(GetAllBusStationsResponseSchema, "Success"),
});

busStationRouter.get(
  "/:id",
//   authenticate,
//   authorize(["admin"]),
  busStationController.getBusStationById
);

// Update Bus Station
busStationRegistry.registerPath({
  method: "patch",
    path: "/bus_stations/{id}",
    tags: ["Bus Station"],
    summary: "Update a bus station",
    request: {
        params: UpdateBusStationSchema.shape.params,
        body: {
            content: {
                "application/json": {
                    schema: UpdateBusStationSchema.shape.body,
                },
            },
        },
    },
    responses: createApiResponse(UpdateBusStationResponseSchema, "Success"),
});

busStationRouter.patch(
    "/:id",
    // authenticate,
    // authorize(["admin"]),
    validateRequest(UpdateBusStationSchema),
    busStationController.updateBusStation
);

// Delete Bus Station
busStationRegistry.registerPath({
    method: "delete",
        path: "/bus_stations/{id}",
        tags: ["Bus Station"],
        summary: "Delete a bus station",
        responses: createApiResponse(CreateBusStationSchema, "Success"),
});
busStationRouter.delete(
    "/:id",
    // authenticate,
    // authorize(["admin"]),
    busStationController.deleteBusStation
);
