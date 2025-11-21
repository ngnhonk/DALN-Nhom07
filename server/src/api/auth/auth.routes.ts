import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import express, { type Router } from "express";
import { z } from "zod";

import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";
import { validateRequest } from "@/common/utils/httpHandlers";
import { authController } from "./auth.controller";

import {
    LoginResponseSchema,
    LoginSchema,
    RegisterResponseSchema,
    RegisterSchema,

} from "./auth.model";

export const authRegistry = new OpenAPIRegistry();
export const authRouter: Router = express.Router();


authRegistry.registerPath({
    method: "post",
    path: "/auth/register",
    tags: ["Auth"],
    request: {
        body: {
            content: {
                "application/json": {
                    schema: RegisterSchema.shape.body,
                },
            },
        },
    },
    responses: createApiResponse(RegisterResponseSchema, "Success"),
});

authRouter.post(
    "/register",
    validateRequest(RegisterSchema),
    authController.register
);


// Login
authRegistry.registerPath({
    method: "post",
    path: "/auth/login",
    tags: ["Auth"],
    request: {
        body: {
            content: {
                "application/json": {
                    schema: LoginSchema.shape.body,
                },
            },
        },
    },
    responses: createApiResponse(LoginResponseSchema, "Success"),
});
authRouter.post("/login", validateRequest(LoginSchema), authController.login);
