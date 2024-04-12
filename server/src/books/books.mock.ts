import { getRandomNumber } from "@/lib/utils";
import { faker } from "@faker-js/faker";

export type Book = {
  id: string;
  title: string;
  author: string;
  description: string;
  publishedDate: Date | string;
  totalSales: number;
  price: {
    amount: number;
    currency: string;
  };
};

export const data: Book[] = Array.from({ length: 1000 }, () => ({
  id: crypto.randomUUID(),
  title: faker.lorem.words(),
  author: faker.person.fullName(),
  description: faker.lorem.paragraph(),
  publishedDate: faker.date.past(),
  totalSales: getRandomNumber(1000, 10000),
  price: {
    amount: getRandomNumber(100, 1000),
    currency: "USD",
  },
}));
