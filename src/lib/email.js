// Lightweight email helper for sending welcome emails.
// Uses the backend Nodemailer endpoint for sending emails.

export async function sendWelcomeEmail(user) {
  if (!user || !user.email)
    return Promise.reject(new Error("Missing user or email"));

  try {
    const resp = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/send-email`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        to: user.email,
        subject: `Welcome to CinemaHub, ${user.name || ""}`,
        text: `Hi ${
          user.name || ""
        },\n\nThanks for signing up to CinemaHub!\n\nEnjoy streaming.\n\n— CinemaHub Team`,
      }),
    });
    if (!resp.ok) {
      const txt = await resp.text();
      throw new Error(`Server email endpoint error: ${resp.status} ${txt}`);
    }
    return true;
  } catch (err) {
    console.error("sendWelcomeEmail failed:", err);
    throw err;
  }
}
