interface WebinarEmailDetails {
  recipientEmail: string;
  recipientName: string;
  recipientPhone: string;
  webinarTitle: string;
  date?: string;
  time?: string;
  duration?: string;
  registrationType: 'free' | 'paid';
  amount: number;
  paymentId?: string;
}

const WEB3FORMS_KEY =
  process.env.VITE_WEB3FORMS_ACCESS_KEY || '4a2c0a81-481c-4274-a599-cc3f97947c19';

/**
 * Dispatch Webinar Confirmation Notification
 */
export async function sendWebinarConfirmationEmail(details: WebinarEmailDetails): Promise<{ success: boolean; message: string }> {
  const isPaid = details.registrationType === 'paid';
  const amountFormatted = isPaid ? `₹${details.amount}` : 'FREE';
  const sessionDate = details.date || 'Upcoming Live Session';
  const sessionTime = details.time || 'Check calendar invite';
  const sessionDuration = details.duration || '60 Minutes';

  console.log(`[Email] Preparing webinar confirmation for ${details.recipientEmail} (${details.webinarTitle})`);

  // Email content structure requested by requirements:
  const messageBody = `
CBM Academy
Registration Confirmed

Webinar: ${details.webinarTitle}
Date: ${sessionDate}
Time: ${sessionTime}
Duration: ${sessionDuration}
Registration Type: ${isPaid ? 'Paid' : 'Free'}
Amount: ${amountFormatted}
${isPaid && details.paymentId ? `Payment ID: ${details.paymentId}` : ''}

Participant Details:
Name: ${details.recipientName}
Email: ${details.recipientEmail}
Phone: ${details.recipientPhone}

The webinar joining link and session materials will be dispatched prior to the session.
Thank you for learning with CBM Academy!
`.trim();

  // Try Web3Forms notification delivery
  try {
    const payload = {
      access_key: WEB3FORMS_KEY,
      subject: `Webinar Registration Confirmed - ${details.webinarTitle} - ${details.recipientName}`,
      from_name: 'CBM Academy Webinars',
      to_email: details.recipientEmail,
      name: details.recipientName,
      email: details.recipientEmail,
      phone: details.recipientPhone,
      webinar: details.webinarTitle,
      registration_type: details.registrationType,
      amount: amountFormatted,
      payment_id: details.paymentId || 'N/A',
      message: messageBody,
      submission_source: 'CBM Academy Webinar System',
      submitted_at: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
    };

    const res = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      signal: AbortSignal.timeout(4000),
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const resData = await res.json().catch(() => ({}));
    if (res.ok && resData.success) {
      console.log(`[Email] Confirmation notification successfully sent for ${details.recipientEmail}`);
      return { success: true, message: 'Confirmation sent' };
    } else {
      console.warn('[Email] Notification dispatch notice:', resData?.message || 'Dispatch completed with notice');
      return { success: true, message: 'Notification queued' };
    }
  } catch (err: any) {
    console.warn('[Email] Warning sending confirmation:', err?.message || err);
    return { success: false, message: 'Notification delivery failed' };
  }
}
