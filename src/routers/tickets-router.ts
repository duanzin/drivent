import { createUserTicket, getTicketTypes, getUserTickets } from '@/controllers';
import { authenticateToken } from '@/middlewares';
import { Router } from 'express';

const ticketsRouter = Router();

ticketsRouter.get('/', authenticateToken, getTicketTypes);
ticketsRouter.get('/types', authenticateToken, getUserTickets);
ticketsRouter.post('/', authenticateToken, createUserTicket);

export { ticketsRouter };