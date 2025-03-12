const express = require("express");
const fs = require("fs").promises;
const path = require("path");
const { v4: uuidv4 } = require("uuid");

const app = express();
const PORT = process.env.PORT || 3000;
const CACHE_DIR = path.join(__dirname, "cache");

// Create cache directory if it doesn't exist
async function ensureCacheExists() {
  try {
    await fs.mkdir(CACHE_DIR, { recursive: true });
  } catch (err) {
    console.error("Failed to create cache directory:", err);
  }
}

// Parse JSON and URL-encoded body
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Serve static files
app.use(express.static("public"));
app.use("/assets", express.static("assets"));

// API endpoint to get cached requests
app.get("/api/requests", async (req, res) => {
  try {
    const files = await fs.readdir(CACHE_DIR);

    const requests = await Promise.all(
      files
        .filter((file) => file.endsWith(".json"))
        .sort((a, b) => {
          // Sort by timestamp (descending)
          const timeA = parseInt(a.split("-")[0]);
          const timeB = parseInt(b.split("-")[0]);
          return timeB - timeA;
        })
        .slice(0, 100) // Limit to the latest 100 requests
        .map(async (file) => {
          const data = await fs.readFile(path.join(CACHE_DIR, file), "utf8");
          return JSON.parse(data);
        })
    );

    res.json(requests);
  } catch (err) {
    console.error("Error fetching requests:", err);
    res.status(500).json({ error: "Failed to fetch requests" });
  }
});

// Catch-all handler for any request
app.all("*", async (req, res, next) => {
  // If requesting the root path with GET and no accept header for JSON, serve the HTML
  if (
    req.path === "/" &&
    req.method === "GET" &&
    !req.headers.accept?.includes("application/json")
  ) {
    return next();
  }

  // Capture request data
  const timestamp = Date.now();
  const id = uuidv4();

  const requestData = {
    id,
    timestamp,
    method: req.method,
    path: req.path,
    query: req.query,
    headers: req.headers,
    body: req.body,
    ip: req.ip,
  };

  // Save to cache
  try {
    await ensureCacheExists();
    await fs.writeFile(
      path.join(CACHE_DIR, `${timestamp}-${id}.json`),
      JSON.stringify(requestData, null, 2)
    );
  } catch (err) {
    console.error("Failed to cache request:", err);
  }

  // Respond with the captured data
  res.json(requestData);
});

// Serve index.html for root path
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Start the server
app.listen(PORT, async () => {
  await ensureCacheExists();
  console.log(`Server running on http://localhost:${PORT}`);
});
