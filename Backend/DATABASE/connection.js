const mongoose = require("mongoose");

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MONGODB CONNECTED SUCCESSFULLY!!"))
  .catch((error) => console.log(error.message));
