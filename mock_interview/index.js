import "dotenv/config";
import app from "./src/app.js";

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Mock Interview AI running on port ${PORT}`);
}).on('error', (err) => {
  console.error("Server failed to start:", err);
});