import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API routes FIRST
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  app.post("/api/tts", async (req, res) => {
    const { text, voice } = req.body;
    
    const appId = process.env.VBEE_APP_ID;
    const token = process.env.VBEE_TOKEN;

    if (!appId || !token) {
      return res.status(500).json({ 
        error: "VBEE_APP_ID or VBEE_TOKEN environment variables are missing. Please configure them in the AI Studio Settings." 
      });
    }

    try {
      // Call VBee AIVoice API
      const response = await fetch("https://vbee.vn/api/v1/convert-tts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "App-ID": appId,
          "Token": token
        },
        body: JSON.stringify({
          text: text,
          voice: voice || "hn_male_xuantin_vdg_v2",
          bit_rate: 128000,
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        return res.status(response.status).json({ error: data.message || "Failed to generate TTS" });
      }

      res.json(data);
    } catch (error) {
      console.error("TTS Error:", error);
      res.status(500).json({ error: "Failed to communicate with VBee API" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
