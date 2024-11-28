const User = require('../models/User');
const bcrypt = require('bcryptjs');


exports.getUserProfile = async (req, res) => {
  try {
    const user = req.user; 
    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};


exports.updateUserProfile = async (req, res) => {
  try {
    const { name, mobileNumber, email } = req.body;
    const user = req.user;

    
    if (name) user.name = name;
    if (mobileNumber) user.mobileNumber = mobileNumber;
    if (email) user.email = email;  

    await user.save();
    res.json({ message: 'Profile updated successfully', user });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};


exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = req.user;

    
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Incorrect current password' });

    
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;

    await user.save();
    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
