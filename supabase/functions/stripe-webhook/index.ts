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
<body style="margin:0;padding:0;background:#0a0a0a;font-family:'Inter',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0a;padding:48px 0;">
    <tr><td align="center" style="padding:0 16px;">
      <table width="500" cellpadding="0" cellspacing="0" style="max-width:500px;width:100%;">

        <!-- Logo -->
        <tr><td align="center" style="padding-bottom:32px;">
          <img src="https://prifvutxutzcspiukzek.supabase.co/storage/v1/object/public/Originals/Check%20In%20EdItory.png" alt="Bored Originals" height="36" style="height:36px;width:auto;display:block;" />
        </td></tr>

        <!-- Mensagem intro -->
        <tr><td style="padding-bottom:24px;">
          <p style="margin:0 0 8px 0;font-size:15px;line-height:1.6;color:rgba(255,255,255,0.55);">Olá ${toName.split(' ')[0]},</p>
          <p style="margin:0 0 8px 0;font-size:15px;line-height:1.6;color:rgba(255,255,255,0.55);">A tua reserva está confirmada. Vais receber mais detalhes sobre o ponto de encontro e o que levar nos próximos dias.</p>
          <p style="margin:0;font-size:15px;line-height:1.6;color:rgba(255,255,255,0.55);">Qualquer dúvida, responde a este email.</p>
        </td></tr>

        <!-- Card branco -->
        <tr><td style="background:#ffffff;border-radius:20px;overflow:hidden;padding:0;">
          <table width="100%" cellpadding="0" cellspacing="0">

            <!-- Card header com imagem + titulo -->
            <tr><td style="padding:24px 24px 20px 24px;border-bottom:1px solid #f0f0f0;">
              <table cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding-right:14px;vertical-align:top;">
                    <div style="width:52px;height:52px;border-radius:10px;overflow:hidden;background:#e5e5e5;">
                      <img src="https://prifvutxutzcspiukzek.supabase.co/storage/v1/object/public/Originals/sobrevive-hero.jpg" alt="" width="52" height="52" style="width:52px;height:52px;object-fit:cover;display:block;" />
                    </div>
                  </td>
                  <td style="vertical-align:middle;">
                    <p style="margin:0;font-size:17px;font-weight:700;color:#0a0a0a;">${activityTitle}</p>
                  </td>
                </tr>
              </table>
            </td></tr>

            <!-- Experiência -->
            <tr><td style="padding:16px 24px;border-bottom:1px solid #f0f0f0;">
              <p style="margin:0 0 3px 0;font-size:10px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:#999;">Experiência</p>
              <p style="margin:0;font-size:15px;font-weight:600;color:#0a0a0a;">${activityTitle}</p>
            </td></tr>

            <!-- Data -->
            <tr><td style="padding:16px 24px;border-bottom:1px solid #f0f0f0;">
              <p style="margin:0 0 3px 0;font-size:10px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:#999;">Data</p>
              <p style="margin:0;font-size:15px;font-weight:600;color:#0a0a0a;">${dateRange}</p>
            </td></tr>

            <!-- Pessoas -->
            <tr><td style="padding:16px 24px;border-bottom:1px solid #f0f0f0;">
              <p style="margin:0 0 3px 0;font-size:10px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:#999;">Pessoas</p>
              <p style="margin:0;font-size:15px;font-weight:600;color:#0a0a0a;">${people} pessoa${people > 1 ? 's' : ''}</p>
            </td></tr>

            <!-- Titular -->
            <tr><td style="padding:16px 24px;border-bottom:1px solid #f0f0f0;">
              <p style="margin:0 0 3px 0;font-size:10px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:#999;">Titular</p>
              <p style="margin:0;font-size:15px;font-weight:600;color:#0a0a0a;">${toName}</p>
              <p style="margin:2px 0 0 0;font-size:13px;color:#888;">${toEmail}</p>
            </td></tr>

            <!-- Total -->
            <tr><td style="padding:20px 24px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td><p style="margin:0;font-size:16px;font-weight:700;color:#0a0a0a;">Total</p></td>
                  <td align="right"><p style="margin:0;font-size:22px;font-weight:900;color:#0a0a0a;">${depositAmount}€</p></td>
                </tr>
              </table>
            </td></tr>

          </table>
        </td></tr>

        <!-- Footer -->
        <tr><td style="padding-top:28px;" align="center">
          <p style="margin:0;font-size:11px;color:rgba(255,255,255,0.2);line-height:1.7;">Bored Originals · Aventuras que valem a pena<br>${toEmail}</p>
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

    // Verificar se já existe booking para este payment intent
    const { data: existing } = await supabase
      .from('bookings')
      .select('id, payment_status')
      .eq('stripe_session_id', intent.id)
      .maybeSingle();

    if (existing) {
      // Se existir mas estava em 'processing' (MB WAY async), atualizar para confirmado
      if (existing.payment_status === 'processing' || existing.payment_status === 'pending') {
        await supabase
          .from('bookings')
          .update({ payment_status: 'paid', status: 'confirmed', deposit_paid: true })
          .eq('id', existing.id);
        console.log(`✅ Booking ${existing.id} updated from processing → confirmed for intent ${intent.id}`);
      } else {
        console.log(`ℹ️ Booking already confirmed for intent ${intent.id}`);
      }
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
