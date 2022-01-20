const express = require("express");
const app = express();
require("./db/mongoose");
const productsRoute = require("./routers/product.route");

app.use(express.json());
app.use(productsRoute);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("listen on port " + PORT);
});
