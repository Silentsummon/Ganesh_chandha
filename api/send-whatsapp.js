export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { phoneNumber, name, amount } = req.body;

  if (!phoneNumber || !name || !amount) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const TWILIO_SID = process.env.TWILIO_SID;
  const TWILIO_CLIENT_KEY = process.env.TWILIO_CLIENT_KEY;

  if (!TWILIO_SID || !TWILIO_CLIENT_KEY) {
    return res.status(500).json({ success: false, error: 'Missing credentials' });
  }

  try {
    const message = `Hey ${name}, you've contributed ₹${amount} to Lakshmi Narasima Swamy Youth Association. Thank you for your generosity! 🙏`;

    const auth = Buffer.from(`${TWILIO_SID}:${TWILIO_CLIENT_KEY}`).toString('base64');

    const params = new URLSearchParams();
    params.append('From', 'whatsapp:+14155238886');
    params.append('To', `whatsapp:+91${phoneNumber}`);
    params.append('Body', message);

    const response = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_SID}/Messages.json`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params,
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        success: false,
        error: data.message || `Error ${data.code}`,
      });
    }

    return res.status(200).json({
      success: true,
      messageSid: data.sid,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}
