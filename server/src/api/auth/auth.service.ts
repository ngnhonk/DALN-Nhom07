import { StatusCodes } from "http-status-codes";
import { AuthRepository } from "./auth.repository";
import { ServiceResponse } from "@/common/models/serviceResponse";
import { logger } from "@/server";
import { nanoid } from "nanoid";
import { hashPassword, checkPassword } from "@/common/utils/password";


import {
  createJwtToken,
  verifyJwtToken,
  UserData,
} from "@/common/utils/jwt";

import { UserRepository } from "../user/user.repository";

export class AuthService {
  private authRepository: AuthRepository;
  private userRepository: UserRepository;

  constructor(
    auth_repository: AuthRepository = new AuthRepository(),
    user_repository: UserRepository = new UserRepository()
  ) {
    this.authRepository = auth_repository;
    this.userRepository = user_repository;
  }

  // Register
  async register(
    email: string,
    password: string,
    phone: string,
    name: string
  ): Promise<ServiceResponse<object | string | null>> {
    try {
      const emailExists = await this.userRepository.getUserByEmail(email);
      const phoneExists = await this.userRepository.getUserByPhone(phone);
      if (emailExists || phoneExists) {
        return ServiceResponse.failure(
          "User with email or phone already exists!",
          null,
          StatusCodes.CONFLICT
        );
      }
      const id = nanoid(10);
      const hash_password = await hashPassword(password);

      await this.authRepository.register(id, email, hash_password, phone, name);

      return ServiceResponse.success(
        "Account created successfully, you can login now",
        null,
        StatusCodes.CREATED
      );
    } catch (error) {
      const errorMessage = `Error while creating user: ${(error as Error).message
        }`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred while creating users.",
        errorMessage,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  // Login
  async login(
    email: string,
    password: string,
  ): Promise<ServiceResponse<object | string | null>> {
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
          "Invalid email or password",
          null,
          StatusCodes.UNAUTHORIZED
        );
      }

      const information: UserData = {
        id: exists.id,
        email: exists.email,
        name: exists.name,
        phone: exists.phone,
        role: exists.role,
      };

      const token = createJwtToken(information);

      return ServiceResponse.success(
        "Logged in successfully!",
        {
          token: token,
        },
        StatusCodes.OK
      );
    } catch (error) {
      const errorMessage = `Error logging in: ${(error as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred while logging in.",
        errorMessage,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }
}

export const authService = new AuthService();
