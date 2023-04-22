import { NextFunction, Response } from 'express';
import httpStatus from 'http-status';
import { Hotel } from '@prisma/client';
import { AuthenticatedRequest } from '@/middlewares';
import hotelsService from '@/services/hotels-service';
import { HotelRooms } from '@/protocols';
import { badRequestError } from '@/errors/bad-request-error';

export async function getAllHotels(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const userId = req.userId as number;
    await hotelsService.verification(userId);
    const hotels: Hotel[] = await hotelsService.getHotels();
    return res.status(httpStatus.OK).send(hotels);
  } catch (error) {
    next(error);
  }
}

export async function getHotelRooms(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const hotelId: number = parseInt(req.params.hotelId);
    const userId = req.userId as number;
    await hotelsService.verification(userId);
    const hotelRooms: HotelRooms = await hotelsService.getHotelRooms(hotelId);
    return res.status(httpStatus.OK).send(hotelRooms);
  } catch (error) {
    next(error);
  }
}
