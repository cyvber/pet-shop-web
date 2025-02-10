const mongoose = require('mongoose');
const { nanoid, customAlphabet} = require('nanoid');


const generate_nonoid = customAlphabet('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz', 6);

const contactSchema = new mongoose.Schema({
    customer_name: { type: String, required: true },
    phone_number: { type: String, required: true },
    email: { type: String },
    city: { type: String, required: true },
    address: { type: String, required: true },
    zip_code: { type: String },
    delivery_instructions: { type: String }
});

const orderItemSchema = new mongoose.Schema({
    product_id: { type: String, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    discount_type: { type: String, default: null } // Add this field
});


const orderSchema = new mongoose.Schema({
    order_id: { type: String, default: () => 'ORD' + generate_nonoid(), unique: true },
    contact_info: { type: contactSchema, required: true },
    order_items: { type: [orderItemSchema], required: true },
    total_price: { type: Number, required: true },
    order_status: { type: String, enum: ['pending', 'shipped', 'completed', 'canceled'], default: 'pending' },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
});

orderSchema.pre('save', function (next) {
    this.updated_at = new Date();
    next();
});

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;


// const mongoose = require('mongoose');

// const orderItemSchema = new mongoose.Schema({
//   product_id: {
//     type: String,
//     required: true,
//   },
//   quantity: {
//     type: Number,
//     required: true,
//   },
//   price: {
//     type: Number,
//     required: true,
//   },
//   total_price: {
//     type: Number,
//     required: true,
//   },
// });

// const contactSchema = new mongoose.Schema({
//   customer_name: {
//     type: String,
//     required: true,
//   },
//   phone: {
//     type: String,
//     required: true,
//   },
//   email: {
//     type: String,
//     required: true,
//   },
//   city: {
//     type: String,
//     required: true,
//   },
//   address: {
//     type: String,
//     required: true,
//   },
//   zip_code: {
//     type: String,
//     required: true,
//   },
//   delivery_instructions: {
//     type: String,
//     default: '',
//   },
// });

// const orderSchema = new mongoose.Schema({
//   id: {
//     type: String,
//     required: true,
//     unique: true,
//   },
//   contact: {
//     type: contactSchema,
//     required: true,
//   },
//   order_status: {
//     type: String,
//     enum: ['pending', 'complete', 'canceled'],
//     default: 'pending',
//   },
//   order_items: {
//     type: [orderItemSchema],
//     required: true,
//   },
//   total_amount: {
//     type: Number,
//     required: true,
//   },
//   date: {
//     type: Date,
//     required: true,
//   },
//   updated_at: {
//     type: Date,
//     default: Date.now,
//   },
// });

// const Order = mongoose.model('Order', orderSchema);

// module.exports = Order;
