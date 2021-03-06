const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const register = require("./controllers/register");
const signin = require("./controllers/signin");
const profile = require("./controllers/profile");
const image = require("./controllers/image");
const db = require("knex")({
  client: "pg",
  connection: {
    connectionString: process.env.DATABASE_URL,
    ssl: true
  }
});
const bcrypt = require("bcrypt"),
  saltRounds = 10;

app.use(bodyParser.json());
app.use(cors());

// get data
app.get("/", (req, res) => res.send("it is working "));
// image endpoint
app.post("/signin", (req, res) => signin.handleSignin(req, res, db, bcrypt));

// register endpoint
app.post("/register", (req, res) =>
  register.handleRegister(req, res, db, bcrypt, saltRounds)
);

// profile endpoint
app.get("/profile/:id", (req, res) => profile.handleProfile(req, res, db));

// image enpoint
app.put("/image", (req, res) => image.putImage(req, res, db));
app.post("/imageUrl", (req, res) => image.handleApiCall(req, res));

// start server
app.listen(process.env.PORT || 3000, () => console.log("i'm listening "));
