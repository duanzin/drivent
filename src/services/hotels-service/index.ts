import { Hotel } from '@prisma/client';
import { notFoundError } from '@/errors';
import hotelRepository from '@/repositories/hotel-repository';
import ticketRepository from '@/repositories/ticket-repository';
import { HotelRooms, TicketOutput } from '@/protocols';
import { paymentRequiredError } from '@/errors/payment-required-error';

async function verification(userId: number) {
  const enrollmentId: number = await ticketRepository.getEnrollment(userId);
  if (enrollmentId === null) throw notFoundError();
  const ticket: TicketOutput = await ticketRepository.getUserTicket(enrollmentId);
  if (ticket === null) throw notFoundError();
  if (ticket.status !== 'PAID' || ticket.TicketType.isRemote === true || ticket.TicketType.includesHotel === false)
    throw paymentRequiredError();
}

async function getHotels(): Promise<Hotel[]> {
  const hotels: Hotel[] = await hotelRepository.getHotels();
  if (hotels.length === 0) throw notFoundError();
  return hotels;
}

async function getHotelRooms(hotelId: number): Promise<HotelRooms> {
  const hotelRooms: HotelRooms = await hotelRepository.getHotelRooms(hotelId);
  if (hotelRooms === null) throw notFoundError();

  return hotelRooms;
}

const hotelsService = {
  getHotels,
  getHotelRooms,
  verification,
};

export default hotelsService;
