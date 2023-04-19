import fetch from "node-fetch";

export default async function handler(req, res) {
  const { url } = req.query;

  if (!url) {
    res.status(400).json({ error: "Missing 'url' parameter" });
    return;
  }

  try {
    const response = await fetch(url);
    const buffer = await response.buffer();

    res.setHeader("Content-Type", response.headers.get("Content-Type"));
    res.setHeader("Content-Length", response.headers.get("Content-Length"));
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET");

    res.status(200).send(buffer);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch image" });
  }
}
