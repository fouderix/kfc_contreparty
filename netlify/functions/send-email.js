const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

exports.handler = async (event) => {
  try {
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

    let html = fs.readFileSync(path.join(__dirname, 'email_template.html'), 'utf8');
    html = html.replace('&resto={{resto}}"', `&resto=${encodeURIComponent(resto)}"`);
    html = html.replace(/\{\{nom\}\}/g, nom);
    html = html.replace(/\{\{resto\}\}/g, resto);
    html = html.replace(/\{\{date\}\}/g, date);

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
  } catch (err) {
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: err.message }),
    };
  }
};
