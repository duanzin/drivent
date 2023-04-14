import { Request, Response } from 'express';
import httpStatus from 'http-status';

export async function getPaymentInfo(req: Request, res: Response) {
    try {
      return res.status(httpStatus.OK).send();
    } catch (error) {
      return res.status(httpStatus.UNAUTHORIZED).send({});
    }
  }

export async function payTicket(req: Request, res: Response) {
    try {
      return res.status(httpStatus.OK).send();
    } catch (error) {
      return res.status(httpStatus.UNAUTHORIZED).send({});
    }
  }