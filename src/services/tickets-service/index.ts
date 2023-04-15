import { TicketType } from '@prisma/client';
import { notFoundError } from '@/errors';
import { TicketOutput } from '@/protocols';
import ticketRepository from '@/repositories/ticket-repository';

async function getTicketTypes(): Promise<TicketType[]> {
  const ticketTypes: TicketType[] = await ticketRepository.getAllTicketTypes();

  return ticketTypes;
}

async function getUserTicket(userId: number): Promise<TicketOutput> {
  const enrollmentId: number = await ticketRepository.getEnrollment(userId);
  if (!enrollmentId) {
    throw notFoundError();
  }
  const ticket: TicketOutput = await ticketRepository.getUserTicket(enrollmentId);
  if (!ticket) {
    throw notFoundError();
  }

  return ticket;
}

async function createUserTicket(userId: number, ticketTypeId: number): Promise<TicketOutput> {
  const enrollmentId: number = await ticketRepository.getEnrollment(userId);
  if (!enrollmentId) {
    throw notFoundError();
  }
  const newTicket: TicketOutput = await ticketRepository.postUserTicket(enrollmentId, ticketTypeId);

  return newTicket;
}

const ticketsService = {
  getTicketTypes,
  getUserTicket,
  createUserTicket,
};

export default ticketsService;
