const fetch = require("node-fetch");

module.exports = async (req, res) => {
  const { code, site_id } = req.query;

  if (!code) {
    const redirectUri = process.env.REDIRECT_URI;
    return res.redirect(
      `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}&redirect_uri=${redirectUri}&scope=repo`
    );
  }

  const response = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      client_id: process.env.GITHUB_CLIENT_ID,
      client_secret: process.env.GITHUB_CLIENT_SECRET,
      code,
    }),
  });

  const data = await response.json();

  if (data.error) {
    return res.status(500).json({ error: data.error_description });
  }

  const frontend =
    process.env.FRONTEND_URL || "https://www.lesprosdecherbourg.fr/admin/";
  return res.redirect(`${frontend}#/callback?token=${data.access_token}`);
};
