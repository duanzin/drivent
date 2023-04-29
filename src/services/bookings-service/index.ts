import { notFoundError } from '@/errors';
import bookingRepository from '@/repositories/booking-repository';
import { userBooking } from '@/protocols';
import { forbiddenError } from '@/errors/forbidden-error';

async function getBooking(userId: number): Promise<userBooking> {
    const booking: userBooking = await bookingRepository.getBooking(userId);
    if (!booking) throw notFoundError();
    return booking;
  }

async function bookRoom(userId: number, roomId: number): Promise<number> {
    const room = await bookingRepository.verifyRoom(roomId);
    if (!room) throw notFoundError();
    if(room.capacity <= room.Booking.length) throw forbiddenError();
    const bookingId: number = await bookingRepository.bookRoom(userId, roomId);
    return bookingId;
  }

async function alterBooking(userId: number,bookingId: number, roomId: number) {
  console.log(bookingId);
  const bookingUserId = await bookingRepository.verifyBooking(bookingId);
  console.log(bookingUserId);
  if(!bookingUserId || bookingUserId !== userId) throw forbiddenError();
  const room = await bookingRepository.verifyRoom(roomId);
  if(!room) throw notFoundError();
  if(room.capacity <= room.Booking.length) throw forbiddenError();
  await bookingRepository.changeBookedRoom(bookingId,roomId);
}

  const bookingsService = {
    getBooking,
    bookRoom,
    alterBooking
  };
  
  export default bookingsService;