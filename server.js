const express = require('express');
const app = express();

app.use(express.json());
app.use(express.static(__dirname));

app.post('/admin/send', async (req, res) => {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email manquant' });

    // TODO: code d'envoi email ici

    res.json({ ok: true });
});

app.listen(process.env.PORT || 3000);
