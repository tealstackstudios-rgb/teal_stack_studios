const CONTACT_EMAIL = 'tealstackstudios@gmail.com';
const DEFAULT_FROM = 'Teal Stack Studios <onboarding@resend.dev>';

const json = (body, status = 200) => new Response(JSON.stringify(body), {
  status,
  headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' },
});

const clean = (value, maxLength) => String(value ?? '').replace(/[\u0000-\u001f\u007f]/g, ' ').trim().slice(0, maxLength);

export async function onRequestPost({ request, env }) {
  const requestUrl = new URL(request.url);
  const origin = request.headers.get('Origin');
  if (origin && origin !== requestUrl.origin) return json({ error: 'Please submit the form from our website.' }, 403);

  let fields;
  try {
    fields = await request.formData();
  } catch {
    return json({ error: 'The form data could not be read. Please try again.' }, 400);
  }

  // Quietly discard bot submissions caught by the hidden honeypot field.
  if (clean(fields.get('bot-field'), 200)) {
    return Response.redirect(new URL('/thank-you.html', request.url), 303);
  }

  const name = clean(fields.get('name'), 120);
  const email = clean(fields.get('email'), 254);
  const service = clean(fields.get('service'), 120);
  const availability = clean(fields.get('preferred-appointment'), 240) || 'Not specified';
  const details = clean(fields.get('project-details'), 6000);

  if (!name || !service || !details || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return json({ error: 'Please check your name, email, service, and project details, then try again.' }, 400);
  }

  if (!env.RESEND_API_KEY) {
    return json({ error: 'The inquiry form is not connected yet. Please email tealstackstudios@gmail.com directly.' }, 503);
  }

  const message = [
    'New appointment inquiry from Teal Stack Studios',
    '',
    `Name: ${name}`,
    `Email: ${email}`,
    `Service: ${service}`,
    `Preferred appointment time: ${availability}`,
    '',
    'Project details:',
    details,
  ].join('\n');

  let delivery;
  try {
    delivery = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: env.RESEND_FROM_EMAIL || DEFAULT_FROM,
        to: [CONTACT_EMAIL],
        reply_to: email,
        subject: `Appointment inquiry: ${name} — ${service}`,
        text: message,
      }),
    });
  } catch (error) {
    console.error('Appointment email delivery request failed:', error instanceof Error ? error.message : 'unknown error');
    return json({ error: 'We could not send your inquiry right now. Please try again or email us directly.' }, 502);
  }

  if (!delivery.ok) {
    console.error('Appointment email provider returned status:', delivery.status);
    return json({ error: 'We could not send your inquiry right now. Please try again or email us directly.' }, 502);
  }

  return Response.redirect(new URL('/thank-you.html', request.url), 303);
}
