require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.static('public'));  // Serve static files (e.g., videos)

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
