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

// ─── Courses ──────────────────────────────────────────────────

app.get("/make-server-bbe832b4/courses", async (c) => {
  const { data, error } = await adminClient().from("courses").select("*").order("order_index");
  if (error) return c.json({ error: error.message }, 400);
  return c.json(data);
});

app.post("/make-server-bbe832b4/courses", async (c) => {
  const body = await c.req.json();
  const { data, error } = await adminClient().from("courses").insert(body).select().single();
  if (error) return c.json({ error: error.message }, 400);
  return c.json(data, 201);
});

app.put("/make-server-bbe832b4/courses/:id", async (c) => {
  const body = await c.req.json();
  const { data, error } = await adminClient().from("courses").update({ ...body, updated_at: new Date().toISOString() }).eq("id", c.req.param("id")).select().single();
  if (error) return c.json({ error: error.message }, 400);
  return c.json(data);
});

app.delete("/make-server-bbe832b4/courses/:id", async (c) => {
  const { error } = await adminClient().from("courses").delete().eq("id", c.req.param("id"));
  if (error) return c.json({ error: error.message }, 400);
  return c.json({ deleted: true });
});

// ─── Modules ──────────────────────────────────────────────────

app.get("/make-server-bbe832b4/courses/:courseId/modules", async (c) => {
  const { data, error } = await adminClient().from("modules").select("*, lessons(*)").eq("course_id", c.req.param("courseId")).order("order_index");
  if (error) return c.json({ error: error.message }, 400);
  return c.json(data);
});

app.post("/make-server-bbe832b4/modules", async (c) => {
  const body = await c.req.json();
  const { data, error } = await adminClient().from("modules").insert(body).select().single();
  if (error) return c.json({ error: error.message }, 400);
  return c.json(data, 201);
});

app.put("/make-server-bbe832b4/modules/:id", async (c) => {
  const body = await c.req.json();
  const { data, error } = await adminClient().from("modules").update(body).eq("id", c.req.param("id")).select().single();
  if (error) return c.json({ error: error.message }, 400);
  return c.json(data);
});

app.delete("/make-server-bbe832b4/modules/:id", async (c) => {
  const { error } = await adminClient().from("modules").delete().eq("id", c.req.param("id"));
  if (error) return c.json({ error: error.message }, 400);
  return c.json({ deleted: true });
});

// ─── Lessons ──────────────────────────────────────────────────

app.get("/make-server-bbe832b4/modules/:moduleId/lessons", async (c) => {
  const { data, error } = await adminClient().from("lessons").select("*").eq("module_id", c.req.param("moduleId")).order("order_index");
  if (error) return c.json({ error: error.message }, 400);
  return c.json(data);
});

app.post("/make-server-bbe832b4/lessons", async (c) => {
  const body = await c.req.json();
  const { data, error } = await adminClient().from("lessons").insert(body).select().single();
  if (error) return c.json({ error: error.message }, 400);
  return c.json(data, 201);
});

app.put("/make-server-bbe832b4/lessons/:id", async (c) => {
  const body = await c.req.json();
  const { data, error } = await adminClient().from("lessons").update(body).eq("id", c.req.param("id")).select().single();
  if (error) return c.json({ error: error.message }, 400);
  return c.json(data);
});

app.delete("/make-server-bbe832b4/lessons/:id", async (c) => {
  const { error } = await adminClient().from("lessons").delete().eq("id", c.req.param("id"));
  if (error) return c.json({ error: error.message }, 400);
  return c.json({ deleted: true });
});

// ─── Quizzes ──────────────────────────────────────────────────

app.get("/make-server-bbe832b4/quizzes", async (c) => {
  const courseId = c.req.query("course_id");
  let query = adminClient().from("quizzes").select("*, quiz_questions(*)");
  if (courseId) query = query.eq("course_id", courseId);
  const { data, error } = await query;
  if (error) return c.json({ error: error.message }, 400);
  return c.json(data);
});

app.post("/make-server-bbe832b4/quizzes", async (c) => {
  const body = await c.req.json();
  const { data, error } = await adminClient().from("quizzes").insert(body).select().single();
  if (error) return c.json({ error: error.message }, 400);
  return c.json(data, 201);
});

app.post("/make-server-bbe832b4/quiz-questions", async (c) => {
  const body = await c.req.json();
  const { data, error } = await adminClient().from("quiz_questions").insert(body).select().single();
  if (error) return c.json({ error: error.message }, 400);
  return c.json(data, 201);
});

// ─── Enrollments ──────────────────────────────────────────────

app.get("/make-server-bbe832b4/enrollments", async (c) => {
  const userId = c.req.query("user_id");
  if (!userId) return c.json({ error: "user_id required" }, 400);
  const { data, error } = await adminClient().from("enrollments").select("*, courses(*)").eq("user_id", userId);
  if (error) return c.json({ error: error.message }, 400);
  return c.json(data);
});

app.post("/make-server-bbe832b4/enrollments", async (c) => {
  const { user_id, course_id } = await c.req.json();
  const { data, error } = await adminClient().from("enrollments").upsert({ user_id, course_id }, { onConflict: "user_id,course_id" }).select().single();
  if (error) return c.json({ error: error.message }, 400);
  return c.json(data, 201);
});

// ─── Progress ─────────────────────────────────────────────────

app.get("/make-server-bbe832b4/progress", async (c) => {
  const userId = c.req.query("user_id");
  if (!userId) return c.json({ error: "user_id required" }, 400);
  const { data, error } = await adminClient().from("progress").select("*").eq("user_id", userId);
  if (error) return c.json({ error: error.message }, 400);
  return c.json(data);
});

app.post("/make-server-bbe832b4/progress", async (c) => {
  const { user_id, lesson_id } = await c.req.json();
  const { data, error } = await adminClient().from("progress").upsert({ user_id, lesson_id }, { onConflict: "user_id,lesson_id" }).select().single();
  if (error) return c.json({ error: error.message }, 400);
  return c.json(data, 201);
});

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
