import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,  // Use SSL
  auth: {
    user: process.env.EMAIL_USER,  // Email address from environment variables
    pass: process.env.EMAIL_PASS,  // App-specific password or email password
  },
});

const sendEmail = async (to, subject, text) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,  // Sender email address
    to,                            // Recipient email address
    subject,                       // Subject of the email
    text,                          // Plain text email content
    html: `<p>${text}</p>`,        // Optional: If you want HTML email, use HTML content
  };

  try {
    // Verify the connection configuration
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

    // Send the email
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

    return info;  // Return the information about the sent email
  } catch (error) {
    console.error('Error during email sending process:', error);
    throw error;  // Rethrow the error for further handling
  }
};

export default sendEmail;