require('dotenv').config();
const sendEmail = require('./utils/sendEmail');

async function test() {
  try {
    await sendEmail({
      email: process.env.SMTP_EMAIL, // Send to themselves for testing
      subject: 'Test Email',
      message: 'This is a test to see what error Brevo is throwing.',
      html: '<p>Test</p>'
    });
    console.log("Email sent successfully!");
  } catch (error) {
    console.error("SMTP ERROR CAUGHT:");
    console.error(error);
  }
}

test();
