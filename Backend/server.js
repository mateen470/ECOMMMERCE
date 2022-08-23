const dotenv = require("dotenv");
dotenv.config({ path: "config.env" });

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieparser = require("cookie-parser");
const fileUpload = require("express-fileupload");

require("./DATABASE/connection");

const router = require("./ROUTES/router");
const image_router = require("./ROUTES/imageUploadRoute");

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieparser());
app.use(
  fileUpload({
    useTempFiles: true,
  })
);

app.use("/shoe-cosmos", router);
app.use("/shoe-cosmos/avatar", image_router);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`SERVER HAS STARTED AT http://localhost:${PORT}`);
});
