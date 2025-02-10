// Assuming this is inside twilioService.js

const twilio = require('twilio');
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = new twilio(accountSid, authToken);

// Function to send WhatsApp notification
const sendWhatsAppNotification = (orderDetails) => {
  const adminPhone = 'whatsapp:+972525330412';  // Admin's WhatsApp number

  const message = `הוזמנה הזמנה חדשה!\nפרטי ההזמנה: ${orderDetails}`;


  client.messages.create({
    from: 'whatsapp:+14155238886',  // Your Twilio WhatsApp number
    to: adminPhone,
    body: message,
  })
  .then((message) => console.log('WhatsApp notification sent:', message.sid))
  .catch((err) => console.error('Error sending WhatsApp message:', err));
};

module.exports = { sendWhatsAppNotification };
