const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

export default async function handler(req, res) {
  const { refreshToken } = req.body;
  const url = `https://oauth2.googleapis.com/token?client_id=${GOOGLE_CLIENT_ID}&client_secret=${GOOGLE_CLIENT_SECRET}&refresh_token=${refreshToken}&grant_type=refresh_token`;
  const response = await fetch(url, { method: "POST" });
  const data = await response.json();
  res.status(200).json(data);
}
