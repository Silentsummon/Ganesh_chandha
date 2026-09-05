import twilio from 'twilio';

const accountSid = import.meta.env.VITE_TWILIO_ACCOUNT_SID;
const authToken = import.meta.env.VITE_TWILIO_AUTH_TOKEN;

if (!accountSid || !authToken) {
  console.warn('Missing Twilio credentials in .env');
}

const client = twilio(accountSid, authToken);

export async function sendWhatsAppMessage(phoneNumber, name, amount) {
  try {
    const message = await client.messages.create({
      from: 'whatsapp:+14155238886', // Twilio's sandbox WhatsApp number
      to: `whatsapp:+91${phoneNumber}`,
      body: `Hey ${name}, you've contributed ₹${amount} to Lakshmi Narasima Swamy Youth Association. Thank you for your generosity! 🙏`
    });

    console.log('WhatsApp message sent:', message.sid);
    return { success: true, messageSid: message.sid };
  } catch (error) {
    console.error('WhatsApp send failed:', error);
    return { success: false, error: error.message };
  }
}
