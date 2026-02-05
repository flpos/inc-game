import express from "express";
import fs from "node:fs";
import path from "node:path";
import * as esbuild from "esbuild";

const baseTypescriptPath = "./src/game-files";
const app = express();

app.use(express.static("static"));

app.get("/", (_req, res) => {
  return res.json("Hello World");
});

app.get("/ts/:file", (req, res) => {
  const requestedFile = req.params.file;
  const input = fs.readFileSync(
    path.resolve(baseTypescriptPath, requestedFile),
  );
  const file = esbuild.transformSync(input, { loader: "ts" }).code;
  res.setHeader("Content-Type", "text/javascript");
  res.send(file);
});

app.listen(8000, () => {
  console.log("Aplicação rodando em http://localhost:8000");
});
