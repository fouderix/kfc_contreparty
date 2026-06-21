const nodemailer = require('nodemailer');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const { email, nom, resto, date } = JSON.parse(event.body);
  if (!email || !nom || !resto || !date) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Champs manquants' }) };
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });

  const html = `
    <table width="100%" cellpadding="0" cellspacing="0" style="font-family:Arial,sans-serif;font-size:14px;color:#000;">
      <tr><td style="padding:24px;">
      <tr><td>
        <p style="margin:0 0 12px;">Bonjour ${nom},</p>
        <p style="margin:0 0 12px;">Vous avez récemment gagné un <strong>Menu Bucket Duo</strong> chez <strong>${resto}</strong>.</p>
        <p style="margin:0 0 6px;">Voici le lien pour récupérer votre cadeau :</p>
        <p style="margin:0 0 12px;">
          <a href="https://contreparty.ddns.net/?use_gain=28374cd2-1777-4ed7-bce8-4ce3fc685cfb&expires=1784666833&signature=263f0707a61fc1e824a9bb940d4be6fa5bd770d65b8ab75275bf06de1f6f9794&resto=${encodeURIComponent(resto)}"
             style="color:#1155CC;">
            https://contreparty.fr/use_gain/196/28374cd2-1777-4ed7-bce8-4ce3fc685cfb?expires=1784666833&amp;signature=263f0707a61fc1e824a9bb940d4be6fa5bd770d65b8ab75275bf06de1f6f9794
          </a>
        </p>
        <p style="margin:0 0 12px;">Il sera valide dans 5 heures, et expirera le <strong>${date}</strong>.</p>
        <p style="margin:0 0 12px;">Vous devrez présenter cette page lors de votre prochain passage en caisse. L'opérateur vous confiera le code de validation afin de valider votre gain.</p>
        <p style="margin:0;">À très bientôt, chez <strong>${resto}</strong>.</p>
      </td></tr>
    </table>
  `;

  await transporter.sendMail({
    from: `"ContreParty" <${process.env.GMAIL_USER}>`,
    to: email,
    subject: `${resto} - Votre cadeau`,
    html,
  });

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ok: true }),
  };
};
