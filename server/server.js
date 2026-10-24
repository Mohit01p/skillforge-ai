const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();
app.use(
  cors({
    origin: [process.env.CLIENT_URL, "http://localhost:5173"].filter(Boolean),
  })
);
app.use(express.json());

app.get("/", (req, res) => res.send("API running"));

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/user", require("./routes/userRoutes"));
app.use("/api/progress", require("./routes/progressRoutes"));
app.use("/api/ai", require("./routes/aiRoutes"));
app.use("/api/interview", require("./routes/interviewRoutes"));
app.use("/api/document", require("./routes/documentRoutes"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));