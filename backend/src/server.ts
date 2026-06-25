import "dotenv/config";
import app from "./app";
import { ensureDatabaseSchema } from "./prisma/ensureSchema";
import { ensureOfficialAdmin } from "./prisma/ensureOfficialAdmin";

const PORT = Number(process.env.PORT) || 4000;

ensureDatabaseSchema()
  .then(() => ensureOfficialAdmin())
  .then(() => {
    app.listen(PORT, () => {
      console.log(`SoinsConnect API running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("[schema] Impossible de préparer la base de données:", error);
    process.exit(1);
  });
