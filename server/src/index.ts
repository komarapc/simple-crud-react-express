import express from 'express';
import dotenv from 'dotenv';
const app = express();
dotenv.config();

const port = process.env.PORT || 3000
console.log('port', port)

// create a async simple route
app.get('/', async (req, res) => {
  res.send('Hello World!');
});

// start the server
app.listen(3000, async() => {
  console.log(`Server started at http://localhost:${port} 🚀`);
});