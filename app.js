const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const userRoutes = require("./routes/user");

const app = express();

mongoose
    .connect(
        "mongodb+srv://99thoughts:" +
        process.env.MONGO_ATLAS_PW +
        "@99thoughts-lpe5s.mongodb.net/octavius?retryWrites=true&w=majority",
        {useUnifiedTopology: false, useNewUrlParser: true}
    )
    .then(() => {
      console.log("Connected to database!");
    })
    .catch((err) => {
      console.log("Connection failed!" + err);
    });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, PATCH, PUT, DELETE, OPTIONS"
  );
  next();
});

app.use("/api/user", userRoutes);

module.exports = app;
