 const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  service: "gmail", 
  auth: {
    user: process.env.EMAIL_FROM,      
    pass: process.env.EMAIL_PASSWORD,  
  },
});

const sendBookingConfirmation = async (toEmail, name, bookingDetails) => {
  const { resortName, roomName, checkInDate, checkOutDate, adults, children, totalPrice } = bookingDetails;

  const mailOptions = {
    from: `"Resort Booking" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: "Booking Confirmation - Resort Stay",
    html: `
      <h2>Hello ${name},</h2>
      <p>Your reservation has been confirmed. Here are the details:</p>
      <ul>
        <li><strong>Resort:</strong> ${resortName}</li>
        <li><strong>Room:</strong> ${roomName}</li>
        <li><strong>Check-In:</strong> ${new Date(checkInDate).toLocaleDateString()}</li>
        <li><strong>Check-Out:</strong> ${new Date(checkOutDate).toLocaleDateString()}</li>
        <li><strong>Adults:</strong> ${adults}</li>
        <li><strong>Children:</strong> ${children}</li>
        <li><strong>Total Price:</strong> ₹${totalPrice}</li>
      </ul>
      <p>We look forward to hosting you!</p>
    `
  };

  await transporter.sendMail(mailOptions);
};

module.exports = { sendBookingConfirmation };



