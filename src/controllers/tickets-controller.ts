import { Request, Response } from 'express';
import httpStatus from 'http-status';

export async function getTicketTypes(req: Request, res: Response) {
    try {
      return res.status(httpStatus.OK).send();
    } catch (error) {
      return res.status(httpStatus.UNAUTHORIZED).send({});
    }
  }

export async function getUserTickets(req: Request, res: Response) {
    try {
      return res.status(httpStatus.OK).send();
    } catch (error) {
      return res.status(httpStatus.UNAUTHORIZED).send({});
    }
  }

export async function createUserTicket(req: Request, res: Response) {
    try {
      return res.status(httpStatus.OK).send();
    } catch (error) {
      return res.status(httpStatus.UNAUTHORIZED).send({});
    }
  }