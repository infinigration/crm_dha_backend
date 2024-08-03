import app from "./app.js";
import { connectDB } from "./config/database.js";
import cloudinary from "cloudinary";
const port = process.env.PORT;

connectDB();

await cloudinary.v2.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET
});
app.listen(port, () => {
  console.log(`Listening on ${port}`);
});
