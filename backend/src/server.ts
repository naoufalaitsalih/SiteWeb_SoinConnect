import "dotenv/config";
import app from "./app";
import { prepareDatabaseAndAdmin } from "./prisma/bootstrap";

const PORT = Number(process.env.PORT) || 4000;

prepareDatabaseAndAdmin()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`SoinsConnect API running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("[bootstrap] Impossible de préparer la base de données:", error);
    process.exit(1);
  });
