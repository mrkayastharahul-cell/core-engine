const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors()); // 🔥 IMPORTANT

const PORT = process.env.PORT || 3000;

// 🔒 Allowed users
const allowedUsers = [
  "rahul001"
];

app.get("/check", (req, res) => {
  const uid = req.query.uid;

  if (!uid) return res.json({ access: false });

  const allowed = allowedUsers.includes(uid);

  res.json({ access: allowed });
});

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
