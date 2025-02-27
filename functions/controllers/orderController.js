const Order = require('../models/order'); 

// exports.placeOrder = async (req, res) => {
//   try {
//       const { contact_info, order_items, total_price } = req.body;


//       // Create new order
//       const newOrder = new Order({
//           contact_info,
//           order_items,
//           total_price
//       });

//       // Save order to database
//       await newOrder.save();

//       res.status(201).json({ message: 'Order placed successfully', order: newOrder });
//   } catch (error) {
//       console.error('Error placing order:', error);
//       res.status(500).json({ message: 'Internal server error', error: error.message });
//   }
// };

const { sendWhatsAppNotification } = require('./TwilioService');
const { getProductNames } = require("./productController"); // Import function

exports.placeOrder = async (req, res) => {
  try {
    const { contact_info, order_items, total_price } = req.body;

    // Create new order
    const newOrder = new Order({
      contact_info,
      order_items,
      total_price
    });

    // Save order to database
    await newOrder.save();

    // Fetch product names
    const productNames = await getProductNames(order_items);

    // Send WhatsApp notification to admin
    const orderDetails = `
      שם: ${contact_info.customer_name}
      סה"כ לתשלום: ₪${total_price}
      מוצרים: ${productNames.join(", ")}
    `;
    sendWhatsAppNotification(orderDetails); // Trigger WhatsApp message

    // Send success response with the new order
    res.status(201).json({ message: "Order placed successfully", order: newOrder });
  } catch (error) {
    console.error("Error placing order:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

exports.getAllOrders = async (req, res) => {
    try {
      const orders = await Order.find();
      res.status(200).json(orders);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching orders', error });
    }
  };
exports.getOrderById = async (req, res) => {
    try {
      const order = await Order.findOne({ id: req.params.id });
      if (!order) return res.status(404).json({ message: 'Order not found' });
      res.status(200).json(order);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching order', error });
    }
  };
  exports.updateOrderStatus = async (req, res) => {
    try {
        const { order_status } = req.body;
        const validStatuses = ['pending', 'completed', 'canceled'];

        if (!validStatuses.includes(order_status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }

        const order = await Order.findOneAndUpdate(
            { order_id: req.params.id }, // Correct field name
            { order_status, updated_at: Date.now() },
            { new: true }
        );

        if (!order) return res.status(404).json({ message: 'Order not found' });

        res.status(200).json({ message: 'Order status updated', order });
    } catch (error) {
        res.status(500).json({ message: 'Error updating order status', error });
    }
};
exports.deleteOrder = async (req, res) => {
    try {
      const order = await Order.findOneAndDelete({ id: req.params.id });
      if (!order) return res.status(404).json({ message: 'Order not found' });
      res.status(200).json({ message: 'Order deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting order', error });
    }
  };
exports.getOrdersByStatus = async (req, res) => {
    try {
      const orders = await Order.find({ order_status: req.params.status });
      res.status(200).json(orders);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching orders by status', error });
    }
  };
exports.searchOrdersByDate = async (req, res) => {
    const { startDate, endDate } = req.body;
  
    try {
      const orders = await Order.find({
        date: {
          $gte: new Date(startDate),
          $lte: new Date(endDate),
        },
      });
      res.status(200).json(orders);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching orders by date', error });
    }
  };
exports.calculateTotalSales = async (req, res) => {
    try {
      const orders = await Order.find({ order_status: 'complete' });
      const totalSales = orders.reduce((sum, order) => sum + order.total_amount, 0);
      res.status(200).json({ totalSales });
    } catch (error) {
      res.status(500).json({ message: 'Error calculating sales', error });
    }
  };
exports.addItemToOrder = async (req, res) => {
    try {
      const { product_id, quantity, price } = req.body;
      const total_price = quantity * price;
  
      const order = await Order.findOneAndUpdate(
        { id: req.params.id },
        {
          $push: { order_items: { product_id, quantity, price, total_price } },
          $inc: { total_amount: total_price },
          updated_at: Date.now(),
        },
        { new: true }
      );
  
      if (!order) return res.status(404).json({ message: 'Order not found' });
  
      res.status(200).json({ message: 'Item added to order', order });
    } catch (error) {
      res.status(500).json({ message: 'Error adding item to order', error });
    }
  };
exports.removeItemFromOrder = async (req, res) => {
    try {
      const { product_id } = req.body;
  
      const order = await Order.findOne({ id: req.params.id });
      if (!order) return res.status(404).json({ message: 'Order not found' });
  
      const item = order.order_items.find(item => item.product_id === product_id);
      if (!item) return res.status(404).json({ message: 'Item not found in order' });
  
      order.order_items = order.order_items.filter(item => item.product_id !== product_id);
      order.total_amount -= item.total_price;
      order.updated_at = Date.now();
  
      await order.save();
  
      res.status(200).json({ message: 'Item removed from order', order });
    } catch (error) {
      res.status(500).json({ message: 'Error removing item from order', error });
    }
  };
            