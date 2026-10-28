import { spawn } from "node:child_process";
import { watch, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";

const root = process.cwd();
const prodUrl = "https://alerin-ai.vercel.app";
const scope = "hernandesyohanes-8759";
const statusRel = "public/deploy-status.json";
const statusPath = resolve(root, statusRel);
const logPath = resolve(root, ".deploy-watch.log");
const debounceMs = 25000;

const watchDirs = ["src", "public"];
const watchRootFiles = ["index.html", "package.json", "vite.config.ts"];
const ignorePatterns = [/deploy-status\.json$/, /\.DS_Store$/, /\.deploy-watch\.log$/, /dist\//];

let timer = null;
let deploying = false;
let queued = false;
let rateLimitedUntil = 0;

const started = new Date().toISOString();

function log(message) {
  const line = `[${new Date().toISOString()}] ${message}\n`;
  process.stdout.write(line);
  try {
    writeFileSync(logPath, line, { flag: "a" });
  } catch {
    void message;
  }
}

function writeStatus(payload) {
  const body = JSON.stringify({ url: prodUrl, ...payload }, null, 2);
  try {
    mkdirSync(dirname(statusPath), { recursive: true });
    writeFileSync(statusPath, `${body}\n`);
  } catch (error) {
    log(`status write failed: ${error}`);
  }
}

function runDeploy(reason) {
  if (Date.now() < rateLimitedUntil) {
    const sisaMenit = Math.ceil((rateLimitedUntil - Date.now()) / 60000);
    log(`deploy dilewati: rate limit Vercel (tunggu ~${sisaMenit} menit)`);
    return;
  }
  if (deploying) {
    queued = true;
    return;
  }
  deploying = true;
  const startedAt = new Date().toISOString();
  log(`deploy start (${reason})`);
  writeStatus({ state: "deploying", reason, startedAt, updatedAt: startedAt });

  const child = spawn("npx", ["vercel", "deploy", "--prod", "--yes", "--scope", scope], {
    cwd: root,
    stdio: ["ignore", "pipe", "pipe"],
  });

  let output = "";
  const collect = chunk => {
    output += chunk.toString();
  };
  child.stdout.on("data", collect);
  child.stderr.on("data", collect);

  child.on("close", code => {
    const finishedAt = new Date().toISOString();
    const isRateLimit = output.includes("api-deployments-free-per-day");
    if (isRateLimit) {
      rateLimitedUntil = Date.now() + 30 * 60 * 1000; // 30 menit cooldown
      queued = false;
    }
    const ready = code === 0 && !isRateLimit;
    log(`deploy ${ready ? "ready" : "failed"} (exit ${code})`);
    writeStatus({
      state: ready ? "ready" : "error",
      reason,
      startedAt,
      updatedAt: finishedAt,
      message: ready
        ? "Deployment production siap."
        : isRateLimit
          ? "Limit harian Vercel (100 deploy/hari) tercapai. Silakan coba kembali beberapa saat lagi."
          : output.trim().split("\n").slice(-3).join(" "),
    });
    deploying = false;
    if (queued && !isRateLimit) {
      queued = false;
      runDeploy("perubahan tertunda");
    }
  });
}

function schedule(reason) {
  if (timer) clearTimeout(timer);
  timer = setTimeout(() => {
    timer = null;
    runDeploy(reason);
  }, debounceMs);
}

function onChange(filename) {
  const name = filename ? String(filename) : "";
  if (name && ignorePatterns.some(pattern => pattern.test(name))) return;
  if (deploying) queued = true;
  schedule(name || "perubahan berkas");
}

for (const dir of watchDirs) {
  const target = resolve(root, dir);
  if (!existsSync(target)) continue;
  watch(target, { recursive: true }, (_event, filename) => onChange(`${dir}/${filename ?? ""}`));
}

watch(root, { recursive: false }, (_event, filename) => {
  if (watchRootFiles.includes(String(filename))) onChange(String(filename));
});

writeStatus({ state: "idle", reason: "watcher dijalankan", startedAt: started, updatedAt: started, message: "Menunggu perubahan berkas." });
log(`watching ${watchDirs.join(", ")} + ${watchRootFiles.join(", ")}`);
