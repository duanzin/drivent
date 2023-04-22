import { NextFunction, Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares';
import hotelsService from '@/services/hotels-service';
import { Hotel } from '@prisma/client';
import { HotelRooms } from '@/protocols';

export async function getAllHotels(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const hotels: Hotel[] = await hotelsService.getHotels();
    return res.status(httpStatus.OK).send(hotels);
  } catch (error) {
    next(error);
  }
}

export async function getHotelRooms(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const hotelId: number = parseInt(req.params.hotelId);
    const hotelRooms: HotelRooms = await hotelsService.getHotelRooms(hotelId);
    return res.status(httpStatus.OK).send(hotelRooms);
  } catch (error) {
    next(error);
  }
}