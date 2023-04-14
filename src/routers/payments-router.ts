import { getPaymentInfo, payTicket } from '@/controllers';
import { authenticateToken } from '@/middlewares';
import { Router } from 'express';

const paymentsRouter = Router();

paymentsRouter.get('/', authenticateToken, getPaymentInfo);
paymentsRouter.post('/process', authenticateToken, payTicket);

export { paymentsRouter };