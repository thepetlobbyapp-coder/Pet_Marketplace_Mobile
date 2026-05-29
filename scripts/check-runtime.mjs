import { spawnSync } from "node:child_process";

const expectedNodeMajor = 22;
const expectedPnpmVersion = "10.30.3";
const errors = [];

const nodeVersion = process.versions.node;
const nodeMajor = Number(nodeVersion.split(".")[0]);

if (nodeMajor !== expectedNodeMajor) {
  errors.push(`Node must be ${expectedNodeMajor}.x; current is v${nodeVersion}.`);
}

function pnpmVersionFromUserAgent() {
  const userAgent = process.env.npm_config_user_agent ?? "";
  return userAgent.match(/\bpnpm\/([^\s]+)/)?.[1] ?? null;
}

function pnpmVersionFromPath() {
  const command = process.platform === "win32" ? "pnpm.cmd" : "pnpm";
  const result = spawnSync(command, ["-v"], {
    encoding: "utf8",
    windowsHide: true,
  });

  if (result.error || result.status !== 0) {
    return null;
  }

  return result.stdout.trim();
}

const pnpmVersion = pnpmVersionFromUserAgent() ?? pnpmVersionFromPath();

if (!pnpmVersion) {
  errors.push("pnpm was not found on PATH.");
} else if (pnpmVersion !== expectedPnpmVersion) {
  errors.push(`pnpm must be ${expectedPnpmVersion}; current is ${pnpmVersion}.`);
}

if (errors.length > 0) {
  console.error("Runtime check failed:");
  for (const error of errors) {
    console.error(`- ${error}`);
  }
  process.exit(1);
}

console.log(`Runtime OK: Node v${nodeVersion}; pnpm ${pnpmVersion}.`);
