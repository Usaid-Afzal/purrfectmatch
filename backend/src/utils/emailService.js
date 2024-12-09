const postmark = require('postmark');

// Initialize Postmark client with your server token
const client = new postmark.ServerClient(process.env.POSTMARK_SERVER_TOKEN);

async function sendWelcomeEmail(to, username) {
  try {
    // Replace 'no-reply@example.com' and 'Your App Name' with real values
    const result = await client.sendEmail({
      From: 'i222529@nu.edu.pk',
      To: to,
      Subject: 'Welcome to Our Purrfect Match!',
      TextBody: `Hello ${username},\n\nThank you for registering an account with us. We’re excited to have you on board!\n\n- The Team`
    });

    return result;
  } catch (error) {
    console.error('Error sending welcome email:', error);
    throw new Error('Email send failure');
  }
}

module.exports = {
  sendWelcomeEmail
};
