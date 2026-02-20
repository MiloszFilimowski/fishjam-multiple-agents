import "dotenv/config";
import express from "express";

const app = express();
const port = 3000;

const fishjamId = process.env.FISHJAM_ID!;
const fishjamManagementToken = process.env.FISHJAM_MANAGEMENT_TOKEN!;

app.get("/", (_req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
