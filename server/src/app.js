require("dotenv").config();

const express = require("express");
const cors = require("cors");
const apiRoutes = require("./routes");
const connectDB = require("./config/db");
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1", apiRoutes);

const PORT = process.env.PORT;
connectDB();
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});