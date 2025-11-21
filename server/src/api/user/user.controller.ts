import type { Request, RequestHandler, Response } from "express";

import { userService } from "@/api/user/user.service";

class UserController {
	public getAllUsers: RequestHandler = async (_req: Request, res: Response) => {
		const serviceResponse = await userService.getAllUsers();
		res.status(serviceResponse.statusCode).send(serviceResponse);
	};

	public getUserById: RequestHandler = async (req: Request, res: Response) => {
		const id = (req as any).user.id;
		const serviceResponse = await userService.getUserById(id);
		res.status(serviceResponse.statusCode).send(serviceResponse);
	};

	public getMe: RequestHandler = async (req: Request, res: Response) => {
		const id = (req as any).user.id;
		const serviceResponse = await userService.getUserById(id);
		res.status(serviceResponse.statusCode).send(serviceResponse);
	};

	public updateInformation: RequestHandler = async (req: Request, res: Response) => {
		const id = (req as any).user.id;
		const { name, phone, email } = req.body;
		const serviceResponse = await userService.updateInformation(id, name, email, phone);
		res.status(serviceResponse.statusCode).send(serviceResponse);
	};


	public changePassword: RequestHandler = async (req: Request, res: Response) => {
		const email = (req as any).user.email;
		const { password, new_password } = req.body;
		const serviceResponse = await userService.changePassword(email, password, new_password);
		res.status(serviceResponse.statusCode).send(serviceResponse);
	};
}

export const userController = new UserController();
