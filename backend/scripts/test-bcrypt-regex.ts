import bcrypt from "bcrypt";

const patterns = [
  /^\$2[aby]?\$\d{2}\$/,
  /^\$2[abxy]\$\d{2}\$/,
  /^\$2[aby]\$\d{2}\$/,
  /^\$2[aby]\$\d{2}\$.*/,
  /^\$2b\$/,
];

async function main() {
  const hash = await bcrypt.hash("Admin@2026", 12);
  console.log("hash prefix:", hash.slice(0, 7));
  for (const p of patterns) {
    console.log(String(p), "=>", p.test(hash));
  }
}

main();
