require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const app = express();
const authRoutes = require("./routes/auth");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");

// Routes

// DB connection
mongoose.connect(process.env.DATABASE).then(() => {
  console.log("DB CONNECTED");
});

//Middlewares
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());

// app.get("/", (req, res) => {
//   res.send("hellow world");
// });

app.use("/api", authRoutes);

// Port
const port = 8000;

// starting server
app.listen(port, () => {
  console.log(`server sunning at PORT ${port}`);
});
