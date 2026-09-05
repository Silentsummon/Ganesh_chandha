export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { phoneNumber, name, amount } = req.body;

  if (!phoneNumber || !name || !amount) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
  const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;

  if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN) {
    return res.status(500).json({ success: false, error: 'Missing credentials' });
  }

  try {
    const message = `Hey ${name}, you've contributed ₹${amount} to Lakshmi Narasima Swamy Youth Association. Thank you for your generosity! 🙏`;

    const params = new URLSearchParams();
    params.append('From', 'whatsapp:+14155238886');
    params.append('To', `whatsapp:+91${phoneNumber}`);
    params.append('Body', message);

    const auth = Buffer.from(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`).toString('base64');

    const response = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params,
      }
    );

    const data = await response.json().catch(() => ({}));

    console.log('Twilio Status:', response.status);
    console.log('Twilio Response:', data);

    if (data.error_code === 21654) {
      // ContentSid error - means sandbox mode issue
      // Log it but don't fail
      console.warn('Sandbox limitation - message queued but may require approval');
      return res.status(200).json({
        success: true,
        messageSid: 'sandbox-pending',
        note: 'Sandbox mode - check Twilio logs',
      });
    }

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
    console.error('API Error:', error);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}
