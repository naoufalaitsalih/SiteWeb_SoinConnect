/**
 * Supprime .next avant chaque `next dev` pour éviter les erreurs
 * MODULE_NOT_FOUND (611.js, vendor-chunks/lucide-react) et les 500
 * causés par un cache de production ou un build corrompu.
 *
 * Important : ne pas lancer `npm run build` pendant que `next dev` tourne.
 */
const fs = require("fs");
const path = require("path");
const net = require("net");

const nextDir = path.join(__dirname, "..", ".next");

function isPortOpen(port) {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.once("error", () => resolve(true));
    server.once("listening", () => {
      server.close();
      resolve(false);
    });
    server.listen(port, "127.0.0.1");
  });
}

async function main() {
  const portBusy = await isPortOpen(3000);
  if (portBusy) {
    console.warn(
      "[predev] Attention : le port 3000 est déjà utilisé. Arrêtez l'ancien serveur avant de relancer."
    );
  }

  if (fs.existsSync(nextDir)) {
    fs.rmSync(nextDir, { recursive: true, force: true });
    console.log("[predev] Cache .next supprimé — démarrage dev propre");
  }

  const cacheDir = path.join(__dirname, "..", "node_modules", ".cache");
  if (fs.existsSync(cacheDir)) {
    fs.rmSync(cacheDir, { recursive: true, force: true });
  }
}

main().catch((error) => {
  console.error("[predev]", error);
  process.exit(1);
});