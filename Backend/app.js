import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./src/utils/db.js";
import cors from 'cors';
import routes from "./src/routes/index.route.js"

dotenv.config();

const app = express();
const corsOptions = {
    origin: [
      "http://localhost:5501",
      "http://localhost:5173",
      process.env.CLIENT_URL,
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
};


app.use(express.json());
app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: true }));

(async () => {
  await connectDB();
  console.log("DB Ready");
})();

app.get("/", (req, res) => {
  res.send("Welcome to Server");
});

app.use("/api/v1",routes)

app.listen(8001, () => {
  console.log("Server running on port 8001");
});
