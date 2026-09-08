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

// ─── Schema Setup ─────────────────────────────────────────────
// POST /make-server-bbe832b4/setup-schema
// Runs once to create all domain tables. Safe to re-run (IF NOT EXISTS).

app.post("/make-server-bbe832b4/setup-schema", async (c) => {
  const sb = adminClient();

  const SCHEMA_SQL = `
    -- profiles
    CREATE TABLE IF NOT EXISTS profiles (
      id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
      email TEXT NOT NULL DEFAULT '',
      display_name TEXT NOT NULL DEFAULT '',
      role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('student','admin')),
      avatar_url TEXT,
      vsm_score INTEGER NOT NULL DEFAULT 0,
      vsm_level INTEGER NOT NULL DEFAULT 1,
      onboarding_done BOOLEAN NOT NULL DEFAULT FALSE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    -- courses
    CREATE TABLE IF NOT EXISTS courses (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      title TEXT NOT NULL,
      subtitle TEXT NOT NULL DEFAULT '',
      image_url TEXT,
      tag TEXT NOT NULL DEFAULT 'Novo',
      description TEXT,
      is_published BOOLEAN NOT NULL DEFAULT TRUE,
      order_index INTEGER NOT NULL DEFAULT 0,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    -- modules
    CREATE TABLE IF NOT EXISTS modules (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
      title TEXT NOT NULL,
      order_index INTEGER NOT NULL DEFAULT 0,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    -- lessons
    CREATE TABLE IF NOT EXISTS lessons (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      module_id UUID NOT NULL REFERENCES modules(id) ON DELETE CASCADE,
      title TEXT NOT NULL,
      duration TEXT NOT NULL DEFAULT '',
      type TEXT NOT NULL DEFAULT 'video' CHECK (type IN ('video','text','audio')),
      content_url TEXT,
      order_index INTEGER NOT NULL DEFAULT 0,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    -- quizzes
    CREATE TABLE IF NOT EXISTS quizzes (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
      lesson_id UUID REFERENCES lessons(id) ON DELETE SET NULL,
      title TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    -- quiz_questions
    CREATE TABLE IF NOT EXISTS quiz_questions (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      quiz_id UUID NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
      question TEXT NOT NULL,
      options JSONB NOT NULL DEFAULT '[]',
      correct_answer INTEGER NOT NULL DEFAULT 0,
      order_index INTEGER NOT NULL DEFAULT 0
    );

    -- enrollments
    CREATE TABLE IF NOT EXISTS enrollments (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
      course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
      enrolled_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      UNIQUE(user_id, course_id)
    );

    -- progress
    CREATE TABLE IF NOT EXISTS progress (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
      lesson_id UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
      completed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      UNIQUE(user_id, lesson_id)
    );

    -- contacts (CRM / social pipeline)
    CREATE TABLE IF NOT EXISTS contacts (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
      name TEXT NOT NULL,
      age INTEGER,
      photo_url TEXT,
      stage TEXT NOT NULL DEFAULT 'Abridor Enviado'
        CHECK (stage IN ('Abridor Enviado','Conversa Fluindo','Conforto Estabelecido','Encontro Solicitado')),
      platform TEXT NOT NULL DEFAULT 'Instagram',
      last_contact TEXT,
      notes TEXT NOT NULL DEFAULT '',
      meeting_date DATE,
      meeting_time TIME,
      meeting_location TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    -- body_logs
    CREATE TABLE IF NOT EXISTS body_logs (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
      weight NUMERIC(5,2),
      body_fat NUMERIC(4,2),
      logged_at DATE NOT NULL DEFAULT CURRENT_DATE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      UNIQUE(user_id, logged_at)
    );

    -- diet_logs
    CREATE TABLE IF NOT EXISTS diet_logs (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
      calories INTEGER NOT NULL,
      meal_label TEXT,
      logged_at DATE NOT NULL DEFAULT CURRENT_DATE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    -- finance_records
    CREATE TABLE IF NOT EXISTS finance_records (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
      month_year TEXT NOT NULL,
      income NUMERIC(10,2) NOT NULL DEFAULT 0,
      expenses NUMERIC(10,2) NOT NULL DEFAULT 0,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      UNIQUE(user_id, month_year)
    );

    -- evolution_metrics (VSM sub-scores history)
    CREATE TABLE IF NOT EXISTS evolution_metrics (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
      metric_name TEXT NOT NULL,
      value INTEGER NOT NULL DEFAULT 0,
      recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    -- RLS: enable row-level security on user-owned tables
    ALTER TABLE profiles          ENABLE ROW LEVEL SECURITY;
    ALTER TABLE enrollments       ENABLE ROW LEVEL SECURITY;
    ALTER TABLE progress          ENABLE ROW LEVEL SECURITY;
    ALTER TABLE contacts          ENABLE ROW LEVEL SECURITY;
    ALTER TABLE body_logs         ENABLE ROW LEVEL SECURITY;
    ALTER TABLE diet_logs         ENABLE ROW LEVEL SECURITY;
    ALTER TABLE finance_records   ENABLE ROW LEVEL SECURITY;
    ALTER TABLE evolution_metrics ENABLE ROW LEVEL SECURITY;

    -- Policies: own rows only
    DO $$ BEGIN
      -- profiles: read/write own
      IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='profiles' AND policyname='own_profile') THEN
        CREATE POLICY own_profile ON profiles USING (auth.uid() = id);
      END IF;

      -- enrollments
      IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='enrollments' AND policyname='own_enrollments') THEN
        CREATE POLICY own_enrollments ON enrollments USING (auth.uid() = user_id);
      END IF;

      -- progress
      IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='progress' AND policyname='own_progress') THEN
        CREATE POLICY own_progress ON progress USING (auth.uid() = user_id);
      END IF;

      -- contacts
      IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='contacts' AND policyname='own_contacts') THEN
        CREATE POLICY own_contacts ON contacts USING (auth.uid() = user_id);
      END IF;

      -- body_logs
      IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='body_logs' AND policyname='own_body_logs') THEN
        CREATE POLICY own_body_logs ON body_logs USING (auth.uid() = user_id);
      END IF;

      -- diet_logs
      IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='diet_logs' AND policyname='own_diet_logs') THEN
        CREATE POLICY own_diet_logs ON diet_logs USING (auth.uid() = user_id);
      END IF;

      -- finance_records
      IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='finance_records' AND policyname='own_finance') THEN
        CREATE POLICY own_finance ON finance_records USING (auth.uid() = user_id);
      END IF;

      -- evolution_metrics
      IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='evolution_metrics' AND policyname='own_metrics') THEN
        CREATE POLICY own_metrics ON evolution_metrics USING (auth.uid() = user_id);
      END IF;
    END $$;

    -- Trigger: auto-create profile on auth.users insert
    CREATE OR REPLACE FUNCTION handle_new_user()
    RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
    BEGIN
      INSERT INTO public.profiles (id, email, display_name, role)
      VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)),
        'student'
      )
      ON CONFLICT (id) DO NOTHING;
      RETURN NEW;
    END;
    $$;

    DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
    CREATE TRIGGER on_auth_user_created
      AFTER INSERT ON auth.users
      FOR EACH ROW EXECUTE FUNCTION handle_new_user();
  `;

  try {
    const { error } = await sb.rpc('exec_raw_sql', { sql: SCHEMA_SQL });
    if (error) {
      // rpc might not exist — return the SQL so the user can run it manually
      return c.json({
        status: "manual_required",
        message: "Execute the SQL below in your Supabase SQL Editor.",
        sql: SCHEMA_SQL,
      }, 200);
    }
    return c.json({ status: "ok", message: "Schema created successfully." });
  } catch (_e) {
    return c.json({
      status: "manual_required",
      message: "Execute the SQL below in your Supabase SQL Editor.",
      sql: SCHEMA_SQL,
    }, 200);
  }
});

// ─── Profiles ─────────────────────────────────────────────────

app.get("/make-server-bbe832b4/profiles/:id", async (c) => {
  const { data, error } = await adminClient().from("profiles").select("*").eq("id", c.req.param("id")).single();
  if (error) return c.json({ error: error.message }, 404);
  return c.json(data);
});

app.put("/make-server-bbe832b4/profiles/:id", async (c) => {
  const body = await c.req.json();
  const { data, error } = await adminClient().from("profiles").update({ ...body, updated_at: new Date().toISOString() }).eq("id", c.req.param("id")).select().single();
  if (error) return c.json({ error: error.message }, 400);
  return c.json(data);
});

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
