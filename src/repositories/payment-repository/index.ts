import { Payment } from '@prisma/client';
import { prisma } from '@/config';

async function getPaymentInfo(ticketId: number): Promise<Payment> {
  return await prisma.payment.findFirst({
    where: {
      ticketId: ticketId,
    },
  });
}

async function verifyPayerId(ticketId: number, userId: number): Promise<boolean> {
  const ticket = await prisma.ticket.findUnique({
    where: {
      id: ticketId,
    },
  });
  if (!ticket) {
    return undefined;
  }
  const { id } = await prisma.enrollment.findUnique({
    where: {
      userId: userId,
    },
  });
  if (ticket.enrollmentId === id) {
    return true;
  } else {
    return false;
  }
}

async function getTicketPrice(ticketId: number): Promise<number> {
  const { ticketTypeId } = await prisma.ticket.findUnique({
    where: {
      id: ticketId,
    },
  });
  const { price } = await prisma.ticketType.findUnique({
    where: {
      id: ticketTypeId,
    },
  });
  return price;
}

async function postPayment(
  ticketId: number,
  value: number,
  cardIssuer: string,
  cardLastDigits: string,
): Promise<Payment> {
  await prisma.payment.create({
    data: {
      ticketId: ticketId,
      value: value,
      cardIssuer: cardIssuer,
      cardLastDigits: cardLastDigits,
    },
  });
  await prisma.ticket.update({
    where: {
      id: ticketId,
    },
    data: {
      status: 'PAID',
    },
  });
  return await prisma.payment.findFirst({
    where: {
      ticketId: ticketId,
    },
  });
}

const paymentRepository = {
  getPaymentInfo,
  verifyPayerId,
  getTicketPrice,
  postPayment,
};

export default paymentRepository;
