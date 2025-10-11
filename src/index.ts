import { Hono } from "hono";
import { allRoute } from "./routes/all";
import { statRoute } from "./routes/stat";
import { providersRoute } from "./routes/providers";

const app = new Hono();

app.route("/api", allRoute);
app.route("/api", providersRoute);
app.route("/api", statRoute);

export default app;
