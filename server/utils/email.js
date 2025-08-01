const nodemailer = require('nodemailer');
const sgMail = require('@sendgrid/mail');
require('dotenv').config();

// Set SendGrid API Key for API usage (if needed)
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Nodemailer transporter via SendGrid SMTP
const transporter = nodemailer.createTransport({
    host: 'smtp.sendgrid.net',
    port: 587,
    secure: false,
    auth: {
        user: 'apikey', // Fixed value
        pass: process.env.SENDGRID_API_KEY,
    },
});

// Send Booking Confirmation Email
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

    const mailOptions = {
        from: process.env.EMAIL_FROM,
        to: userEmail,
        subject: `Your Resort Booking Confirmation at ${resortName}`,
        html: `
            <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <h2 style="color: #C97B63;">Hello ${userName},</h2>
                <p>Your booking at <strong>${resortName}</strong> has been successfully confirmed!</p>
                <p>Here are your booking details:</p>
                <ul style="list-style-type: none; padding: 0;">
                    <li><strong>Resort:</strong> ${resortName}</li>
                    <li><strong>Room Type:</strong> ${roomName}</li>
                    <li><strong>Check-in Date:</strong> ${formattedCheckIn}</li>
                    <li><strong>Check-out Date:</strong> ${formattedCheckOut}</li>
                    <li><strong>Guests:</strong> ${adults} Adult(s), ${children} Child(ren)</li>
                    <li><strong>Total Price:</strong> ₹${totalPrice ? totalPrice.toFixed(2) : 'N/A'}</li>
                </ul>
                <p>We look forward to seeing you soon!</p>
                <p>Best regards,<br/>The Resort Finder Team</p>
                <hr style="border-top: 1px solid #eee; margin: 20px 0;"/>
                <p style="font-size: 0.8em; color: #666;">This is an automated email, please do not reply.</p>
            </div>
        `,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent: %s', info.messageId);

        if (process.env.NODE_ENV !== 'production') {
            console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
        }
    } catch (error) {
        console.error('Error sending booking confirmation email:', error);
    }
};

module.exports = {
    sendBookingConfirmation,
};
