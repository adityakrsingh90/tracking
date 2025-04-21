const nodemailer = require('nodemailer');

// Create transporter for Gmail
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Function to send general email
const sendEmail = (to, subject, text) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    text
  };
  return transporter.sendMail(mailOptions);
};

// Function to send password email
const sendPasswordEmail = async (email, password) => {
  const subject = 'Your Account Details';
  const text = `Your account has been created successfully. Here are your login credentials:\n\nEmail: ${email}\nPassword: ${password}\n\nPlease change your password after logging in.`;
  
  try {
    await sendEmail(email, subject, text);
    console.log('Password email sent to', email);
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

module.exports = { sendEmail, sendPasswordEmail };
