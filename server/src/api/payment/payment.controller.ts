import type { Request, RequestHandler, Response } from "express";
import { paymentService } from "./payment.service";

class PaymentController {
  public createPayment: RequestHandler = async (req: Request, res: Response) => {
    const { booking_id, amount, method } = req.body;
    const serviceResponse = await paymentService.createPayment(booking_id, amount, method);
    res.status(serviceResponse.statusCode).send(serviceResponse);
  };

  public updateStatus: RequestHandler = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { status } = req.body;
    const serviceResponse = await paymentService.updatePaymentStatus(id, status);
    res.status(serviceResponse.statusCode).send(serviceResponse);
  };
}

export const paymentController = new PaymentController();