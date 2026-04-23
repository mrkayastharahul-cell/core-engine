const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

// 🔒 YOUR ALLOWED USERS
const allowedUsers = [
  "user123",
  "rahul001",
  "test001"
];

// API
app.get("/check", (req, res) => {
  const uid = req.query.uid;

  if (!uid) {
    return res.json({ access: false });
  }

  const allowed = allowedUsers.includes(uid);

  res.json({ access: allowed });
});

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
