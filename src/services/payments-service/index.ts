import { Payment } from '@prisma/client';
import { notFoundError, unauthorizedError } from '@/errors';
import { CardData } from '@/protocols';
import paymentRepository from '@/repositories/payment-repository';

async function getPaymentInfo(ticketId: number, userId: number): Promise<Payment> {
  const payer: boolean = await paymentRepository.verifyPayerId(ticketId, userId);
  if (payer === undefined) throw notFoundError();
  if (payer === false) throw unauthorizedError();

  const payment: Payment = await paymentRepository.getPaymentInfo(ticketId);
  if (!payment) throw notFoundError();

  return payment;
}

async function payTicket(cardData: CardData, ticketId: number, userId: number): Promise<Payment> {
  const payer: boolean = await paymentRepository.verifyPayerId(ticketId, userId);
  if (payer === undefined) throw notFoundError();
  if (payer === false) throw unauthorizedError();

  const value: number = await paymentRepository.getTicketPrice(ticketId);
  if (!value) throw notFoundError();
  const payment: Payment = await paymentRepository.postPayment(
    ticketId,
    value,
    cardData.issuer,
    cardData.number.toString().slice(-4),
  );

  return payment;
}

const paymentsService = {
  getPaymentInfo,
  payTicket,
};

export default paymentsService;
