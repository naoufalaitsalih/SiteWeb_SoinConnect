/**
 * Vérification automatique des routes API SoinsConnect.
 * Usage : API_BASE_URL=https://soinsconnect-api.onrender.com npm run check:api
 */
const BASE = (process.env.API_BASE_URL ?? "http://localhost:4000").replace(
  /\/+$/,
  ""
);

const ADMIN_EMAIL = process.env.CHECK_ADMIN_EMAIL ?? "admin@soinsconnect.ma";
const ADMIN_PASSWORD = process.env.CHECK_ADMIN_PASSWORD ?? "Admin@2026";

type CheckResult = {
  method: string;
  path: string;
  status: number;
  ok: boolean;
  detail?: string;
};

const results: CheckResult[] = [];

async function request(
  method: string,
  path: string,
  options: {
    body?: unknown;
    token?: string;
    expectStatus?: number | number[];
  } = {}
): Promise<CheckResult> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (options.token) {
    headers.Authorization = `Bearer ${options.token}`;
  }

  let status = 0;
  let detail = "";

  try {
    const res = await fetch(`${BASE}${path}`, {
      method,
      headers,
      body: options.body ? JSON.stringify(options.body) : undefined,
    });
    status = res.status;
    const text = await res.text();
    try {
      const json = JSON.parse(text) as Record<string, unknown>;
      detail =
        typeof json.message === "string"
          ? json.message
          : JSON.stringify(json).slice(0, 120);
    } catch {
      detail = text.slice(0, 120);
    }

    const expected = options.expectStatus;
    const ok = expected
      ? Array.isArray(expected)
        ? expected.includes(status)
        : status === expected
      : res.ok;

    const result: CheckResult = { method, path, status, ok, detail };
    results.push(result);
    return result;
  } catch (error) {
    detail = error instanceof Error ? error.message : String(error);
    const result: CheckResult = { method, path, status: 0, ok: false, detail };
    results.push(result);
    return result;
  }
}

async function main() {
  console.log(`\n🔍 SoinsConnect API check — ${BASE}\n`);

  await request("GET", "/api/health", { expectStatus: 200 });

  await request("GET", "/api/requests", { expectStatus: 404 });

  const createRes = await request("POST", "/api/requests", {
    expectStatus: 201,
    body: {
      fullName: "Test API Audit",
      phone: "+212600000001",
      email: "audit.test@soinsconnect.ma",
      address: "1 Rue Test, Casablanca",
      careType: "Soins infirmiers",
      description: "Demande créée par check-api.ts",
      requestedDate: "2026-07-01",
      requestedTime: "10:00",
      isUrgent: false,
    },
  });

  await request("POST", "/api/logs", {
    expectStatus: 201,
    body: {
      eventType: "page_view",
      pageUrl: "/fr",
      sessionId: "check-api-script",
    },
  });

  const loginRes = await request("POST", "/api/admin/auth/login", {
    body: { email: ADMIN_EMAIL, password: ADMIN_PASSWORD },
  });

  let token: string | undefined;
  if (loginRes.status === 200) {
    try {
      const res = await fetch(`${BASE}/api/admin/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: ADMIN_EMAIL,
          password: ADMIN_PASSWORD,
        }),
      });
      const data = (await res.json()) as { token?: string };
      token = data.token;
    } catch {
      /* handled below */
    }
  }

  if (!token) {
    results.push({
      method: "—",
      path: "(suite tests admin)",
      status: 0,
      ok: false,
      detail: `Login échoué (${loginRes.status}). Définissez CHECK_ADMIN_PASSWORD.`,
    });
  } else {
    await request("GET", "/api/admin/demandes", {
      token,
      expectStatus: 200,
    });

    await request("GET", "/api/admin/logs", {
      token,
      expectStatus: 200,
    });

    await request("GET", "/api/admin/audit", {
      token,
      expectStatus: 200,
    });

    await request("POST", "/api/admin/auth/logout", {
      token,
      expectStatus: 200,
    });

    await request("GET", "/api/admin/demandes", {
      token,
      expectStatus: 401,
    });
  }

  const passed = results.filter((r) => r.ok).length;
  const failed = results.filter((r) => !r.ok).length;

  console.log("Résultats :");
  for (const r of results) {
    const icon = r.ok ? "✅" : "❌";
    console.log(
      `  ${icon} ${r.method.padEnd(6)} ${r.path.padEnd(28)} ${String(r.status).padStart(3)} ${r.detail ? `— ${r.detail}` : ""}`
    );
  }

  console.log(`\n${passed} OK / ${failed} échec(s)\n`);

  if (createRes.ok) {
    console.log("POST /api/requests : écriture base OK (201)\n");
  }

  process.exit(failed > 0 ? 1 : 0);
}

main();
