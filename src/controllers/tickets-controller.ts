import { NextFunction, Response } from 'express';
import httpStatus from 'http-status';
import { TicketType } from '@prisma/client';
import ticketsService from '@/services/tickets-service';
import { badRequestError } from '@/errors/bad-request-error';
import { AuthenticatedRequest } from '@/middlewares';
import { TicketOutput } from '@/protocols';

export async function getTicketTypes(req: AuthenticatedRequest, res: Response) {
  try {
    const ticketTypes: TicketType[] = await ticketsService.getTicketTypes();
    return res.status(httpStatus.OK).send(ticketTypes);
  } catch (error) {
    res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR);
  }
}

export async function getUserTickets(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const userId = req.userId as number;
    const userTicket: TicketOutput = await ticketsService.getUserTicket(userId);
    return res.status(httpStatus.OK).send(userTicket);
  } catch (error) {
    next(error);
  }
}

export async function createUserTicket(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    if (!req.body.ticketTypeId) throw badRequestError();
    const userId = req.userId as number;
    const ticketTypeId = req.body.ticketTypeId as number;
    const newTicket: TicketOutput = await ticketsService.createUserTicket(userId, ticketTypeId);
    return res.status(httpStatus.CREATED).send(newTicket);
  } catch (error) {
    next(error);
  }
}
