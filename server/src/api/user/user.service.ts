import { StatusCodes } from "http-status-codes";

import type { User } from "@/api/user/user.model";
import { UserRepository } from "@/api/user/user.repository";
import { ServiceResponse } from "@/common/models/serviceResponse";
import { logger } from "@/server";
import { checkPassword, hashPassword } from "@/common/utils/password";
import { AuthRepository } from "../auth/auth.repository";

import { nanoid } from "nanoid";

export class UserService {
	private userRepository: UserRepository;
	private authRepository: AuthRepository;

	constructor(user_repository: UserRepository = new UserRepository(), auth_repository: AuthRepository = new AuthRepository()) {
		this.userRepository = user_repository;
		this.authRepository = auth_repository;
	}

	// Retrieves all users from the database
	async getAllUsers(): Promise<ServiceResponse<User[] | null | string>> {
		try {
			const users = await this.userRepository.getAllUsers();
			if (!users || users.length === 0) {
				return ServiceResponse.failure(
					"No Users found",
					null,
					StatusCodes.NOT_FOUND
				);
			}
			return ServiceResponse.success<User[]>("Users found", users);
		} catch (ex) {
			const errorMessage = `Error finding all users: $${(ex as Error).message}`;
			logger.error(errorMessage);
			return ServiceResponse.failure(
				"An error occurred while retrieving users.",
				errorMessage,
				StatusCodes.INTERNAL_SERVER_ERROR
			);
		}
	}

	// Retrieves a single user by their ID
	async getUserById(
		id: string
	): Promise<ServiceResponse<User | null | string>> {
		try {
			const user = await this.userRepository.getUserById(id);
			if (!user) {
				return ServiceResponse.failure(
					"User not found",
					null,
					StatusCodes.NOT_FOUND
				);
			}
			return ServiceResponse.success<User>("User found", user);
		} catch (ex) {
			const errorMessage = `Error finding user with id ${id}:, ${(ex as Error).message
				}`;
			logger.error(errorMessage);
			return ServiceResponse.failure(
				"An error occurred while finding user.",
				null,
				StatusCodes.INTERNAL_SERVER_ERROR
			);
		}
	}

	async updateInformation(
		id: string,
		name: string,
		email: string,
		phone: string
	): Promise<ServiceResponse<number | null>> {
		try {
			const result = await this.userRepository.updateInformation(id, name, email, phone);
			return ServiceResponse.success(
				"Update user's information successfully",
				result,
				StatusCodes.OK
			);
		} catch (ex) {
			const errorMessage = `Error updating user with id ${id}:, ${(ex as Error).message
				}`;
			logger.error(errorMessage);
			return ServiceResponse.failure(
				"An error occurred while updating user.",
				null,
				StatusCodes.INTERNAL_SERVER_ERROR
			);
		}
	}


	async changePassword(
		email: string,
		password: string,
		new_password: string
	): Promise<ServiceResponse<number | string | null>> {
		try {
			const exists = await this.userRepository.getUserByEmail(email);
			if (!exists) {
				return ServiceResponse.failure(
					"Invalid email or password",
					null,
					StatusCodes.UNAUTHORIZED
				);
			}

			const correctPassword = await checkPassword(
				password,
				exists.hash_password
			);
			if (!correctPassword) {
				return ServiceResponse.failure(
					"Invalid password",
					null,
					StatusCodes.UNAUTHORIZED
				);
			}

			const new_hash_password = await hashPassword(new_password);
			const result = await this.userRepository.changePassword(
				email,
				new_hash_password
			);
			return ServiceResponse.success(
				"Password changed successfully!",
				result,
				StatusCodes.OK
			);
		} catch (error) {
			const errorMessage = `Error changing password: ${(error as Error).message
				}`;
			logger.error(errorMessage);
			return ServiceResponse.failure(
				"An error occurred while changing password.",
				errorMessage,
				StatusCodes.INTERNAL_SERVER_ERROR
			);
		}
	}
}

export const userService = new UserService();
