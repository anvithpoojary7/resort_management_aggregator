const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendVerificationEmail = async (email, code) => {
  const msg = {
    to: email,
    from: 'resortfinderinbox@gmail.com', // This should be verified in SendGrid
    subject: 'Verify your Resort Finder account',
    text: `Your verification code is: ${code}`,
  };

  try {
    await sgMail.send(msg);
    console.log('✅ Verification email sent to', email);
  } catch (error) {
    console.error('❌ Failed to send email:', error.response.body);
  }
};

module.exports = sendVerificationEmail;
