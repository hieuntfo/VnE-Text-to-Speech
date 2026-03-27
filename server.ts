import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { GoogleGenAI } from "@google/genai";

// Helper to convert raw PCM (from Gemini TTS) to playable WAV format
function getWavBytes(pcmData: Buffer, sampleRate: number = 24000): Buffer {
  const numChannels = 1;
  const bitsPerSample = 16;
  const byteRate = sampleRate * numChannels * (bitsPerSample / 8);
  const blockAlign = numChannels * (bitsPerSample / 8);
  const dataSize = pcmData.length;

  const buffer = Buffer.alloc(44 + dataSize);
  
  // RIFF chunk descriptor
  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write('WAVE', 8);
  
  // fmt sub-chunk
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16); // Subchunk1Size
  buffer.writeUInt16LE(1, 20); // AudioFormat
  buffer.writeUInt16LE(numChannels, 22);
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(byteRate, 28);
  buffer.writeUInt16LE(blockAlign, 32);
  buffer.writeUInt16LE(bitsPerSample, 34);
  
  // data sub-chunk
  buffer.write('data', 36);
  buffer.writeUInt32LE(dataSize, 40);
  
  // PCM data
  pcmData.copy(buffer, 44);
  
  return buffer;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API routes FIRST
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  app.post("/api/convert", async (req, res) => {
    const { text, voice } = req.body;
    
    if (!text) {
      return res.status(400).json({ error: "Text is required" });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "GEMINI_API_KEY is missing. Please configure it in the AI Studio Settings." });
    }

    try {
      const ai = new GoogleGenAI({ apiKey });
      
      // 1. Generate Script using Gemini 3.1 Flash
      const scriptPrompt = `You are an expert social media scriptwriter for VnExpress. 
      Convert the following article into a short, engaging audio script suitable for a YouTube Short or TikTok.
      Format the output strictly as a JSON object with three keys: "hook", "body", and "cta".
      Keep it concise (under 100 words total).
      
      Article:
      ${text}`;

      const scriptResponse = await ai.models.generateContent({
        model: "gemini-3.1-flash-preview",
        contents: scriptPrompt,
        config: {
          responseMimeType: "application/json",
        }
      });

      const scriptData = JSON.parse(scriptResponse.text || "{}");
      const fullScript = `${scriptData.hook || ''} ${scriptData.body || ''} ${scriptData.cta || ''}`.trim();

      if (!fullScript) {
        throw new Error("Failed to generate script from text.");
      }

      // 2. Generate TTS using Gemini 2.5 Flash TTS
      const ttsResponse = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text: fullScript }] }],
        config: {
          responseModalities: ["AUDIO"],
          speechConfig: {
              voiceConfig: {
                prebuiltVoiceConfig: { voiceName: voice || "Zephyr" },
              },
          },
        },
      });

      const base64Audio = ttsResponse.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      
      let audioUrl = null;
      if (base64Audio) {
        const pcmBuffer = Buffer.from(base64Audio, 'base64');
        const wavBuffer = getWavBytes(pcmBuffer, 24000);
        audioUrl = `data:audio/wav;base64,${wavBuffer.toString('base64')}`;
      } else {
        throw new Error("No audio data returned from Gemini TTS.");
      }

      res.json({ 
        script: scriptData,
        audio: audioUrl 
      });
    } catch (error: any) {
      console.error("Conversion Error:", error);
      res.status(500).json({ error: error.message || "Failed to process with Gemini" });
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
