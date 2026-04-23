const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());

const PORT = process.env.PORT || 3000;

// 🔒 allowed users
const allowedUsers = ["rahul001"];

// health check (so you can see something at root)
app.get("/", (req, res) => {
  res.send("Server is running");
});

// 👇 IMPORTANT: define /check route
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
