import faker from '@faker-js/faker';
import { prisma } from '@/config';

export async function createHotel() {
  return prisma.hotel.create({
    data: {
      name: faker.datatype.string(),
      image: faker.image.business(),
    },
  });
}

export async function createRoom(hotelId: number) {
  return prisma.room.create({
    data: {
      name: faker.datatype.string(),
      capacity: faker.datatype.number(),
      hotelId,
    },
  });
}

export async function createUnavailableRoom(hotelId: number) {
  return prisma.room.create({
    data: {
      name: faker.datatype.string(),
      capacity: 0,
      hotelId,
    },
  });
}