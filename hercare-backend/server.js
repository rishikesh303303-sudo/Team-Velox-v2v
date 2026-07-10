require("dotenv").config();
const express = require("express");
const cors = require("cors");

const analyzeRoute = require("./routes/analyze");
const careplanRoute = require("./routes/careplan");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", analyzeRoute);
app.use("/api", careplanRoute);

app.get("/", (req, res) => {
  res.send("Server is running ✅");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});