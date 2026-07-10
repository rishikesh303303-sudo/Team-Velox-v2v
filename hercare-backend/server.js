require("dotenv").config();
const express = require("express");
const cors = require("cors");

const analyzeRoute = require("./routes/analyze");
const careplanRoute = require("./routes/careplan");

const app = express();

// CORS configure kiya hai taaki sirf tera frontend connect ho sake
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true
}));

app.use(express.json());

app.use("/api", analyzeRoute);
app.use("/api", careplanRoute);

app.get("/", (req, res) => {
  res.send("Server is running ✅");
});

// Port ke liye process.env.PORT use karna zaroori hai
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});