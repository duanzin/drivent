import { Hotel } from '@prisma/client';
import { notFoundError } from '@/errors';
import hotelRepository from '@/repositories/hotel-repository';
import { HotelRooms } from '@/protocols';

async function getHotels(): Promise<Hotel[]> {
  const hotels: Hotel[] = await hotelRepository.getHotels();
  return hotels;
}

async function getHotelRooms(hotelId: number): Promise<HotelRooms>{
  const hotelRooms: HotelRooms = await hotelRepository.getHotelRooms(hotelId);
  if (hotelRooms === null) throw notFoundError();

  return hotelRooms;
}

const hotelsService = {
  getHotels,
  getHotelRooms
};

export default hotelsService;