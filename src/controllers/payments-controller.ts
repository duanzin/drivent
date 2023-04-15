import { CardData } from '@/protocols';
import paymentsService from '@/services/payments-service';
import { Payment } from '@prisma/client';
import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';

export async function getPaymentInfo(req: Request, res: Response, next: NextFunction) {
    if(!req.query.ticketId) return res.status(httpStatus.BAD_REQUEST);
    const ticketId = req.query.ticketId as string;
    const userId = res.locals.userId as number;
    try {
      const payment: Payment = await paymentsService.getPaymentInfo(parseInt(ticketId), userId);
      return res.status(httpStatus.OK).send(payment);
    } catch (error) {
      next(error);
    }
  }

export async function payTicket(req: Request, res: Response, next: NextFunction) {
    if(!req.body.ticketId || !req.body.cardData) return res.status(httpStatus.BAD_REQUEST);
    const ticketId = req.body.ticketId as number;
    const cardData: CardData = req.body.cardData;
    const userId = res.locals.userId as number;
    try {
      const payment: Payment = await paymentsService.payTicket(cardData, ticketId, userId);
      return res.status(httpStatus.OK).send(payment);
    } catch (error) {
      next(error);
    }
  }