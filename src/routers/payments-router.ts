import { Router } from 'express';
import { getPaymentInfo, payTicket } from '@/controllers';
import { authenticateToken } from '@/middlewares';

const paymentsRouter = Router();

paymentsRouter.get('/', authenticateToken, getPaymentInfo);
paymentsRouter.post('/process', authenticateToken, payTicket);

export { paymentsRouter };
