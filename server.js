
const express = require("express");
const cors = require("cors");
const multer = require("multer");

const app = express();

app.use(cors());
app.use(express.json());

const upload = multer({
  dest: "uploads/"
});

app.get("/", (req, res) => {
  res.json({
    message: "AI Video Editor Backend Aktif"
  });
});

app.post("/upload", upload.single("media"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      message: "File tidak ditemukan"
    });
  }

  res.json({
    message: "Upload berhasil",
    filename: req.file.filename
  });
});

app.listen(3000, () => {
  console.log("Server berjalan di http://localhost:3000");
});


const ollama = require("ollama").default;

app.post("/generate-script", async (req, res) => {
  try {
    const { service } = req.body;

    const response = await ollama.chat({
      model: "gemma3:1b",
      messages: [
        {
          role: "user",
          content: `Buatkan naskah video promosi
          berdurasi 30 detik untuk jasa ${service}.
          Buat 5 scene dengan teks singkat,
          narasi dan ajakan bertindak.`
        }
      ]
    });

    res.json({
      script: response.message.content
    });

  } catch (error) {
    res.status(500).json({
      message: "Gagal membuat naskah AI"
    });
  }
});
