import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,  
  auth: {
    user: process.env.EMAIL_USER,  
    pass: process.env.EMAIL_PASS,  
  },
});

const sendEmail = async (to, subject, text) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,  
    to,                            
    subject,                       
    text,                          
    html: `<p>${text}</p>`,        
  };

  try {
    
    await new Promise((resolve, reject) => {
      transporter.verify((error, success) => {
        if (error) {
          console.error('Error verifying connection:', error);  
          reject(error);
        } else {
          console.log('SMTP server is ready to take messages');
          resolve(success);
        }
      });
    });

    
    const info = await new Promise((resolve, reject) => {
      transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
          console.error('Error sending email:', err);  
          reject(err);
        } else {
          console.log('Email sent successfully:', info.response);
          resolve(info);
        }
      });
    });

    return info;  
  } catch (error) {
    console.error('Error during email sending process:', error.message || error);  
    throw new Error(error.message || 'Unknown error during email sending');
  }
};

export default sendEmail;
