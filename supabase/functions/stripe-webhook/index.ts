// @ts-nocheck
import Stripe from 'npm:stripe@14';
import { createClient } from 'npm:@supabase/supabase-js@2';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!);

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
);

async function sendConfirmationEmail({
  toEmail,
  toName,
  activityTitle,
  dateRange,
  people,
  totalAmount,
  depositAmount,
}: {
  toEmail: string;
  toName: string;
  activityTitle: string;
  dateRange: string;
  people: number;
  totalAmount: number;
  depositAmount: number;
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

        <!-- Logo -->
        <tr><td align="center" style="padding-bottom:36px;">
          <img src="https://prifvutxutzcspiukzek.supabase.co/storage/v1/object/public/Originals/Check%20In%20EdItory.png" alt="Bored." height="40" style="height:40px;width:auto;" />
        </td></tr>

        <!-- Hero line -->
        <tr><td style="border-top:1px solid rgba(255,255,255,0.08);padding-top:36px;padding-bottom:8px;">
          <p style="margin:0;font-size:11px;font-weight:700;letter-spacing:0.3em;text-transform:uppercase;color:rgba(255,255,255,0.3);">Reserva confirmada</p>
        </td></tr>
        <tr><td style="padding-bottom:36px;">
          <h1 style="margin:0;font-size:36px;font-weight:900;line-height:1;letter-spacing:-0.02em;color:#ffffff;">${activityTitle}</h1>
        </td></tr>

        <!-- Details card -->
        <tr><td style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:16px;padding:0;overflow:hidden;">
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td style="padding:20px 24px;border-bottom:1px solid rgba(255,255,255,0.06);">
                <p style="margin:0 0 4px 0;font-size:10px;font-weight:700;letter-spacing:0.2em;text-transform:uppercase;color:rgba(255,255,255,0.3);">Aventura</p>
                <p style="margin:0;font-size:15px;font-weight:600;color:#ffffff;">${activityTitle}</p>
              </td>
            </tr>
            <tr>
              <td style="padding:20px 24px;border-bottom:1px solid rgba(255,255,255,0.06);">
                <p style="margin:0 0 4px 0;font-size:10px;font-weight:700;letter-spacing:0.2em;text-transform:uppercase;color:rgba(255,255,255,0.3);">Data</p>
                <p style="margin:0;font-size:15px;font-weight:600;color:#ffffff;">${dateRange}</p>
              </td>
            </tr>
            <tr>
              <td style="padding:20px 24px;border-bottom:1px solid rgba(255,255,255,0.06);">
                <p style="margin:0 0 4px 0;font-size:10px;font-weight:700;letter-spacing:0.2em;text-transform:uppercase;color:rgba(255,255,255,0.3);">Pessoas</p>
                <p style="margin:0;font-size:15px;font-weight:600;color:#ffffff;">${people} pessoa${people > 1 ? 's' : ''}</p>
              </td>
            </tr>
            <tr>
              <td style="padding:20px 24px;">
                <p style="margin:0 0 4px 0;font-size:10px;font-weight:700;letter-spacing:0.2em;text-transform:uppercase;color:rgba(255,255,255,0.3);">Total pago</p>
                <p style="margin:0;font-size:28px;font-weight:900;color:#FFE600;">${depositAmount}€</p>
              </td>
            </tr>
          </table>
        </td></tr>

        <!-- Message -->
        <tr><td style="padding:36px 0 24px 0;">
          <p style="margin:0 0 12px 0;font-size:15px;line-height:1.6;color:rgba(255,255,255,0.7);">Olá ${toName.split(' ')[0]},</p>
          <p style="margin:0 0 12px 0;font-size:15px;line-height:1.6;color:rgba(255,255,255,0.7);">A tua reserva está confirmada. Vais receber mais detalhes sobre o ponto de encontro e o que levar nos próximos dias.</p>
          <p style="margin:0;font-size:15px;line-height:1.6;color:rgba(255,255,255,0.7);">Qualquer dúvida, responde a este email.</p>
        </td></tr>

        <!-- CTA -->
        <tr><td style="padding-bottom:36px;">
          <a href="https://boredoriginals.pt" style="display:inline-block;background:#FFE600;color:#050505;font-size:12px;font-weight:800;letter-spacing:0.15em;text-transform:uppercase;padding:14px 28px;border-radius:12px;text-decoration:none;">Ver as tuas aventuras →</a>
        </td></tr>

        <!-- Footer -->
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
  const body = await req.text();
  const sig = req.headers.get('stripe-signature');

  if (!sig) {
    return new Response('Missing stripe-signature header', { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      Deno.env.get('STRIPE_WEBHOOK_SECRET')!,
    );
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }

  // ── Checkout Session (redirect flow, legacy) ──────────────────────────────
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const meta = session.metadata!;

    let holders: any[] = [];
    try { holders = JSON.parse(meta.holders || '[]'); } catch { holders = []; }
    const primaryHolder = holders[0] ?? {};

    const { error } = await supabase.from('bookings').insert({
      customer_name: primaryHolder.name || 'Desconhecido',
      customer_email: primaryHolder.email || session.customer_email || '',
      customer_phone: primaryHolder.phone || '',
      num_people: parseInt(meta.people || '1'),
      total_price: parseFloat(meta.totalAmount || '0'),
      deposit_paid: true,
      payment_status: 'deposit_paid',
      payment_method: 'stripe',
      status: 'confirmed',
      stripe_session_id: session.id,
      internal_notes: JSON.stringify({
        activityTitle: meta.activityTitle,
        dateRange: meta.dateRange,
        vespas: parseInt(meta.vespas || '1'),
        holders,
        depositAmount: parseFloat(meta.depositAmount || '0'),
      }),
    });

    if (error) { console.error('Supabase insert error:', error); return new Response('Database error', { status: 500 }); }
    console.log(`✅ Booking saved for checkout session ${session.id}`);

    // Send confirmation email
    if (primaryHolder.email) {
      await sendConfirmationEmail({
        toEmail: primaryHolder.email,
        toName: primaryHolder.name || 'Aventureiro',
        activityTitle: meta.activityTitle || 'Experiência Bored Originals',
        dateRange: meta.dateRange || '',
        people: parseInt(meta.people || '1'),
        totalAmount: parseFloat(meta.totalAmount || '0'),
        depositAmount: parseFloat(meta.depositAmount || meta.totalAmount || '0'),
      });
    }
  }

  // ── Payment Intent (embedded flow) ────────────────────────────────────────
  if (event.type === 'payment_intent.succeeded') {
    const intent = event.data.object as Stripe.PaymentIntent;
    const meta = intent.metadata ?? {};

    // Evitar duplicados: verificar se já existe booking para este payment intent
    const { data: existing } = await supabase
      .from('bookings')
      .select('id')
      .eq('stripe_session_id', intent.id)
      .maybeSingle();

    if (existing) {
      console.log(`ℹ️ Booking already exists for intent ${intent.id}`);
      return new Response('ok', { status: 200 });
    }

    let holders: any[] = [];
    try { holders = JSON.parse(meta.holders || '[]'); } catch { holders = []; }
    const primaryHolder = holders[0] ?? {};

    const isDeposit = meta.bookingType === 'waitlist_deposit';

    const { error } = await supabase.from('bookings').insert({
      customer_name: primaryHolder.name || 'Desconhecido',
      customer_email: primaryHolder.email || '',
      customer_phone: primaryHolder.phone || '',
      num_people: parseInt(meta.people || '1'),
      total_price: parseFloat(meta.totalAmount || '0'),
      deposit_paid: isDeposit,
      payment_status: isDeposit ? 'deposit_paid' : 'paid',
      payment_method: 'stripe',
      status: 'confirmed',
      stripe_session_id: intent.id,
      internal_notes: JSON.stringify({
        activityTitle: meta.activityTitle,
        dateRange: meta.dateRange,
        vespas: parseInt(meta.vespas || '0'),
        holders,
        depositAmount: parseFloat(meta.depositAmount || '0'),
        bookingType: meta.bookingType || 'full',
      }),
    });

    if (error) { console.error('Supabase insert error:', error); return new Response('Database error', { status: 500 }); }
    console.log(`✅ Booking saved for payment intent ${intent.id}`);

    // Send confirmation email
    if (primaryHolder.email) {
      await sendConfirmationEmail({
        toEmail: primaryHolder.email,
        toName: primaryHolder.name || 'Aventureiro',
        activityTitle: meta.activityTitle || 'Experiência Bored Originals',
        dateRange: meta.dateRange || '',
        people: parseInt(meta.people || '1'),
        totalAmount: parseFloat(meta.totalAmount || '0'),
        depositAmount: parseFloat(meta.depositAmount || meta.totalAmount || '0'),
      });
    }

    // Decrement available spots
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
        console.log(`📉 Spots for date ${activityDateId}: ${dateRow.spots} → ${newSpots} (${newStatus})`);
      }
    }
  }

  return new Response('ok', { status: 200 });
});
