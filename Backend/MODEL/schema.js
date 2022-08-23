const mongoose = require("mongoose");

const user = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "PLEASE PROVIDE A VALID USERNAME!!"],
    },
    email: {
      type: String,
      required: [true, "PLEASE PROVIDE A VALID EMAIL!!"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "PLEASE PROVIDE A VALID PASSWORD!!"],
    },
    role: {
      type: Number,
      default: 0,
    },
    avatar: {
      type: String,
      default:
        "https://res.cloudinary.com/abdulmateen/image/upload/v1659022550/cld-sample-2.jpg",
    },
  },
  {
    timestamps: true,
  }
);

const newUser = new mongoose.model("User", user);
module.exports = newUser;
