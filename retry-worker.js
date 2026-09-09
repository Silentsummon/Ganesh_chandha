import 'dotenv/config';
import 'dotenv/config';
// retry-worker.js
// Background reliability layer for WhatsApp delivery.
// Polls Supabase for chandhas where message_sent = false and retries sending.
// Run this alongside your WhatsApp server (separate process), e.g.:
//   node retry-worker.js

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://nrlfklbpdjxfuhxmrvko.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY; // MUST be a service role key, not anon key
const WHATSAPP_API_URL = process.env.WHATSAPP_API_URL || 'https://whatsapp.navyukth.tech';
const WHATSAPP_API_KEY = process.env.WHATSAPP_API_KEY || 'Wx7qWhDE0QnHm8kj7QdR8U9eGZQxwnMWxnmIW7jJXfY=';

// Configurable — do not hardcode elsewhere.
const RETRY_INTERVAL_MS = Number(process.env.RETRY_INTERVAL_MS || 60_000); // default: 1 minute

if (!SUPABASE_KEY) {
  console.error('❌ Missing SUPABASE_SERVICE_KEY env var. Get it from Supabase Settings → API → service_role key.');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function sendWhatsApp(phoneNumber, name, amount) {
  const response = await fetch(`${WHATSAPP_API_URL}/api/send-whatsapp`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': WHATSAPP_API_KEY,
    },
    body: JSON.stringify({ phoneNumber, name, amount }),
  });
  const data = await response.json().catch(() => ({}));
  return response.ok && data.success;
}

async function processPending() {
  const { data: pending, error } = await supabase
    .from('chandhas')
    .select('id, name, mobile, amount')
    .eq('message_sent', false);

  if (error) {
    console.error('Failed to fetch pending entries:', error.message);
    return;
  }

  if (!pending || pending.length === 0) {
    console.log(`[${new Date().toISOString()}] No pending messages.`);
    return;
  }

  console.log(`[${new Date().toISOString()}] Found ${pending.length} pending message(s).`);

  for (const entry of pending) {
    try {
      const success = await sendWhatsApp(entry.mobile, entry.name, entry.amount);

      if (success) {
        const { error: updateError } = await supabase
          .from('chandhas')
          .update({ message_sent: true })
          .eq('id', entry.id);

        if (updateError) {
          console.error(`  ❌ Sent to ${entry.name} but failed to update DB:`, updateError.message);
        } else {
          console.log(`  ✅ Sent + marked done: ${entry.name} (${entry.mobile})`);
        }
      } else {
        console.log(`  ⏳ Failed, will retry: ${entry.name} (${entry.mobile})`);
      }
    } catch (err) {
      console.log(`  ⏳ Error, will retry: ${entry.name} — ${err.message}`);
    }
  }
}

console.log(`🔁 Retry worker started. Interval: ${RETRY_INTERVAL_MS}ms`);
processPending();
setInterval(processPending, RETRY_INTERVAL_MS);
