const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());

const PORT = process.env.PORT || 3000;

// 🔒 Allowed Keys
const allowedKeys = [
  "A1B2C3-RAHUL"
];

// Root check
app.get("/", (req, res) => {
  res.send("Server is running");
});

// Access check
app.get("/check", (req, res) => {
  const key = req.query.key;

  if (!key) return res.json({ access: false });

  const allowed = allowedKeys.includes(key);
  res.json({ access: allowed });
});

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
