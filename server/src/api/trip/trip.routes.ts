import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import express, { type Router } from "express";
import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";
import { validateRequest } from "@/common/utils/httpHandlers";
import { authenticate, authorize } from "@/common/middleware/auth";
import { tripController } from "./trip.controller";
import {
  TripSchema,
  CreateTripSchema,
  CreateTripResponseSchema,
  GetTripSchema,
  GetTripResponseSchema,
  SearchTripQuerySchema,
  GetAllTripsResponseSchema,
  SearchTripByCoordinatesSchema,
  // Không import SeatSchema
} from "./trip.model";

export const tripRegistry = new OpenAPIRegistry();
export const tripRouter: Router = express.Router();

tripRegistry.register("Trip", TripSchema);

// --- GET ALL / SEARCH ---
tripRegistry.registerPath({
  method: "get",
  path: "/trips",
  tags: ["Trip"],
  summary: "Get all trips or Search (by from/to/date)",
  request: { query: SearchTripQuerySchema.shape.query },
  responses: createApiResponse(GetAllTripsResponseSchema, "Success"),
});

tripRouter.get(
  "/", 
  validateRequest(SearchTripQuerySchema),
  tripController.getAllOrSearch
);

tripRegistry.registerPath({
  method: "get",
  path: "/trips/all",
  tags: ["Trip"],
  summary: "Get all trips",
  responses: createApiResponse(GetAllTripsResponseSchema, "Success"),
});

tripRouter.get(
  "/all", 
  validateRequest(SearchTripQuerySchema),
  tripController.getAllTrips
);

// --- GET BY ID ---
// Đã xóa route GET /trips/{id}/seats

tripRegistry.registerPath({
  method: "get",
  path: "/trips/{id}",
  tags: ["Trip"],
  summary: "Get trip details",
  request: { params: GetTripSchema.shape.params },
  responses: createApiResponse(GetTripResponseSchema, "Success"),
});

tripRouter.get("/:id", tripController.getTripById);

// --- CREATE ---
tripRegistry.registerPath({
  method: "post",
  path: "/trips",
  tags: ["Trip"],
  summary: "Create new trip",
  request: {
    body: {
      content: { "application/json": { schema: CreateTripSchema.shape.body } },
    },
  },
  responses: createApiResponse(CreateTripResponseSchema, "Success"),
});

tripRouter.post(
  "/",
  authenticate,
  authorize(["admin", "operator"]),
  validateRequest(CreateTripSchema),
  tripController.createTrip
);

tripRegistry.registerPath({
  method: "get",
  path: "/trips/search",
  tags: ["Trip"],
  summary: "Advanced Search: Find best trips by Start/End Coordinates",
  request: {
    query: SearchTripByCoordinatesSchema.shape.query,
  },
  responses: createApiResponse(GetAllTripsResponseSchema, "Success"),
});

tripRouter.get(
  "/search",
  validateRequest(SearchTripByCoordinatesSchema),
  tripController.searchTrips
);