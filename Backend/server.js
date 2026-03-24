const express = require("express");
const cors = require("cors");
require("dotenv").config();
const studentRoute = require("./routes/student.routes");
const staffRoute = require('./routes/staff.routes');
const studentmentorRoute = require("./routes/studentmentor.routes");
const studentmentoringRoute = require('./routes/studentmentoring.routes');
const authRoute = require('./routes/auth.routes');
const app = express();

// DB connect
require("./config/db");

app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://your-frontend-url.onrender.com', 'https://your-frontend-url.vercel.app']
    : "http://localhost:5173"
}));
app.use(express.json());

// Routes
app.use("/api/students", studentRoute);
app.use("/api/staff",staffRoute);
app.use("/api/studentmentor",studentmentorRoute);
app.use("/api/studentmentoring",studentmentoringRoute);
app.use("/api/auth",authRoute);

app.get("/", (req, res) => {
  res.send("Express + MySQL backend running");
});

app.listen(process.env.PORT, () => {
  console.log(`Server running @${process.env.PORT}`);
});
