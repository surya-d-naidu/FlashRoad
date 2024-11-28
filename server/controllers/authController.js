const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const sendEmail = require('../services/emailService');  


exports.register = async (req, res) => {
  try {
    const { name, email, password, mobileNumber, role } = req.body;

    const userRole = role.toLowerCase();
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    
    const hashedPassword = await bcrypt.hash(password, 10);

    
    const emailVerificationToken = crypto.randomBytes(32).toString('hex');

    
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      mobileNumber,
      userRole,
      emailVerificationToken,
    });

    await newUser.save();

    
    const verificationUrl = `flashroad.vercel.app/api/auth/verify-email/${emailVerificationToken}`;
    const mailContent = `Please verify your email by clicking the following link: ${verificationUrl}`;
    sendEmail(email, 'Verify Your Email', mailContent);

    res.status(201).json({ message: 'User registered successfully, please check your email for verification.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};


exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;

    
    const user = await User.findOne({ emailVerificationToken: token });
    if (!user) return res.status(400).json({ message: 'Invalid or expired verification token' });

    
    user.emailVerified = true;
    user.emailVerificationToken = undefined;  

    await user.save();

    res.status(200).json({ message: 'Email successfully verified' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};


exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'User not found' });

    
    if (!user.emailVerified) {
      return res.status(400).json({ message: 'Please verify your email before logging in' });
    }

    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
