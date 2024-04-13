import express from "express";
import bookRoutes from "./api/books/books.route";
import ordersRoutes from "./api/orders/orders.route";
import orderItemsRoutes from "./api/order-items/order-items.route";
const router = express.Router();

router.get("/", async (req, res) => {
  res.json({
    statusCode: 200,
    statusMessage: "OK",
    success: true,
    message: "Successfull",
  });
});
router.use("/books", bookRoutes);
router.use("/orders", ordersRoutes);
router.use("/order-items", orderItemsRoutes);

export default router;
