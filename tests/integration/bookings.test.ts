import faker from '@faker-js/faker';
import { TicketStatus } from '@prisma/client';
import httpStatus from 'http-status';
import * as jwt from 'jsonwebtoken';
import supertest from 'supertest';
import {
  createEnrollmentWithAddress,
  createUser,
  createTicket,
  TicketTypeForHotelTest,
  createHotel,
  createRoom,
  createBooking,
} from '../factories';
import { cleanDb, generateValidToken } from '../helpers';
import app, { init } from '@/app';

beforeAll(async () => {
  await init();
});

beforeEach(async () => {
  await cleanDb();
});

const server = supertest(app);

describe('GET /bookings', () => {
    it('should respond with status 401 if no token is given', async () => {
      const response = await server.get('/bookings');
  
      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });
  
    it('should respond with status 401 if given token is not valid', async () => {
      const token = faker.lorem.word();
  
      const response = await server.get('/bookings').set('Authorization', `Bearer ${token}`);
  
      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });
  
    it('should respond with status 401 if there is no session for given token', async () => {
      const userWithoutSession = await createUser();
      const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);
  
      const response = await server.get('/bookings').set('Authorization', `Bearer ${token}`);
  
      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });
  
    describe('when token is valid', () => {
      it('should respond with status 404 when booking isnt found', async () => {
        const user = await createUser();
        const token = await generateValidToken(user);
  
        const response = await server.get(`/bookings`).set('Authorization', `Bearer ${token}`);
  
        expect(response.status).toEqual(httpStatus.NOT_FOUND);
      });
  
      it('should respond with status 200 and booking id with booked room when booking is found', async () => {
        const user = await createUser();
        const token = await generateValidToken(user);
        const hotel = await createHotel();
        const room = await createRoom(hotel.id);
        await createBooking(user.id, room.id);
  
        const response = await server.get(`/bookings`).set('Authorization', `Bearer ${token}`);
  
        expect(response.status).toEqual(httpStatus.OK);
        expect(response.body).toEqual({
            id: expect.any(Number),
            Room: {
                id: expect.any(Number),
                name: expect.any(String),
                capacity: expect.any(Number),
                hotelId: expect.any(Number),
                createdAt: expect.any(String),
                updatedAt: expect.any(String),
            }
        });
      });
    });
  });

describe('POST /bookings', () => {
    it('should respond with status 401 if no token is given', async () => {
      const response = await server.post('/bookings');
  
      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });
  
    it('should respond with status 401 if given token is not valid', async () => {
      const token = faker.lorem.word();
  
      const response = await server.post('/bookings').set('Authorization', `Bearer ${token}`);
  
      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });
  
    it('should respond with status 401 if there is no session for given token', async () => {
      const userWithoutSession = await createUser();
      const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);
  
      const response = await server.post('/bookings').set('Authorization', `Bearer ${token}`);
  
      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });
  
    describe('when token is valid', () => {
        it('should respond with status 400 when body is not present', async () => {
            const token = await generateValidToken();
      
            const response = await server.post('/bookings').set('Authorization', `Bearer ${token}`);
      
            expect(response.status).toBe(httpStatus.BAD_REQUEST);
          });
      
        it('should respond with status 400 when body is not valid', async () => {
            const token = await generateValidToken();
            const body = { roomId: faker.lorem.word() };
      
            const response = await server.post('/bookings').set('Authorization', `Bearer ${token}`).send(body);
      
            expect(response.status).toBe(httpStatus.BAD_REQUEST);
          });
    
    describe('when body is valid', () => {
      function generateBody (roomId: number) {
            return {
              roomId: roomId
            };
        }

      it('should respond with status 404 when user doesnt have an enrollment yet', async () => {
        const token = await generateValidToken();
        const body = { roomId: faker.datatype.number() };

        const response = await server.post('/bookings').set('Authorization', `Bearer ${token}`).send(body);
  
        expect(response.status).toEqual(httpStatus.NOT_FOUND);
      });
  
      it('should respond with status 404 when user doesnt have a ticket yet', async () => {
        const user = await createUser();
        const token = await generateValidToken(user);
        await createEnrollmentWithAddress(user);
        const body = { roomId: faker.datatype.number() };
  
        const response = await server.post('/bookings').set('Authorization', `Bearer ${token}`).send(body);
  
        expect(response.status).toEqual(httpStatus.NOT_FOUND);
      });
  
      it('should respond with status 402 when ticket isnt paid yet', async () => {
        const user = await createUser();
        const token = await generateValidToken(user);
        const enrollment = await createEnrollmentWithAddress(user);
        const ticketType = await TicketTypeForHotelTest(false, true);
        await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);
        const body = { roomId: faker.datatype.number() };
  
        const response = await server.post(`/bookings`).set('Authorization', `Bearer ${token}`).send(body);
  
        expect(response.status).toEqual(httpStatus.PAYMENT_REQUIRED);
      });
  
      it('should respond with status 402 when ticket is remote', async () => {
        const user = await createUser();
        const token = await generateValidToken(user);
        const enrollment = await createEnrollmentWithAddress(user);
        const ticketType = await TicketTypeForHotelTest(true, true);
        await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
        const body = { roomId: faker.datatype.number() };
  
        const response = await server.post(`/bookings`).set('Authorization', `Bearer ${token}`).send(body);
  
        expect(response.status).toEqual(httpStatus.PAYMENT_REQUIRED);
      });
  
      it('should respond with status 402 when ticket doenst include hotel', async () => {
        const user = await createUser();
        const token = await generateValidToken(user);
        const enrollment = await createEnrollmentWithAddress(user);
        const ticketType = await TicketTypeForHotelTest(false, false);
        await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
        const body = { roomId: faker.datatype.number() };
  
        const response = await server.post(`/bookings`).set('Authorization', `Bearer ${token}`).send(body);
  
        expect(response.status).toEqual(httpStatus.PAYMENT_REQUIRED);
      });
  
      it('should respond with status 404 when room isnt found', async () => {
        const user = await createUser();
        const token = await generateValidToken(user);
        const enrollment = await createEnrollmentWithAddress(user);
        const ticketType = await TicketTypeForHotelTest(false, true);
        await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
        const body = { roomId: faker.datatype.number() };
  
        const response = await server.post(`/bookings`).set('Authorization', `Bearer ${token}`).send(body);
  
        expect(response.status).toEqual(httpStatus.NOT_FOUND);
      });
  
      it('should respond with status 403 when room isnt available', async () => {
        const user = await createUser();
        const token = await generateValidToken(user);
        const enrollment = await createEnrollmentWithAddress(user);
        const ticketType = await TicketTypeForHotelTest(false, true);
        await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
        const hotel = await createHotel();
        const room = await createRoom(hotel.id);
        const body = { roomId: room.id };
  
        const response = await server.post(`/bookings`).set('Authorization', `Bearer ${token}`).send(body);
  
        expect(response.status).toEqual(httpStatus.FORBIDDEN);
      });
     });
    });
  });