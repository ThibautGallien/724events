export async function POST(req) {
  const body = await req.json();
  const { name, email, message } = body;

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  const text = `📬 Nouveau message du portfolio :\n\n👤 Nom : ${name}\n📧 Email : ${email}\n💬 Message : ${message}`;

  const telegramUrl = `https://api.telegram.org/bot${token}/sendMessage`;

  const res = await fetch(telegramUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text,
    }),
  });

  if (!res.ok) {
    console.error("Erreur d'envoi Telegram", await res.text());
    return new Response(JSON.stringify({ error: "Échec d'envoi" }), {
      status: 500,
    });
  }

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
  });
}
