import expres from "express";
import { Book } from "./books.mock";
import {
  deleteMany,
  deleteSingle,
  findAll,
  findById,
  store,
  update,
} from "./books.service";
import { responseError } from "@/lib/utils";
const router = expres.Router();

router.get("/", async (req, res) => {
  const response = await findAll();
  res.status(response.statusCode).json(response);
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const response = await findById(id);
  res.status(response.statusCode).json(response);
});

router.post("/", async (req, res) => {
  try {
    const book: Book = req.body;
    const response = await store(book);
    res.status(response.statusCode).json(response);
  } catch (error) {
    res
      .status(400)
      .json(responseError({ errCode: 400, message: "Invalid Request" }));
  }
});

router.post("/delete", async (req, res) => {
  try {
    const book: Book[] = req.body;
    const response = await deleteMany(book);
    res.status(response.statusCode).json(response);
  } catch (error) {
    res
      .status(400)
      .json(responseError({ errCode: 400, message: "Invalid Request" }));
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const book: Book = req.body;
    const response = await update(id, book);
    res.status(response.statusCode).json(response);
  } catch (error) {
    res
      .status(400)
      .json(responseError({ errCode: 400, message: "Invalid Request" }));
  }
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  const response = await deleteSingle(id);
  res.status(response.statusCode).json(response);
});

export default router;
