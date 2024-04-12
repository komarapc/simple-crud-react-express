import express from "express";
import bookRoutes from "./books/books.route";
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

export default router;
