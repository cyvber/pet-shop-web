const User = require("../models/user");
const bcrypt = require("bcryptjs"); 
const jwt = require("jsonwebtoken");


exports.addUser = async (req, res) => {
  const { username, password, email, phone, address, shipping_price } = req.body;

  try {
      // Hash the password before saving
      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = new User({
          username,
          password: hashedPassword,
          email,
          phone,
          address,
          shipping_price, 
      });

      await newUser.save();
      res.status(201).json({ message: "User added successfully" });
  } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
  }
};


exports.userLoginAuthentication = async (req, res) => {
    const { username, password } = req.body;
  
    try {
      const user = await User.findOne({ username });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      const isMatch = await bcrypt.compare(password, user.password);
      if (isMatch) {
        
        const data = {
            user: {
                id: user.id
            }
        }
        const token = jwt.sign(data, process.env.SECRET_KEY, {
            expiresIn: "1h",
          });
          const expiration = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now

          // Save the expiration time in the database
          user.tokenExpiration = expiration;
          user.last_login = new Date();
          await user.save();
        res.json({success:true, token}) 
      } else {
            return res.status(401).json({ message: "Invalid password" });
      }
       
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
}

exports.updateUserDetails = async (req, res) => {
  try {
      const { email, phone, address, shipping_price } = req.body;
      const { userId } = req.params; // Get user ID from request parameters

      // Find the user by ID
      const user = await User.findById(userId);

      if (!user) {
          return res.status(404).json({ message: "User not found" });
      }

      // Update only the fields that were provided in the request
      if (email) user.email = email;
      if (phone) user.phone = phone;
      if (address) user.address = address;
      if (shipping_price !== undefined) user.shipping_price = shipping_price;

      await user.save();

      res.json({ message: "User details updated successfully", user });
  } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
  }
};