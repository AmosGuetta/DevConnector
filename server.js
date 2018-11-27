//lsof -i :5000 ==> kill -9 <pid>
//npm run server -> nodemon running.

const express = require("express");

const port = process.env.PORT || 5000;
const app = express();

app.get("/", (req, res) => {
  res.send("Hello from ");
});

app.listen(port, () => {
  console.log("Server running on port:", port);
});
