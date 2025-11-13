import "dotenv/config";
import mongoose from "mongoose";
import express from "express";
import morgan from "morgan";
import userRoutes from "./routes/userRoutes.js";
import ticketRoutes from "./routes/ticketsRoutes.js";
import error from "./middlewares/error.js";

const app = express();
const DB_URL =
  process.env.NODE_ENV === "test"
    ? "mongodb://localhost:27017/ticketing-db-test"
    : process.env.DB_URL || "mongodb://localhost:27017/ticketing-db";
/* const DB_URL = process.env.DB_URL || "mongodb://localhost:27017/ticketing"; */

mongoose
  .connect(DB_URL)
  .then(() => console.log(`Connected to DB: ${DB_URL}`))
  .catch((err) => console.error("Failed to connect to MongoDB", err));

app.use(morgan("dev"));
app.use(express.json());
app.get("/", (req, res) => {
  req.status(200).send("pong");
});

app.use("/api/users", userRoutes);
app.use("/api/tickets", ticketRoutes);
app.use(error);

export default app;
