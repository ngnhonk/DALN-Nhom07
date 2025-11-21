import type { Request, RequestHandler, Response } from "express";

import { authService } from "./auth.service";

class AuthController {
    public register: RequestHandler = async (req: Request, res: Response) => {
        const { email, password, name, phone } = req.body;
        const serviceResponse = await authService.register(email, password,phone, name);
        res.status(serviceResponse.statusCode).send(serviceResponse);
    };


    public login: RequestHandler = async (req: Request, res: Response) => {
        const { email, password } = req.body;
        const serviceResponse = await authService.login(email, password);
        res.status(serviceResponse.statusCode).send(serviceResponse);
    };

    // public logout: RequestHandler = async (req: Request, res: Response) => {
    //     const { refreshToken } = req.cookies;
    //     console.log(req.cookies);
    //     const serviceResponse = await authService.logout(refreshToken);
    //     res.status(serviceResponse.statusCode).send(serviceResponse);
    // };

}

export const authController = new AuthController();
