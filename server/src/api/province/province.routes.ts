import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import express, { type Router } from "express";
import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";
import { validateRequest } from "@/common/utils/httpHandlers";
import { authenticate, authorize } from "@/common/middleware/auth";
import { provinceController } from "./province.controller";
import {
  ProvinceSchema,
  CreateProvinceSchema,
  CreateProvinceResponseSchema,
  GetAllProvincesResponseSchema,
  GetProvinceSchema,
  GetProvinceResponseSchema,
  UpdateProvinceSchema,
  UpdateProvinceResponseSchema,
} from "./province.model";

export const provinceRegistry = new OpenAPIRegistry();
export const provinceRouter: Router = express.Router();

provinceRegistry.register("Province", ProvinceSchema);

// --- GET ALL ---
provinceRegistry.registerPath({
  method: "get",
  path: "/provinces",
  tags: ["Province"],
  summary: "Get all provinces",
  responses: createApiResponse(GetAllProvincesResponseSchema, "Success"),
});

// Public API: Ai cũng xem được danh sách tỉnh thành
provinceRouter.get("/", provinceController.getAllProvinces); 

// --- GET BY ID ---
provinceRegistry.registerPath({
  method: "get",
  path: "/provinces/{id}",
  tags: ["Province"],
  summary: "Get province by ID",
  request: { params: GetProvinceSchema.shape.params },
  responses: createApiResponse(GetProvinceResponseSchema, "Success"),
});

provinceRouter.get("/:id", provinceController.getProvinceById);


provinceRegistry.registerPath({
  method: "post",
  path: "/provinces",
  tags: ["Province"],
  summary: "Create a new province",
  request: {
    body: {
      content: {
        "application/json": { schema: CreateProvinceSchema.shape.body },
      },
    },
  },
  responses: createApiResponse(CreateProvinceResponseSchema, "Success"),
});

provinceRouter.post(
  "/",
//   authenticate,
//   authorize(["admin"]), // Chỉ admin mới được tạo tỉnh
  validateRequest(CreateProvinceSchema),
  provinceController.createProvince
);

// --- UPDATE (Admin Only) ---
provinceRegistry.registerPath({
  method: "patch",
  path: "/provinces/{id}",
  tags: ["Province"],
  summary: "Update a province",
  request: {
    params: UpdateProvinceSchema.shape.params,
    body: {
      content: {
        "application/json": { schema: UpdateProvinceSchema.shape.body },
      },
    },
  },
  responses: createApiResponse(UpdateProvinceResponseSchema, "Success"),
});

provinceRouter.patch(
  "/:id",
//   authenticate,
//   authorize(["admin"]),
  validateRequest(UpdateProvinceSchema),
  provinceController.updateProvince
);

// --- DELETE (Admin Only) ---
provinceRegistry.registerPath({
  method: "delete",
  path: "/provinces/{id}",
  tags: ["Province"],
  summary: "Delete a province",
  request: { params: GetProvinceSchema.shape.params },
  responses: createApiResponse(ProvinceSchema, "Success"),
});

provinceRouter.delete(
  "/:id",
//   authenticate,
//   authorize(["admin"]),
  provinceController.deleteProvince
);