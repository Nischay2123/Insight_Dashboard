import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./src/utils/db.js";
import cors from 'cors';
import tabRoutes from './src/routes/tab.routes.js';
import itemRoutes from './src/routes/item.route.js';

dotenv.config();

const app = express();
const corsOptions = {
    origin: [
      "http://localhost:5501",
      "http://localhost:5173",
      process.env.CLIENT_URL,
    ],
    methods: ["GET", "POST", "PUT", "DELETE"]
};


app.use(express.json());
app.use(cors(corsOptions));

(async () => {
  await connectDB();
  console.log("DB Ready");
})();

app.get("/", (req, res) => {
  res.send("Welcome to Server");
});

app.use("/api/v1",tabRoutes)
app.use("/api/v1",itemRoutes)

app.listen(8000, () => {
  console.log("Server running on port 8000");
});
