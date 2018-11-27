//lsof -i :5000 ==> kill -9 <pid>
//npm run server -> nodemon running.

const express = require("express"),
  mongoose = require("mongoose"),
  bodyParser = require("body-parser");

const users = require("./routes/api/users");
const profile = require("./routes/api/profile");
const posts = require("./routes/api/posts");
const app = express();

//Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//DB config
const db = require("./config/keys").mongoURL;

//Connect to MongoDB
mongoose
  .connect(
    db,
    { useNewUrlParser: true }
  )
  .then(() => console.log("mongoDB Connected"))
  .catch(err => console.log("Error from mongoose connect :", err));

app.get("/", (req, res) => {
  res.send("Hello from ");
});

//User Routes

app.use("/api/users", users);
app.use("/api/profile", profile);
app.use("/api/posts", posts);
const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log("Server running on port:", port);
});
