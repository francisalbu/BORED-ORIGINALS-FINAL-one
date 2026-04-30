// @ts-nocheck
import Stripe from 'npm:stripe@14';
import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!);

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
);

async function sendConfirmationEmail({
  toEmail, toName, activityTitle, dateRange, people, depositAmount,
}: {
  toEmail: string; toName: string; activityTitle: string;
  dateRange: string; people: number; depositAmount: number;
}) {
  const resendKey = Deno.env.get('RESEND_API_KEY');
  if (!resendKey) { console.warn('RESEND_API_KEY not set — skipping email'); return; }

  const html = `
<!DOCTYPE html>
<html lang="pt">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Reserva Confirmada</title></head>
<body style="margin:0;padding:0;background:#050505;font-family:'Inter',Arial,sans-serif;color:#ffffff;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#050505;padding:40px 0;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">
        <tr><td align="center" style="padding-bottom:36px;">
          <img src="https://prifvutxutzcspiukzek.supabase.co/storage/v1/object/public/Originals/Check%20In%20EdItory.png" alt="Bored." height="40" style="height:40px;width:auto;" />
        </td></tr>
        <tr><td style="border-top:1px solid rgba(255,255,255,0.08);padding-top:36px;padding-bottom:8px;">
          <p style="margin:0;font-size:11px;font-weight:700;letter-spacing:0.3em;text-transform:uppercase;color:rgba(255,255,255,0.3);">Reserva confirmada</p>
        </td></tr>
        <tr><td style="padding-bottom:36px;">
          <h1 style="margin:0;font-size:36px;font-weight:900;line-height:1;letter-spacing:-0.02em;color:#ffffff;">${activityTitle}</h1>
        </td></tr>
        <tr><td style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:16px;padding:0;overflow:hidden;">
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr><td style="padding:20px 24px;border-bottom:1px solid rgba(255,255,255,0.06);">
              <p style="margin:0 0 4px 0;font-size:10px;font-weight:700;letter-spacing:0.2em;text-transform:uppercase;color:rgba(255,255,255,0.3);">Aventura</p>
              <p style="margin:0;font-size:15px;font-weight:600;color:#ffffff;">${activityTitle}</p>
            </td></tr>
            <tr><td style="padding:20px 24px;border-bottom:1px solid rgba(255,255,255,0.06);">
              <p style="margin:0 0 4px 0;font-size:10px;font-weight:700;letter-spacing:0.2em;text-transform:uppercase;color:rgba(255,255,255,0.3);">Data</p>
              <p style="margin:0;font-size:15px;font-weight:600;color:#ffffff;">${dateRange}</p>
            </td></tr>
            <tr><td style="padding:20px 24px;border-bottom:1px solid rgba(255,255,255,0.06);">
              <p style="margin:0 0 4px 0;font-size:10px;font-weight:700;letter-spacing:0.2em;text-transform:uppercase;color:rgba(255,255,255,0.3);">Pessoas</p>
              <p style="margin:0;font-size:15px;font-weight:600;color:#ffffff;">${people} pessoa${people > 1 ? 's' : ''}</p>
            </td></tr>
            <tr><td style="padding:20px 24px;">
              <p style="margin:0 0 4px 0;font-size:10px;font-weight:700;letter-spacing:0.2em;text-transform:uppercase;color:rgba(255,255,255,0.3);">Total pago</p>
              <p style="margin:0;font-size:28px;font-weight:900;color:#FFE600;">${depositAmount}€</p>
            </td></tr>
          </table>
        </td></tr>
        <tr><td style="padding:36px 0 24px 0;">
          <p style="margin:0 0 12px 0;font-size:15px;line-height:1.6;color:rgba(255,255,255,0.7);">Olá ${toName.split(' ')[0]},</p>
          <p style="margin:0 0 12px 0;font-size:15px;line-height:1.6;color:rgba(255,255,255,0.7);">A tua reserva está confirmada. Vais receber mais detalhes sobre o ponto de encontro e o que levar nos próximos dias.</p>
          <p style="margin:0;font-size:15px;line-height:1.6;color:rgba(255,255,255,0.7);">Qualquer dúvida, responde a este email.</p>
        </td></tr>
        <tr><td style="padding-bottom:36px;">
          <a href="https://boredoriginals.pt" style="display:inline-block;background:#FFE600;color:#050505;font-size:12px;font-weight:800;letter-spacing:0.15em;text-transform:uppercase;padding:14px 28px;border-radius:12px;text-decoration:none;">Ver as tuas aventuras →</a>
        </td></tr>
        <tr><td style="border-top:1px solid rgba(255,255,255,0.06);padding-top:24px;">
          <p style="margin:0;font-size:11px;color:rgba(255,255,255,0.2);line-height:1.6;">Bored Originals · Aventuras que valem a pena<br>Este email foi enviado para ${toEmail}</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${resendKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'Bored Originals <bookings@boredtourist.com>',
      to: [toEmail],
      bcc: ['bookings@boredtourist.com'],
      subject: `✅ Reserva confirmada — ${activityTitle}`,
      html,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error('Resend error:', err);
  } else {
    console.log(`📧 Confirmation email sent to ${toEmail}`);
  }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { paymentIntentId } = await req.json();

    if (!paymentIntentId) {
      return new Response(JSON.stringify({ error: 'paymentIntentId is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Fetch payment intent from Stripe to verify and get metadata
    const intent = await stripe.paymentIntents.retrieve(paymentIntentId);

    console.log(`[confirm-booking] intent ${intent.id} status: ${intent.status}`);

    // Only proceed for succeeded or processing (async methods like MB WAY)
    if (intent.status !== 'succeeded' && intent.status !== 'processing') {
      return new Response(JSON.stringify({ error: `Payment not completed. Status: ${intent.status}` }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Deduplication: check if booking already exists for this payment intent
    const { data: existing } = await supabase
      .from('bookings')
      .select('id')
      .eq('stripe_session_id', intent.id)
      .maybeSingle();

    if (existing) {
      console.log(`ℹ️ Booking already exists for intent ${intent.id}`);
      return new Response(JSON.stringify({ ok: true, duplicate: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const meta = intent.metadata ?? {};
    let holders: any[] = [];
    try { holders = JSON.parse(meta.holders || '[]'); } catch { holders = []; }
    const primaryHolder = holders[0] ?? {};

    const isDeposit = meta.bookingType === 'waitlist_deposit';
    const paymentStatus = intent.status === 'succeeded'
      ? (isDeposit ? 'deposit_paid' : 'paid')
      : 'processing';
    const bookingStatus = intent.status === 'succeeded' ? 'confirmed' : 'pending';

    const { error: dbError } = await supabase.from('bookings').insert({
      customer_name: primaryHolder.name || 'Desconhecido',
      customer_email: primaryHolder.email || '',
      customer_phone: primaryHolder.phone || '',
      num_people: parseInt(meta.people || '1'),
      total_price: parseFloat(meta.totalAmount || '0'),
      deposit_paid: isDeposit || intent.status === 'succeeded',
      payment_status: paymentStatus,
      payment_method: 'stripe',
      status: bookingStatus,
      stripe_session_id: intent.id,
      internal_notes: JSON.stringify({
        activityTitle: meta.activityTitle,
        dateRange: meta.dateRange,
        vespas: parseInt(meta.vespas || '0'),
        holders,
        depositAmount: parseFloat(meta.depositAmount || '0'),
        bookingType: meta.bookingType || 'full',
        confirmedBy: 'client-fallback',
      }),
    });

    if (dbError) {
      console.error('Supabase insert error:', dbError);
      return new Response(JSON.stringify({ error: 'Database error', details: dbError.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log(`✅ Booking saved via confirm-booking for intent ${intent.id}`);

    // Decrement spots
    const activityDateId = meta.activityDateId;
    const numPeople = parseInt(meta.people || '1');
    if (activityDateId) {
      const { data: dateRow } = await supabase
        .from('activity_dates')
        .select('spots')
        .eq('id', activityDateId)
        .maybeSingle();

      if (dateRow) {
        const newSpots = Math.max(0, (dateRow.spots ?? 0) - numPeople);
        const newStatus = newSpots <= 0 ? 'esgotado' : newSpots <= 4 ? 'apreencher' : 'disponivel';
        await supabase
          .from('activity_dates')
          .update({ spots: newSpots, status: newStatus })
          .eq('id', activityDateId);
        console.log(`📉 Spots for date ${activityDateId}: ${dateRow.spots} → ${newSpots}`);
      }
    }

    // Send confirmation email
    if (primaryHolder.email) {
      await sendConfirmationEmail({
        toEmail: primaryHolder.email,
        toName: primaryHolder.name || 'Aventureiro',
        activityTitle: meta.activityTitle || 'Experiência Bored Originals',
        dateRange: meta.dateRange || '',
        people: parseInt(meta.people || '1'),
        depositAmount: parseFloat(meta.depositAmount || meta.totalAmount || '0'),
      });
    }

    return new Response(JSON.stringify({ ok: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (err: any) {
    console.error('confirm-booking error:', err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
