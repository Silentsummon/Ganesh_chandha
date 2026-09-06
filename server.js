import pkg from 'whatsapp-web.js';
const { Client, LocalAuth } = pkg;
import qrcode from 'qrcode-terminal';
import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

const client = new Client({
  authStrategy: new LocalAuth(),
});

client.on('qr', (qr) => {
  console.log('\n🔴 SCAN THIS QR CODE WITH YOUR WHATSAPP:');
  qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
  console.log('✅ WhatsApp is ready!');
});

app.post('/api/send-whatsapp', async (req, res) => {
  const { phoneNumber, name, amount } = req.body;

  try {
    const message = `Namaskar ${name} garu and family! 🙏
This is Lakshmi Narasima Swamy Youth Association — just wanted to say a huge thank you for the ₹${amount} you gave for this year's Ganesh Chaturthi. Means a lot to all of us!
We'll keep sending updates about events from this number.
Jai Ganesh! 🕉️`;
    
    const chatId = `91${phoneNumber}@c.us`;
    
    console.log(`Sending message to: ${chatId}`);
    
    const result = await client.sendMessage(chatId, message);
    
    console.log(`Message sent successfully!`);
    
    res.json({ success: true, message: 'Message sent!', chatId });
  } catch (error) {
    console.error('Error sending message:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

client.initialize();

app.listen(3000, '0.0.0.0', () => {
  console.log('Server running on http://0.0.0.0:3000');
});
