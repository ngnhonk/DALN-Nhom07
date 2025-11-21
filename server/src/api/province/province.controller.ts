import type { Request, RequestHandler, Response } from "express";
import { provinceService } from "./province.service";

class ProvinceController {
  public getAllProvinces: RequestHandler = async (_req: Request, res: Response) => {
    const serviceResponse = await provinceService.getAllProvinces();
    res.status(serviceResponse.statusCode).send(serviceResponse);
  };

  public getProvinceById: RequestHandler = async (req: Request, res: Response) => {
    const { id } = req.params;
    const serviceResponse = await provinceService.getProvinceById(id);
    res.status(serviceResponse.statusCode).send(serviceResponse);
  };

  public createProvince: RequestHandler = async (req: Request, res: Response) => {
    const { name, code } = req.body;
    const serviceResponse = await provinceService.createProvince(name, code);
    res.status(serviceResponse.statusCode).send(serviceResponse);
  };

  public updateProvince: RequestHandler = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, code } = req.body;
    const serviceResponse = await provinceService.updateProvince(id, name, code);
    res.status(serviceResponse.statusCode).send(serviceResponse);
  };

  public deleteProvince: RequestHandler = async (req: Request, res: Response) => {
    const { id } = req.params;
    const serviceResponse = await provinceService.deleteProvince(id);
    res.status(serviceResponse.statusCode).send(serviceResponse);
  };
}

export const provinceController = new ProvinceController();