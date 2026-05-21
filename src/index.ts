import { Elysia } from "elysia";
import { fetchGithubPackageDownloads } from "./providers/github";

const app = new Elysia()
  .get("/", () => "Keisoku API, visit /api/docs for API documentation")
  .get(
    "/test",
    fetchGithubPackageDownloads("kittendevv/Invio", "invio-backend"),
  )
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);
