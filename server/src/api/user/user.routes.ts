import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import express, { type Router } from "express";
import { upload } from "@/common/middleware/multer";

import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";
import {
	UpdateUserSchema,
	UserSchema,
	ChangePasswordSchema,
	ChangePasswordResponseSchema,
	UpdateUserResponseSchema,
	GetUserSchema

} from "@/api/user/user.model";
import { validateRequest } from "@/common/utils/httpHandlers";
import { userController } from "./user.controller";
import { authenticate } from "@/common/middleware/auth";

export const userRegistry = new OpenAPIRegistry();
export const userRouter: Router = express.Router();

userRegistry.register("User", UserSchema);

// Get user information
userRegistry.registerPath({
	method: "get",
	path: "/users/{id}",
	tags: ["User"],
	request: { params: GetUserSchema.shape.params }, 
	responses: createApiResponse(UpdateUserResponseSchema, "Success"),
});

userRouter.get(
	"/:id",
	authenticate,
	userController.getUserById
);

// Get user information
userRegistry.registerPath({
	method: "get",
	path: "/users/me",
	tags: ["User"],
	responses: createApiResponse(UpdateUserResponseSchema, "Success"),
});

userRouter.get(
	"/me",
	authenticate,
	userController.getUserById
);
// Update user information
userRegistry.registerPath({
	method: "patch",
	path: "/users/information",
	tags: ["User"],
	request: {
		body: {
			content: {
				"application/json": {
					schema: UpdateUserSchema.shape.body,
				},
			},
		},
	},
	responses: createApiResponse(UpdateUserResponseSchema, "Success"),
});

userRouter.patch(
	"/",
	authenticate,
	validateRequest(UpdateUserSchema),
	userController.updateInformation
);


// Change Password
userRegistry.registerPath({
	method: "patch",
	path: "/users/change-password",
	tags: ["User"],
	request: {
		body: {
			content: {
				"application/json": {
					schema: ChangePasswordSchema.shape.body,
				},
			},
		},
	},
	responses: createApiResponse(ChangePasswordResponseSchema, "Success"),
});

userRouter.patch(
	"/change-password",
	authenticate,
	validateRequest(ChangePasswordSchema),
	userController.changePassword
);
