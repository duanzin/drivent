import { Router } from 'express';
import { createUserTicket, getTicketTypes, getUserTickets } from '@/controllers';
import { authenticateToken } from '@/middlewares';

const ticketsRouter = Router();

ticketsRouter.get('/types', authenticateToken, getTicketTypes);
ticketsRouter.get('/', authenticateToken, getUserTickets);
ticketsRouter.post('/', authenticateToken, createUserTicket);

export { ticketsRouter };
