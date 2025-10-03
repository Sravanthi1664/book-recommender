const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const recommend = require("./recommend"); // make sure this file exports a function

const app = express();
app.use(cors({
  origin: "https://book-recommender-2hld.onrender.com",
  methods: ["GET","POST","OPTIONS"]
}));

app.use(bodyParser.json());

app.post("/recommend", async (req, res) => {
  const { title } = req.body;
  if (!title) return res.status(400).json({ error: "Title required" });

  try {
    const recommendations = await recommend(title);
    res.json(recommendations);
  } catch (err) {
    console.error("Recommendation error:", err);
    res.status(500).json({ error: err.toString() });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

