const SUPABASE_URL = 'https://lvyfksaoqkxngxqbwewi.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_yoXJu8P-nSV_XRbQvQDOmQ_-9hAUL48';

module.exports = async function handler(req, res) {
  const raw = Array.isArray(req.query.code) ? req.query.code[0] : req.query.code;
  const code = String(raw || '').trim().toUpperCase();
  if (!/^QR-\d{3,}$/.test(code)) {
    return res.status(400).send('Código QR inválido.');
  }

  try {
    const response = await fetch(SUPABASE_URL + '/rest/v1/rpc/central_qr_redirect', {
      method: 'POST',
      headers: {
        apikey: SUPABASE_PUBLISHABLE_KEY,
        Authorization: 'Bearer ' + SUPABASE_PUBLISHABLE_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ p_code: code })
    });

    if (!response.ok) {
      console.error('Supabase QR redirect error:', response.status, await response.text());
      return res.status(502).send('Não foi possível consultar este QR Code.');
    }

    const destination = await response.json();
    if (typeof destination !== 'string' || !/^https?:\/\//i.test(destination)) {
      return res.status(404).send('QR Code não encontrado ou inativo.');
    }

    return res.redirect(302, destination);
  } catch (error) {
    console.error('QR redirect failure:', error);
    return res.status(500).send('Erro ao redirecionar QR Code.');
  }
};
