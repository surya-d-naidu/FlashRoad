const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

dotenv.config()

const transporter = nodemailer.createTransport({
  service: 'gmail', 
  auth: {
    user: process.env.EMAIL_USER,  
    pass: process.env.EMAIL_PASS,  
  },
});


const sendEmail = (to, subject, text) => {
  const mailOptions = {
    from: process.env.EMAIL_USER, 
    to,                          
    subject,                     
    text,                        
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('Error sending email:', error);
      return;
    }
    console.log('Email sent:', info.response);
  });
};

module.exports = sendEmail;
