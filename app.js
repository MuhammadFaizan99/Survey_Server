require("dotenv").config();
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const PORT = process.env.PORT || 3000;
const colors = require("colors");
const { surveyRouter } = require("./routes/surveyRouter");

// middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

// routes
app.use("/", surveyRouter);

// Server Connection
app.listen(PORT, () => {
  console.log(`Listening on ${PORT} `.white.bgGreen);
});