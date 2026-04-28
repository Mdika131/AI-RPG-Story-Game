const express = require("express");
const path = require("path");

// Ini bagian yang hilang tadi, untuk mendefinisikan 'app'
const app = express();

app.use(express.static("public"));
app.use(express.json());

app.post("/game-api", async (req, res) => {
  const { prompt } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;

  console.log("1. Request masuk dari game!");
  
  if (!apiKey) {
    console.log("ERROR: API Key tidak ditemukan di Server!");
    return res.status(500).json({ error: "API Key kosong" });
  }

  try {
    console.log("2. Menghubungi Google Gemini...");
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${apiKey}`;
    
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { response_mime_type: "application/json" }
      })
    });

    if (!response.ok) {
        console.log("ERROR DARI GOOGLE:", response.status, response.statusText);
        throw new Error("Ditolak oleh Google");
    }

    const data = await response.json();
    console.log("3. Jawaban dari Gemini berhasil diterima!");
    res.json(data);
  } catch (error) {
    console.log("4. Terjadi Error:", error.message);
    res.status(500).json({ error: "Gagal terhubung ke dimensi astral." });
  }
});

// Port wajib 7860 untuk Hugging Face Spaces
app.listen(7860, () => {
    console.log("Server Isekai Aktif di port 7860!");
});