import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // In-memory/File-based storage for logs and feedback
  // In a production app, use Firestore or a SQL DB
  const interactions: any[] = [];
  const feedbacks: any[] = [];

  app.post("/api/logs", (req, res) => {
    const log = { ...req.body, sessionId: req.headers['x-session-id'] || 'anon', timestamp: new Date().toISOString() };
    interactions.push(log);
    console.log("Logged interaction:", log);
    res.json({ status: "logged" });
  });

  app.post("/api/feedback", (req, res) => {
    const feedback = { ...req.body, timestamp: new Date().toISOString() };
    feedbacks.push(feedback);
    console.log("Logged feedback:", feedback);
    res.json({ status: "success" });
  });

  // API Route for Daily Awareness
  // This will be reachable at /api/awareness
  // In a real app, this might use a cron job or background worker.
  // Here it provides a hook for the frontend to trigger fresh info gathering.
  app.get("/api/awareness", async (req, res) => {
    try {
      // In a production app, we would use Gemini with Grounding here 
      // but we'll handle the actual AI logic on the frontend to keep 
      // the Gemini API usage standard and safe as per guidelines.
      // This route will return the source list and metadata.
      res.json({
        sources: [
          "PubMed (biomedical/general health)",
          "EMBASE",
          "CINAHL",
          "Cochrane Library",
          "Elsevier",
          "MDPI",
          "CDC"
        ],
        lastUpdate: new Date().toISOString()
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch awareness metadata" });
    }
  });

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
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
