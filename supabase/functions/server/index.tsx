import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "jsr:@supabase/supabase-js@2.49.8";

const app = new Hono();

app.use('*', logger(console.log));
app.use("/*", cors({
  origin: "*",
  allowHeaders: ["Content-Type", "Authorization"],
  allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  exposeHeaders: ["Content-Length"],
  maxAge: 600,
}));

// This function is retained only for compatibility while the deployment is
// retired. Production clients use the Supabase client with RLS directly.
// Keep health available, but prevent the legacy service-role routes from
// bypassing the table policies.
app.use("/make-server-bbe832b4/*", async (c, next) => {
  if (c.req.path === "/make-server-bbe832b4/health") return next();
  return c.json({ error: "Legacy API retired" }, 410);
});

// ─── Supabase admin client ─────────────────────────────────────

function adminClient() {
  return createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );
}

// ─── Health ────────────────────────────────────────────────────

app.get("/make-server-bbe832b4/health", (c) => c.json({ status: "ok" }));

// Schema setup is managed exclusively by versioned migrations.

// ─── Profiles ─────────────────────────────────────────────────

// Learning content, enrollment, and progress are accessed directly through the Supabase client so RLS remains authoritative.
// ─── Contacts ─────────────────────────────────────────────────

app.get("/make-server-bbe832b4/contacts", async (c) => {
  const userId = c.req.query("user_id");
  if (!userId) return c.json({ error: "user_id required" }, 400);
  const { data, error } = await adminClient().from("contacts").select("*").eq("user_id", userId).order("updated_at", { ascending: false });
  if (error) return c.json({ error: error.message }, 400);
  return c.json(data);
});

app.post("/make-server-bbe832b4/contacts", async (c) => {
  const body = await c.req.json();
  const now = new Date().toISOString();
  const { data, error } = await adminClient().from("contacts").insert({ ...body, created_at: now, updated_at: now }).select().single();
  if (error) return c.json({ error: error.message }, 400);
  return c.json(data, 201);
});

app.put("/make-server-bbe832b4/contacts/:id", async (c) => {
  const body = await c.req.json();
  const { data, error } = await adminClient().from("contacts").update({ ...body, updated_at: new Date().toISOString() }).eq("id", c.req.param("id")).select().single();
  if (error) return c.json({ error: error.message }, 400);
  return c.json(data);
});

app.delete("/make-server-bbe832b4/contacts/:id", async (c) => {
  const { error } = await adminClient().from("contacts").delete().eq("id", c.req.param("id"));
  if (error) return c.json({ error: error.message }, 400);
  return c.json({ deleted: true });
});

// ─── Body Logs ────────────────────────────────────────────────

app.get("/make-server-bbe832b4/body-logs", async (c) => {
  const userId = c.req.query("user_id");
  if (!userId) return c.json({ error: "user_id required" }, 400);
  const { data, error } = await adminClient().from("body_logs").select("*").eq("user_id", userId).order("logged_at");
  if (error) return c.json({ error: error.message }, 400);
  return c.json(data);
});

app.post("/make-server-bbe832b4/body-logs", async (c) => {
  const body = await c.req.json();
  const { data, error } = await adminClient().from("body_logs").upsert(body, { onConflict: "user_id,logged_at" }).select().single();
  if (error) return c.json({ error: error.message }, 400);
  return c.json(data, 201);
});

// ─── Diet Logs ────────────────────────────────────────────────

app.get("/make-server-bbe832b4/diet-logs", async (c) => {
  const userId = c.req.query("user_id");
  if (!userId) return c.json({ error: "user_id required" }, 400);
  const { data, error } = await adminClient().from("diet_logs").select("*").eq("user_id", userId).order("logged_at");
  if (error) return c.json({ error: error.message }, 400);
  return c.json(data);
});

app.post("/make-server-bbe832b4/diet-logs", async (c) => {
  const body = await c.req.json();
  const { data, error } = await adminClient().from("diet_logs").insert(body).select().single();
  if (error) return c.json({ error: error.message }, 400);
  return c.json(data, 201);
});

// ─── Finance Records ──────────────────────────────────────────

app.get("/make-server-bbe832b4/finance-records", async (c) => {
  const userId = c.req.query("user_id");
  if (!userId) return c.json({ error: "user_id required" }, 400);
  const { data, error } = await adminClient().from("finance_records").select("*").eq("user_id", userId).order("month_year", { ascending: false });
  if (error) return c.json({ error: error.message }, 400);
  return c.json(data);
});

app.post("/make-server-bbe832b4/finance-records", async (c) => {
  const body = await c.req.json();
  const now = new Date().toISOString();
  const { data, error } = await adminClient().from("finance_records").upsert({ ...body, updated_at: now }, { onConflict: "user_id,month_year" }).select().single();
  if (error) return c.json({ error: error.message }, 400);
  return c.json(data, 201);
});

// ─── Evolution Metrics ────────────────────────────────────────

app.get("/make-server-bbe832b4/evolution-metrics", async (c) => {
  const userId = c.req.query("user_id");
  if (!userId) return c.json({ error: "user_id required" }, 400);
  const { data, error } = await adminClient().from("evolution_metrics").select("*").eq("user_id", userId).order("recorded_at", { ascending: false });
  if (error) return c.json({ error: error.message }, 400);
  return c.json(data);
});

app.post("/make-server-bbe832b4/evolution-metrics", async (c) => {
  const body = await c.req.json();
  const { data, error } = await adminClient().from("evolution_metrics").insert(body).select().single();
  if (error) return c.json({ error: error.message }, 400);
  return c.json(data, 201);
});

// ─── Admin: Community stats ───────────────────────────────────

app.get("/make-server-bbe832b4/admin/stats", async (c) => {
  const sb = adminClient();
  const [studentsRes, coursesRes, enrollsRes] = await Promise.all([
    sb.from("profiles").select("id", { count: "exact", head: true }).eq("role", "student"),
    sb.from("courses").select("id", { count: "exact", head: true }).eq("is_published", true),
    sb.from("enrollments").select("id", { count: "exact", head: true }),
  ]);
  return c.json({
    students: studentsRes.count ?? 0,
    courses: coursesRes.count ?? 0,
    enrollments: enrollsRes.count ?? 0,
  });
});

app.get("/make-server-bbe832b4/admin/students", async (c) => {
  const { data, error } = await adminClient().from("profiles").select("*").eq("role", "student").order("created_at", { ascending: false });
  if (error) return c.json({ error: error.message }, 400);
  return c.json(data);
});

Deno.serve(app.fetch);
