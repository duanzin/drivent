import { Hotel } from '@prisma/client';
import { prisma } from '@/config';
import { HotelRooms } from '@/protocols';

async function getHotels(): Promise<Hotel[]> {
  const hotels: Hotel[] = await prisma.hotel.findMany();
  return hotels;
}

async function getHotelRooms(hotelId: number): Promise<HotelRooms> {
  const hotelRooms: HotelRooms = await prisma.hotel.findUnique({
    where: {
      id: hotelId,
    },
    select: {
      id: true,
      name: true,
      image: true,
      createdAt: true,
      updatedAt: true,
      Rooms: true,
    },
  });

  return hotelRooms;
}

const hotelRepository = {
  getHotels,
  getHotelRooms,
};

export default hotelRepository;
