import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database("web2apk.db");

// Initialize database
db.exec(`
  CREATE TABLE IF NOT EXISTS jobs (
    id TEXT PRIMARY KEY,
    url TEXT,
    appName TEXT,
    packageName TEXT,
    version TEXT,
    orientation TEXT,
    androidVersion TEXT,
    themeColor TEXT,
    splashColor TEXT,
    features TEXT,
    customJS TEXT,
    createdAt INTEGER
  )
`);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/jobs", (req, res) => {
    const jobs = db.prepare("SELECT * FROM jobs ORDER BY createdAt DESC LIMIT 20").all();
    res.json(jobs.map(j => ({
      ...j,
      features: JSON.parse(j.features as string)
    })));
  });

  app.post("/api/jobs", (req, res) => {
    const job = req.body;
    const stmt = db.prepare(`
      INSERT INTO jobs (id, url, appName, packageName, version, orientation, androidVersion, themeColor, splashColor, features, customJS, createdAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    stmt.run(
      job.id,
      job.url,
      job.appName,
      job.packageName,
      job.version,
      job.orientation,
      job.androidVersion,
      job.themeColor,
      job.splashColor,
      JSON.stringify(job.features),
      job.customJS,
      job.createdAt
    );
    
    res.status(201).json({ status: "success" });
  });

  app.delete("/api/jobs/:id", (req, res) => {
    db.prepare("DELETE FROM jobs WHERE id = ?").run(req.params.id);
    res.json({ status: "success" });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
