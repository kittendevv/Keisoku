import { Hono } from "hono";
import { allRoute } from "./routes/all";
import { statRoute } from "./routes/stat";
import { providersRoute } from "./routes/providers";
import { loadProviders } from "./utils/providers";

const app = new Hono();

// Load providers on startup
loadProviders();

const api = new Hono();

api.route("/:name", allRoute);
api.route("/:name", statRoute);
api.route("/:name", providersRoute);

app.route("/api", api);

export default app;
