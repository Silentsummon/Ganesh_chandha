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
    const params = new URLSearchParams();
    params.append('From', 'whatsapp:+14155238886');
    params.append('To', `whatsapp:+91${phoneNumber}`);
    params.append('Body', `Hey ${name}, you've contributed ₹${amount} to Lakshmi Narasima Swamy Youth Association. Thank you! 🙏`);

    const auth = Buffer.from(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`).toString('base64');

    const response = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params.toString(),
      }
    );

    const responseText = await response.text();
    
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (e) {
      return res.status(500).json({
        success: false,
        error: 'Invalid response from Twilio',
        response: responseText,
      });
    }

    if (!response.ok) {
      return res.status(response.status).json({
        success: false,
        error: data.message || 'Failed to send',
        code: data.code,
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
