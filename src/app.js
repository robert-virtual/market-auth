require("dotenv").config();
const cors = require("cors");
const express = require("express");
const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());
app.use(cors());

app.use("/auth", require("./routes/auth"));

app.listen(port, () => {
  console.log(`server running on port  ${port}...`);
});
