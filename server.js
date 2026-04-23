const allowedKeys = [
  "A1B2C3-RAHUL",
  "X9Y8Z7-USER2"
];

app.get("/check", (req, res) => {
  const key = req.query.key;

  if (!key) return res.json({ access: false });

  const allowed = allowedKeys.includes(key);

  res.json({ access: allowed });
});
