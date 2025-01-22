require("dotenv").config(); // Load environment variables
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const functions = require("firebase-functions");
// Import routes
const productRoutes = require("./routes/productRoutes");
const userRoutes = require("./routes/userRoutes");
const brandRoutes = require("./routes/brandRoutes");
const orderRoutes = require("./routes/orderRoutes");
const uploadRoutes = require("./routes/uploadRoutes");

// Initialize the app
const app = express();

// Environment Variables
const mongo_url = process.env.MONGO_URL; // MongoDB connection string
const allowedOrigins = [
  
    process.env.LOCAL_HOST_URL,
    process.env.ADMIN_URL,
    process.env.WEB_APP_URL,
  ].filter(Boolean); // Ensures only defined variables are included
  
  // CORS Configuration
  app.use(
    cors({
      origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true); // Allow access
        } else {
          console.error(`Blocked by CORS: ${origin}`); // Log blocked origins
          callback(new Error("Not allowed by CORS")); // Deny access
        }
      },
      methods: ["GET", "POST", "PUT", "DELETE", "PATCH"], // Allowed HTTP methods
      credentials: true, // Enable cookies and credentials for cross-origin requests
    })
  );
  
  
  // Handle preflight OPTIONS requests
  app.options("*", cors());
  
// Middleware
app.use(express.json());

// Database Connection
mongoose
  .connect(mongo_url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Failed to connect to MongoDB", err));

// Serve static files
// app.use("/images", express.static(path.join(__dirname, "upload/images")));
// app.use("/logos", express.static(path.join(__dirname, "upload/logos")));
//  Increase Payload Size Limit
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Use routes
app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/brands", brandRoutes);
app.use("/uploads", uploadRoutes);
app.use("/api/orders", orderRoutes);

exports.api = functions.https.onRequest(app);
// Start the server
//const port = process.env.PORT || 4000;
//app.listen(port, () => console.log(`Server running on port ${port}`));
