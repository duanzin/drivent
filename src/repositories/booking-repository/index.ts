import { Booking, Room } from '@prisma/client';
import { prisma } from '@/config';
import { roomBooking, userBooking } from '@/protocols';

async function getBooking(userId: number): Promise<userBooking>{
    const booking: userBooking = await prisma.booking.findFirst({
        where:{
            userId: userId,
        },
        select:{
            id: true,
            userId: false,
            roomId: false,
            createdAt: false,
            updatedAt: false,
            Room: true,
        }
    });
  
    return booking;
  }

async function verifyRoom(roomId: number): Promise<roomBooking>{
    const room: roomBooking = await prisma.room.findUnique({
        where:{
            id: roomId,
        },
        select:{
            capacity: true,
            Booking: true,
        }
    });
    
    return room;
  }

async function bookRoom(userId: number, roomId: number){
    const booking: Booking = await prisma.booking.create({
        data:{
            userId: userId,
            roomId: roomId,
        }
    });
    
    return booking.id;
  }

async function verifyBooking(bookingId: number): Promise<number>{
    const booking: Booking = await prisma.booking.findUnique({
        where:{
            id: bookingId,
        }
    });
    return booking.userId;
  }

async function changeBookedRoom(bookingId: number,roomId: number){
    await prisma.booking.update({
        where:{
            id: bookingId,
        },
        data:{
            roomId: roomId,
        }
    });
  }

  const bookingRepository = {
    getBooking,
    verifyRoom,
    bookRoom,
    verifyBooking,
    changeBookedRoom
  };
  
  export default bookingRepository;