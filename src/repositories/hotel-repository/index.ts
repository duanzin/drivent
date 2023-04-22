import { Hotel } from '@prisma/client';
import { prisma } from '@/config';
import { HotelRooms } from '@/protocols';

async function getHotels(): Promise<Hotel[]> {
  const hotels: Hotel[] = await prisma.hotel.findMany();
  return hotels;
}

async function getEnrollment(userId: number) {
  const enrollment = await prisma.enrollment.findUnique({
    where: {
      userId: userId,
    },
  });

  if (enrollment === null) return null;
  return enrollment.id;
}

async function getHotelRooms(hotelId: number): Promise<HotelRooms>{
  const hotelRooms: HotelRooms = await prisma.hotel.findUnique({
    where: {
      id: hotelId,
    },
    include: {
      Rooms: true
    },
  });

  return hotelRooms;
}

const hotelRepository = {
    getHotels,
    getHotelRooms
  };
  
  export default hotelRepository;