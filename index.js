const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const http = require("http").Server(app);
const connectToMongo=require("./DataContext/Db")

connectToMongo()
app.use(bodyParser.json());
app.use(cors());

app.get("/", (req, res) => {
  res.status(200).send("Api is Working fine");
});


app.use("/users", require("./Controller/UserController"));
app.use("/form", require("./Controller/FormController"));



http.listen(5000, () => console.log("listening on port: 5000"));
