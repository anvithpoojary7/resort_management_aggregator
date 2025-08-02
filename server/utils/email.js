const sgMail = require('@sendgrid/mail');
require('dotenv').config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendBookingConfirmation = async (userEmail, userName, bookingDetails) => {
  const {
    resortName,
    checkInDate,
    checkOutDate,
    totalPrice,
    adults,
    children,
    roomName
  } = bookingDetails;

  const formattedCheckIn = new Date(checkInDate).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric'
  });

  const formattedCheckOut = new Date(checkOutDate).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric'
  });

  const msg = {
    to: userEmail,
    from: process.env.EMAIL_FROM, // must be verified in SendGrid
    subject: `Your Resort Booking Confirmation at ${resortName}`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <h2>Hello ${userName},</h2>
        <p>Your booking at <strong>${resortName}</strong> has been confirmed!</p>
        <ul>
          <li><strong>Room:</strong> ${roomName}</li>
          <li><strong>Check-In:</strong> ${formattedCheckIn}</li>
          <li><strong>Check-Out:</strong> ${formattedCheckOut}</li>
          <li><strong>Guests:</strong> ${adults} Adults, ${children} Children</li>
          <li><strong>Total Price:</strong> ₹${totalPrice}</li>
        </ul>
        <p>See you soon!</p>
        <p>The Resort Finder Team</p>
      </div>
    `,
  };

  try {
    const response = await sgMail.send(msg);
    console.log("✅ Email sent:", response[0].statusCode);
  } catch (error) {
    console.error("❌ Email send error:", error.response?.body || error.message);
    throw error; // So it gets caught in your route and logs properly
  }
};

module.exports = { sendBookingConfirmation };