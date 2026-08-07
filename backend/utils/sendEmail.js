const axios = require('axios');
const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // If BREVO_API_KEY is provided in environment variables, use the HTTP API to bypass Render SMTP blocking
  if (process.env.BREVO_API_KEY) {
    try {
      const payload = {
        sender: {
          name: process.env.FROM_NAME || 'Income Expense Tracker',
          email: process.env.FROM_EMAIL || 'noreply@income-expense-tracker.com'
        },
        to: [
          {
            email: options.email
          }
        ],
        subject: options.subject,
        htmlContent: options.html || options.message,
        textContent: options.message
      };

      const response = await axios.post('https://api.brevo.com/v3/smtp/email', payload, {
        headers: {
          'api-key': process.env.BREVO_API_KEY,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      console.log('Message sent via Brevo API:', response.data);
    } catch (error) {
      console.error('Error sending email via Brevo API:', error.response?.data || error.message);
      throw error;
    }
  } else {
    // Generate test SMTP service account from ethereal.email (Useful for Local Development)
    let testAccount = await nodemailer.createTestAccount();

    const transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: testAccount.user, // generated ethereal user
        pass: testAccount.pass, // generated ethereal password
      },
    });
    
    console.log("No BREVO_API_KEY found in .env, using Ethereal test account.");

    const message = {
      from: `${process.env.FROM_NAME || 'Test'} <${process.env.FROM_EMAIL || 'test@test.com'}>`,
      to: options.email,
      subject: options.subject,
      text: options.message,
      html: options.html
    };

    const info = await transporter.sendMail(message);

    console.log('Message sent: %s', info.messageId);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  }
};

module.exports = sendEmail;
