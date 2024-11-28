const nodemailer = require('nodemailer');


const transporter = nodemailer.createTransport({
  service: 'gmail', 
  auth: {
    user: process.env.GMAIL_USER,  
    pass: process.env.GMAIL_PASS,  
  },
});


const sendEmail = (to, subject, text) => {
  const mailOptions = {
    from: process.env.GMAIL_USER, 
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
