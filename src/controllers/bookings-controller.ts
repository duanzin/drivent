import { NextFunction, Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares';
import bookingsService from '@/services/bookings-service';
import { userBooking } from '@/protocols';
import { badRequestError } from '@/errors/bad-request-error';
import hotelsService from '@/services/hotels-service';
import { isNumberObject } from 'util/types';

export async function showBooking(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const userId = req.userId as number;
    const booking: userBooking = await bookingsService.getBooking(userId);
    return res.status(httpStatus.OK).send(booking);
  } catch (error) {
    next(error);
  }
}

export async function createBooking(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      if (!req.body.roomId || isNaN(req.body.roomId)) throw badRequestError();
      const userId = req.userId as number;
      await hotelsService.verification(userId);
      const roomId: number = req.body.roomId;
      const bookingId = await bookingsService.bookRoom(userId, roomId);
      return res.status(httpStatus.OK).send({bookingId:bookingId});
    } catch (error) {
      next(error);
    }
}

export async function alterBooking(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      if (!req.params.bookingId || !req.body.roomId || isNaN(req.body.roomId)) throw badRequestError();
      const userId = req.userId as number;
      const bookingId: number = parseInt(req.params.bookingId);
      const roomId: number = req.body.roomId;
      await bookingsService.alterBooking(userId, bookingId,roomId);
      return res.status(httpStatus.OK).send({bookingId:bookingId});
    } catch (error) {
      next(error);
    }
  }