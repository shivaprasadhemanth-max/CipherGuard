const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.disable("x-powered-by");
app.use(express.static(path.join(__dirname, "public"), {
  etag: true,
  maxAge: "1h"
}));

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", app: "CipherGuard", version: "1.0.0" });
});

app.get("*", (_req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`CipherGuard is running on port ${PORT}`);
});