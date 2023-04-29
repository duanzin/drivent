import { Router } from 'express';
import { authenticateToken } from '@/middlewares';
import { alterBooking, createBooking, showBooking } from '@/controllers';

const bookingsRouter = Router();

bookingsRouter.get('/', authenticateToken, showBooking);
bookingsRouter.post('/', authenticateToken, createBooking);
bookingsRouter.put('/:bookingId', authenticateToken, alterBooking);

export { bookingsRouter };