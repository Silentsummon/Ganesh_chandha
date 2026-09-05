import axios from 'axios';

const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
const TWILIO_WHATSAPP_NUMBER = 'whatsapp:+14155238886';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { phoneNumber, name, amount } = req.body;

  if (!phoneNumber || !name || !amount) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const message = `Hey ${name}, you've contributed ₹${amount} to Lakshmi Narasima Swamy Youth Association. Thank you for your generosity! 🙏`;

    const response = await axios.post(
      `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`,
      new URLSearchParams({
        From: TWILIO_WHATSAPP_NUMBER,
        To: `whatsapp:+91${phoneNumber}`,
        Body: message,
      }),
      {
        auth: {
          username: TWILIO_ACCOUNT_SID,
          password: TWILIO_AUTH_TOKEN,
        },
      }
    );

    return res.status(200).json({
      success: true,
      messageSid: response.data.sid,
    });
  } catch (error) {
    console.error('WhatsApp send error:', error.message);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}
