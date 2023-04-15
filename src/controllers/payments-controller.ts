import { Payment } from '@prisma/client';
import { NextFunction, Response } from 'express';
import httpStatus from 'http-status';
import paymentsService from '@/services/payments-service';
import { CardData } from '@/protocols';
import { badRequestError } from '@/errors/bad-request-error';
import { AuthenticatedRequest } from '@/middlewares';

export async function getPaymentInfo(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    if (!req.query.ticketId) throw badRequestError();
    const ticketId = req.query.ticketId as string;
    const userId = req.userId as number;
    const payment: Payment = await paymentsService.getPaymentInfo(parseInt(ticketId), userId);
    return res.status(httpStatus.OK).send(payment);
  } catch (error) {
    next(error);
  }
}

export async function payTicket(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    if (!req.body.ticketId || !req.body.cardData) throw badRequestError();
    const ticketId = req.body.ticketId as number;
    const cardData: CardData = req.body.cardData;
    const userId = req.userId as number;
    const payment: Payment = await paymentsService.payTicket(cardData, ticketId, userId);
    return res.status(httpStatus.OK).send(payment);
  } catch (error) {
    next(error);
  }
}
