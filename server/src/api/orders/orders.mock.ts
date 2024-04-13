import { Book } from "../books/books.mock";
import { faker } from "@faker-js/faker";
import { data as booksMockupData } from "../books/books.mock";
import { getRandomNumber } from "@/lib/utils";
export type ItemOrder = {
  book: Book;
  quantity: number;
  subtotal: number;
};
export type Orders = {
  id: string;
  customer: {
    firstName: string;
    lastName?: string;
    email: string;
    phone?: string;
  };
  items: ItemOrder[];
  date: Date | string;
};

export const ordersMockupData: Orders[] = Array.from({ length: 100 }, () => ({
  id: crypto.randomUUID(),
  customer: {
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: faker.internet.email(),
    phone: faker.phone.number(),
  },
  items: Array.from({ length: getRandomNumber(1, 10) }, () => {
    const indexItem = getRandomNumber(0, booksMockupData.length);
    const book = booksMockupData[indexItem];
    const quantity = getRandomNumber(1, 100);
    return {
      book,
      quantity,
      subtotal: quantity * book.price.amount,
    };
  }),
  date: faker.date.recent(),
}));
