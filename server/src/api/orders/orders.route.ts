import express from "express";
import {
  deleteMany,
  deleteSingle,
  findAll,
  findById,
  store,
  update,
} from "./orders.service";
import { Orders } from "./orders.mock";

const router = express.Router();

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
  const order: Orders = req.body;
  const response = await store(order);
  res.status(response.statusCode).json(response);
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const order: Orders = req.body;
  const response = await update(id, order);
  res.status(response.statusCode).json(response);
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  const response = await deleteSingle(id);
  res.status(response.statusCode).json(response);
});

router.delete("/delete", async (req, res) => {
  const orders: Orders[] = req.body;
  const response = await deleteMany(orders);
  res.status(response.statusCode).json(response);
});

export default router;
