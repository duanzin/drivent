import { TicketType } from '@prisma/client';
import { prisma } from '@/config';
import { TicketOutput } from '@/protocols';

async function getAllTicketTypes(): Promise<TicketType[]> {
  return await prisma.ticketType.findMany();
}

async function getEnrollment(userId: number) {
  const { id } = await prisma.enrollment.findUnique({
    where:{
      userId: userId,
    }
  });

  return id;
}

async function getUserTicket(enrollmentId: number): Promise<TicketOutput>{
  return await prisma.ticket.findUnique({
    where:{
      enrollmentId: enrollmentId,
    },
    select: {
      id: true,
      status: true,
      ticketTypeId: true,
      enrollmentId: true,
      TicketType: {
        select:{
          id: true,
          name: true,
          price: true,
          isRemote: true,
          includesHotel: true,
          createdAt: true,
          updatedAt: true,
        },
      },
      createdAt: true,
      updatedAt: true
      },
    });
  }

async function postUserTicket(enrollmentId: number, ticketTypeId: number): Promise<TicketOutput>{
  await prisma.ticket.upsert({
    where:{
      enrollmentId: enrollmentId || 0,
    },
    create:{
      ticketTypeId: ticketTypeId,
      enrollmentId: enrollmentId,
      status: "RESERVED",
    },
    update:{
      ticketTypeId: ticketTypeId,
      enrollmentId: enrollmentId,
      status: "RESERVED",
    }
  });

  return await prisma.ticket.findUnique({
    where:{
      enrollmentId: enrollmentId,
    },
    select: {
      id: true,
      status: true,
      ticketTypeId: true,
      enrollmentId: true,
      TicketType: {
        select:{
          id: true,
          name: true,
          price: true,
          isRemote: true,
          includesHotel: true,
          createdAt: true,
          updatedAt: true,
        },
      },
      createdAt: true,
      updatedAt: true
      },
    });
}



const ticketRepository = {
  getAllTicketTypes,
  getEnrollment,
  getUserTicket,
  postUserTicket
};
  
export default ticketRepository;