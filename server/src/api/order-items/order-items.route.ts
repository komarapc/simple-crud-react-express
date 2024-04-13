import express from "express";
import { deleteSingle, findById, store, update } from "./order-items.service";
import { ItemOrder } from "../orders/orders.mock";

const router = express.Router();
router.get("/:orderId/:id", async (req, res) => {
  const { orderId, id } = req.params;
  const response = await findById({ id, orderId });
  res.status(response.statusCode).json(response);
});
router.post("/:orderId", async (req, res) => {
  const { orderId } = req.params;
  const items: ItemOrder[] = req.body;
  const response = await store({ id: orderId, itemOrders: items });
  res.status(response?.statusCode).json(response);
});
router.put("/:orderId/:id", async (req, res) => {
  const { orderId, id } = req.params;
  const itemOrders: ItemOrder = req.body;
  const response = await update({ orderId, id, itemOrders });
  res.status(response.statusCode).json(response);
});
router.delete("/:orderId/:id", async (req, res) => {
  const { orderId, id } = req.params;
  const response = await deleteSingle({ orderId, id });
  res.status(response.statusCode).json(response);
});
router.delete("/:orderId", async (req, res) => {
  const { orderId } = req.params;
  const items = req.body;
  const response = await deleteSingle({ id: orderId, itemOrders: items });
  res.status(response.statusCode).json(response);
});
export default router;
