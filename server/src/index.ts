import express from "express";
import dotenv from "dotenv";
import mainRoutes from "./router";

const app = express();
dotenv.config();
const port = process.env.PORT || 3000;

// enable cors
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});
// body parser
app.use(
  express.json({
    limit: "1000mb",
  })
);
// create a async simple route

app.use("/", mainRoutes);
// start the server
app.listen(3000, async () => {
  console.log(`Server started at http://localhost:${port} 🚀`);
});
