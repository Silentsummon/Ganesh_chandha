import { Client, LocalAuth } from 'whatsapp-web.js';
import qrcode from 'qrcode-terminal';

let client = null;
let isReady = false;

// Initialize WhatsApp client
function initializeClient() {
  if (client) return client;

  client = new Client({
    authStrategy: new LocalAuth(),
  });

  client.on('qr', (qr) => {
    console.log('QR Code received, scan it with your WhatsApp:');
    qrcode.generate(qr, { small: true });
  });

  client.on('ready', () => {
    console.log('WhatsApp client is ready!');
    isReady = true;
  });

  client.on('disconnected', () => {
    console.log('WhatsApp client disconnected');
    isReady = false;
    client = null;
  });

  client.initialize();
  return client;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { phoneNumber, name, amount } = req.body;

  if (!phoneNumber || !name || !amount) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    // Initialize if not already done
    if (!client) {
      initializeClient();
    }

    // Wait for client to be ready (max 10 seconds)
    let retries = 0;
    while (!isReady && retries < 10) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      retries++;
    }

    if (!isReady) {
      return res.status(503).json({
        success: false,
        error: 'WhatsApp client not ready. Scan QR code and try again.',
      });
    }

    const message = `Hey ${name}, you've contributed ₹${amount} to Lakshmi Narasima Swamy Youth Association. Thank you for your generosity! 🙏`;

    // Send message
    const chatId = `91${phoneNumber}@c.us`;
    await client.sendMessage(chatId, message);

    return res.status(200).json({
      success: true,
      message: 'Message sent!',
    });
  } catch (error) {
    console.error('WhatsApp error:', error);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}
