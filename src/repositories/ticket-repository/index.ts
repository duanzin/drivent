import { TicketType } from '@prisma/client';
import { prisma } from '@/config';
import { TicketOutput } from '@/protocols';

async function getAllTicketTypes(): Promise<TicketType[]> {
  const types: TicketType[] = await prisma.ticketType.findMany();
  return types;
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

async function getUserTicket(enrollmentId: number): Promise<TicketOutput> {
  const ticket = await prisma.ticket.findUnique({
    where: {
      enrollmentId: enrollmentId,
    },
    select: {
      id: true,
      status: true,
      ticketTypeId: true,
      enrollmentId: true,
      TicketType: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if(ticket === null) return null;
  return ticket;
}

async function postUserTicket(enrollmentId: number, ticketTypeId: number): Promise<TicketOutput> {
  await prisma.ticket.upsert({
    where: {
      enrollmentId: enrollmentId,
    },
    create: {
      ticketTypeId: ticketTypeId,
      enrollmentId: enrollmentId,
      status: 'RESERVED',
    },
    update: {
      ticketTypeId: ticketTypeId,
      enrollmentId: enrollmentId,
      status: 'RESERVED',
    },
  });

  return await getUserTicket(enrollmentId);
}

const ticketRepository = {
  getAllTicketTypes,
  getEnrollment,
  getUserTicket,
  postUserTicket,
};

export default ticketRepository;
