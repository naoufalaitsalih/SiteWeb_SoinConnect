const API = process.env.API_BASE_URL ?? "https://soinsconnect-api.onrender.com";

async function main() {
  console.log("POST", `${API}/api/admin/auth/login`);
  const res = await fetch(`${API}/api/admin/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: "admin@soinsconnect.ma",
      password: "Admin@2026",
    }),
  });
  const data = await res.json();
  console.log("Status:", res.status);
  console.log("Body:", JSON.stringify(data, null, 2));
}

main().catch(console.error);
