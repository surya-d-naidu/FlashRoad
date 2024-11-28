const nodemailer = require('nodemailer');


const transporter = nodemailer.createTransport({
  service: 'gmail', 
  auth: {
    user: 'illustraton23@gmail.com',  
    pass: 'fsjkqfolehfppftc',  
  },
});


const sendEmail = (to, subject, text) => {
  const mailOptions = {
    from: 'illustraton23@gmail.com', 
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

sendEmail('dlokeshchand1@gmail.com', 'dhddfgdgd', 'gudghudhgdug')