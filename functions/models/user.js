const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email: { type: String },
    phone: { type: String }, 
    address: { type: String },
    shipping_price: { type: Number, default: 0 },
    date_created: { type: Date, default: Date.now() },
    last_login: { type: Date },
    tokenExpiration: { type: Date },
});

module.exports = mongoose.model("User", UserSchema);
