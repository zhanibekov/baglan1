const FORM_NAME = "wedding-rsvp";

const clean = (value) => (typeof value === "string" ? value.trim() : "");

export default {
  async formSubmitted(event) {
    const data = event?.data ?? {};
    const submittedForm = clean(data["form-name"] || data.form_name);

    if (submittedForm && submittedForm !== FORM_NAME) {
      return;
    }

    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!botToken || !chatId) {
      console.error("Telegram notification is not configured.");
      return;
    }

    const name = clean(data.name) || "Не указано";
    const attendance = clean(data.attendance) || "Не указано";
    const message = [
      "Новый ответ на приглашение",
      "",
      `Имя: ${name}`,
      `Ответ: ${attendance}`,
    ].join("\n");

    const response = await fetch(
      `https://api.telegram.org/bot${botToken}/sendMessage`,
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
        }),
      },
    );

    if (!response.ok) {
      const result = await response.json().catch(() => ({}));
      throw new Error(
        `Telegram notification failed (${response.status}): ${result.description || "Unknown error"}`,
      );
    }
  },
};
