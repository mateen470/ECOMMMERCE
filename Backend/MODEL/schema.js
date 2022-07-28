const mongoose = require("mongoose");
const user = new mongoose.Schema({});
const User = new mongoose.model(User, user);

module.exports = User;
