const express = require("express");
const colors = require("colors");
const morgan = require("morgan");
const dotenv = require("dotenv");
const path = require("path");
const cors = require("cors");
const connectToMongo = require("./config/db");

// Load .env
dotenv.config({ path: path.join(__dirname, ".env") });

// Connect DB
connectToMongo();

// Express app
const app = express();

// ✅ CORS (MUST be before routes)
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// Middleware
app.use(express.json());
app.use(morgan("dev"));

// Routes
app.use("/api/v1/user/", require("./routes/userRoute"));

// Port
const PORT = process.env.PORT || 8080;

// Start server
app.listen(PORT, () => {
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.bgCyan.white
  );
});
