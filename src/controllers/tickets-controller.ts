import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import ticketsService from '@/services/tickets-service';

export async function getTicketTypes(req: Request, res: Response, next: NextFunction) {
  try {
    const ticketTypes = ticketsService.getTicketTypes();
    return res.status(httpStatus.OK).send(ticketTypes);
  } catch (error) {
    console.log(error);
    next(error);
  }
}

export async function getUserTickets(req: Request, res: Response, next: NextFunction) {
  const userId = res.locals.userId as number;
  try {
    const ticket = ticketsService.getUserTicket(userId);
    return res.status(httpStatus.OK).send(ticket);
  } catch (error) {
    console.log(error);
    next(error);
  }
}

export async function createUserTicket(req: Request, res: Response, next: NextFunction) {
  const userId = res.locals.userId as number;
  const ticketTypeId = req.body as number;
  try {
    const newTicket = ticketsService.createUserTicket(userId, ticketTypeId);
    return res.status(httpStatus.CREATED).send(newTicket);
  } catch (error) {
    console.log(error);
    next(error);
  }
}
