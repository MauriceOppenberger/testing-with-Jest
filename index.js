const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const port = "8080";

app.use(bodyParser.json());
const apiRoute = require("./routes/api");

app.use("/api", apiRoute);

module.exports = app;
// app.listen(port, () => {
//   console.log(`listening on port ${port}`);
// });
