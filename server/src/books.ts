import expres from "express";
import { faker } from "@faker-js/faker";
const router = expres.Router();

type Book = {
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

const data: Book[] = Array.from({ length: 1000 }, () => ({
  id: crypto.randomUUID(),
  title: faker.lorem.words(),
  author: faker.person.fullName(),
  description: faker.lorem.paragraph(),
  publishedDate: faker.date.past(),
  totalSales: Math.floor(Math.random() * 1000),
  price: {
    amount: Math.floor(Math.random() * 100),
    currency: "USD",
  },
}));

router.get("/", async (req, res) => {
  res.json(data);
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const book = data.find((book) => book.id === id);
  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }
  res.json(book);
});

router.post("/", async (req, res) => {
  try {
    const book: Book = req.body;
    book.id = crypto.randomUUID();
    book.price.currency = "USD";
    book.publishedDate = faker.date.past();

    data.push(book);
    res.json(book);
  } catch (error) {
    console.log({ error });
    res.status(400).json({ message: "Invalid request" });
  }
});

router.post("/delete", async (req, res) => {
  try {
    const book: Book[] = req.body;
    book.forEach((book) => {
      const index = data.findIndex((b) => b.id === book.id);
      if (index !== -1) {
        data.splice(index, 1);
      }
    });
    res.json({ message: "Book deleted" });
  } catch (error) {
    console.log({ error });
    res.status(400).json({ message: "Invalid request" });
  }
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const book: Book = req.body;
  const findBook = data.find((book) => book.id === id);
  if (!findBook) {
    return res.status(404).json({ message: "Book not found" });
  }
  Object.assign(findBook, book);
  res.json(findBook);
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  const index = data.findIndex((book) => book.id === id);
  if (index === -1) {
    return res.status(404).json({ message: "Book not found" });
  }
  data.splice(index, 1);
  res.json({ message: "Book deleted" });
});

export default router;
