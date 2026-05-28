#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import { createServer } from "node:http";
import { createRequire } from "node:module";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const require = createRequire(import.meta.url);
const explicitPort = readPortArg();
const startPort = explicitPort ?? Number(process.env.PORT ?? 5173);

compileAdminModules();

const admin = require(resolve(rootDir, ".tmp/test-build/src/index.js"));
const previewState = createPreviewState(admin);

listen(startPort);

function compileAdminModules() {
  const isWindows = process.platform === "win32";
  const command = isWindows ? process.env.ComSpec ?? "cmd.exe" : "pnpm";
  const args = isWindows
    ? ["/d", "/s", "/c", "pnpm.cmd exec tsc -p tsconfig.test.json"]
    : ["exec", "tsc", "-p", "tsconfig.test.json"];
  const result = spawnSync(command, args, {
    cwd: rootDir,
    stdio: "inherit",
  });

  if (result.error) {
    console.error(result.error.message);
    process.exit(1);
  }

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

function listen(port) {
  const server = createServer((request, response) => {
    const url = new URL(request.url ?? "/", `http://${request.headers.host}`);

    if (url.pathname === "/health") {
      sendJson(response, { status: "ok" });
      return;
    }

    if (url.pathname === "/api/preview") {
      sendJson(response, previewState);
      return;
    }

    sendHtml(response, renderHtml(previewState));
  });

  server.on("error", (error) => {
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      error.code === "EADDRINUSE" &&
      !explicitPort
    ) {
      listen(port + 1);
      return;
    }

    throw error;
  });

  server.listen(port, "0.0.0.0", () => {
    console.log(`Admin preview running at http://localhost:${port}/admin`);
  });
}

function readPortArg() {
  const portIndex = process.argv.indexOf("--port");

  if (portIndex === -1) {
    return undefined;
  }

  const value = Number(process.argv[portIndex + 1]);

  if (!Number.isInteger(value) || value <= 0) {
    throw new Error("--port must be a positive integer.");
  }

  return value;
}

function createPreviewState(adminModule) {
  const resources = createSampleResources();

  return {
    generatedAt: new Date().toISOString(),
    identity: {
      email: "admin@thepetlobby.test",
      role: "admin",
      status: "authenticated",
    },
    routes: adminModule.ADMIN_ROUTES,
    summary: adminModule.createAdminDashboardSummary(resources),
    tables: {
      auditLogs: adminModule.createAdminAuditLogsTable(resources.auditLogs),
      bookings: adminModule.createAdminBookingsTable(resources.bookings),
      providers: adminModule.createAdminProvidersTable(resources.providers),
      reports: adminModule.createAdminReportsTable(resources.reports),
      users: adminModule.createAdminUsersTable(resources.users),
    },
  };
}

function createSampleResources() {
  return {
    auditLogs: [
      {
        action: "user.blocked",
        actorUserId: "user-001",
        createdAt: "2026-05-18T12:00:00.000Z",
        id: "audit-001",
        targetId: "user-002",
        targetType: "user",
      },
      {
        action: "report.closed",
        actorUserId: "user-001",
        createdAt: "2026-05-18T12:10:00.000Z",
        id: "audit-002",
        targetId: "report-003",
        targetType: "report",
      },
      {
        action: "booking.checked",
        actorUserId: null,
        createdAt: "2026-05-18T12:20:00.000Z",
        id: "audit-003",
        targetId: "booking-001",
        targetType: "booking",
      },
    ],
    bookings: [
      {
        createdAt: "2026-05-18T12:00:00.000Z",
        date: "2026-05-25",
        id: "booking-001",
        service: "Dog walking",
        status: "requested",
        timeSlotId: "09:00",
        updatedAt: "2026-05-18T12:05:00.000Z",
      },
      {
        createdAt: "2026-05-18T13:00:00.000Z",
        date: "2026-05-26",
        id: "booking-002",
        service: "Pet sitting",
        status: "confirmed",
        timeSlotId: "14:00",
        updatedAt: "2026-05-18T13:15:00.000Z",
      },
      {
        createdAt: "2026-05-17T08:30:00.000Z",
        date: "2026-05-20",
        id: "booking-003",
        service: "Vet visit support",
        status: "completed",
        timeSlotId: "11:00",
        updatedAt: "2026-05-20T12:45:00.000Z",
      },
    ],
    providers: [
      {
        createdAt: "2026-05-10T10:00:00.000Z",
        displayName: "Camden Care Walks",
        id: "provider-001",
        serviceCount: 4,
        status: "active",
        updatedAt: "2026-05-21T09:10:00.000Z",
      },
      {
        createdAt: "2026-05-11T15:00:00.000Z",
        displayName: "Islington Pet Sitting",
        id: "provider-002",
        serviceCount: 2,
        status: "paused",
        updatedAt: "2026-05-22T16:20:00.000Z",
      },
    ],
    reports: [
      {
        category: "safety_concern",
        createdAt: "2026-05-18T12:00:00.000Z",
        id: "report-001",
        status: "open",
        targetType: "booking",
        updatedAt: "2026-05-18T12:05:00.000Z",
      },
      {
        category: "abuse",
        createdAt: "2026-05-18T12:30:00.000Z",
        id: "report-002",
        status: "in_review",
        targetType: "message",
        updatedAt: "2026-05-18T12:35:00.000Z",
      },
      {
        category: "spam",
        createdAt: "2026-05-17T19:00:00.000Z",
        id: "report-003",
        status: "closed",
        targetType: "provider",
        updatedAt: "2026-05-18T11:00:00.000Z",
      },
    ],
    users: [
      {
        createdAt: "2026-05-01T10:00:00.000Z",
        displayName: "Admin User",
        email: "admin@thepetlobby.test",
        id: "user-001",
        roles: ["admin"],
        status: "active",
        updatedAt: "2026-05-18T12:05:00.000Z",
      },
      {
        createdAt: "2026-05-02T14:00:00.000Z",
        displayName: "Blocked Tutor",
        email: "blocked@example.com",
        id: "user-002",
        roles: ["tutor"],
        status: "blocked",
        updatedAt: "2026-05-18T12:05:00.000Z",
      },
      {
        createdAt: "2026-05-03T09:00:00.000Z",
        displayName: "Deleted Provider",
        email: "deleted@example.com",
        id: "user-003",
        roles: ["provider"],
        status: "deleted",
        updatedAt: "2026-05-18T12:05:00.000Z",
      },
      {
        createdAt: "2026-05-04T11:30:00.000Z",
        displayName: "Active Tutor",
        email: "active@example.com",
        id: "user-004",
        roles: ["tutor"],
        status: "active",
        updatedAt: "2026-05-18T12:05:00.000Z",
      },
    ],
  };
}

function renderHtml(state) {
  return `<!doctype html>
<html lang="en-GB">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>The Pet Lobby Admin</title>
    <style>
      :root {
        --background: #fafafc;
        --surface: #ffffff;
        --surface-muted: #f4f4f8;
        --text: #111122;
        --muted: #5c5c70;
        --border: #e8e8ef;
        --accent: #6f32f0;
        --accent-soft: #efe8ff;
        --accent-dark: #3b0d78;
        --danger: #d92d20;
        --danger-surface: #fee4e2;
        --success: #1f8f5f;
        --success-surface: #e7f6ef;
        --warning: #7a5a00;
        --warning-surface: #fff8db;
        color-scheme: light;
        font-family:
          Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont,
          "Segoe UI", sans-serif;
      }

      * {
        box-sizing: border-box;
      }

      body {
        margin: 0;
        background: var(--background);
        color: var(--text);
        min-width: 320px;
      }

      button,
      input {
        font: inherit;
      }

      .shell {
        display: grid;
        grid-template-columns: 248px minmax(0, 1fr);
        min-height: 100vh;
      }

      .sidebar {
        background: var(--surface);
        border-right: 1px solid var(--border);
        padding: 24px 18px;
      }

      .brand {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-bottom: 28px;
      }

      .brand-mark {
        align-items: center;
        background: var(--accent-soft);
        border: 1px solid #d9c8ff;
        border-radius: 8px;
        color: var(--accent-dark);
        display: flex;
        font-weight: 800;
        height: 42px;
        justify-content: center;
        width: 42px;
      }

      .brand-title {
        font-size: 15px;
        font-weight: 760;
        line-height: 1.2;
      }

      .brand-subtitle,
      .meta {
        color: var(--muted);
        font-size: 12px;
        line-height: 1.4;
      }

      .nav {
        display: flex;
        flex-direction: column;
        gap: 6px;
      }

      .nav-button {
        align-items: center;
        background: transparent;
        border: 1px solid transparent;
        border-radius: 8px;
        color: var(--muted);
        cursor: pointer;
        display: flex;
        justify-content: space-between;
        min-height: 42px;
        padding: 10px 12px;
        text-align: left;
        width: 100%;
      }

      .nav-button:hover,
      .nav-button:focus-visible {
        background: var(--surface-muted);
        color: var(--text);
        outline: none;
      }

      .nav-button.is-active {
        background: var(--accent-soft);
        border-color: #d9c8ff;
        color: var(--accent-dark);
        font-weight: 700;
      }

      .main {
        min-width: 0;
        padding: 24px;
      }

      .topbar {
        align-items: center;
        display: flex;
        gap: 16px;
        justify-content: space-between;
        margin-bottom: 22px;
      }

      h1,
      h2,
      h3,
      p {
        margin: 0;
      }

      h1 {
        font-size: 28px;
        letter-spacing: 0;
        line-height: 1.2;
      }

      h2 {
        font-size: 20px;
        letter-spacing: 0;
        line-height: 1.25;
      }

      h3 {
        font-size: 14px;
        letter-spacing: 0;
        line-height: 1.35;
      }

      .user-panel {
        align-items: center;
        background: var(--surface);
        border: 1px solid var(--border);
        border-radius: 8px;
        display: flex;
        gap: 10px;
        padding: 10px 12px;
        white-space: nowrap;
      }

      .avatar {
        align-items: center;
        background: #e8f4f2;
        border-radius: 50%;
        color: #155e55;
        display: flex;
        font-size: 12px;
        font-weight: 800;
        height: 34px;
        justify-content: center;
        width: 34px;
      }

      .badge {
        align-items: center;
        border-radius: 999px;
        display: inline-flex;
        font-size: 12px;
        font-weight: 700;
        line-height: 1;
        min-height: 24px;
        padding: 6px 9px;
        text-transform: capitalize;
        white-space: nowrap;
      }

      .badge-neutral {
        background: var(--surface-muted);
        color: var(--muted);
      }

      .badge-success {
        background: var(--success-surface);
        color: var(--success);
      }

      .badge-warning {
        background: var(--warning-surface);
        color: var(--warning);
      }

      .badge-danger {
        background: var(--danger-surface);
        color: var(--danger);
      }

      .summary-grid {
        display: grid;
        gap: 12px;
        grid-template-columns: repeat(4, minmax(0, 1fr));
        margin-bottom: 18px;
      }

      .metric,
      .panel {
        background: var(--surface);
        border: 1px solid var(--border);
        border-radius: 8px;
      }

      .metric {
        min-height: 112px;
        padding: 16px;
      }

      .metric-label {
        color: var(--muted);
        font-size: 13px;
        line-height: 1.3;
      }

      .metric-value {
        font-size: 30px;
        font-weight: 800;
        line-height: 1.1;
        margin-top: 14px;
      }

      .panel {
        overflow: hidden;
      }

      .panel-header {
        align-items: center;
        border-bottom: 1px solid var(--border);
        display: flex;
        gap: 14px;
        justify-content: space-between;
        min-height: 62px;
        padding: 14px 16px;
      }

      .panel-actions {
        display: flex;
        gap: 10px;
      }

      .search-field {
        background: var(--surface);
        border: 1px solid var(--border);
        border-radius: 8px;
        color: var(--text);
        min-height: 40px;
        min-width: 260px;
        padding: 8px 10px;
      }

      .search-field:focus {
        border-color: var(--accent);
        outline: 2px solid var(--accent-soft);
      }

      .table-wrap {
        overflow-x: auto;
      }

      table {
        border-collapse: collapse;
        min-width: 720px;
        width: 100%;
      }

      th,
      td {
        border-bottom: 1px solid var(--border);
        font-size: 14px;
        line-height: 1.4;
        padding: 13px 16px;
        text-align: left;
        vertical-align: middle;
      }

      th {
        background: #fbfbfd;
        color: var(--muted);
        font-size: 12px;
        font-weight: 760;
        text-transform: uppercase;
      }

      tr:last-child td {
        border-bottom: 0;
      }

      .row-id {
        color: var(--muted);
        font-family:
          "SFMono-Regular", Consolas, "Liberation Mono", monospace;
        font-size: 12px;
      }

      .empty {
        color: var(--muted);
        padding: 22px 16px;
      }

      .stack {
        display: grid;
        gap: 18px;
      }

      .dashboard-layout {
        display: grid;
        gap: 18px;
        grid-template-columns: minmax(0, 1.3fr) minmax(320px, 0.7fr);
      }

      .queue-list {
        display: grid;
        gap: 10px;
        padding: 16px;
      }

      .queue-item {
        align-items: center;
        border: 1px solid var(--border);
        border-radius: 8px;
        display: flex;
        gap: 12px;
        justify-content: space-between;
        min-height: 54px;
        padding: 10px 12px;
      }

      @media (max-width: 980px) {
        .shell {
          grid-template-columns: 1fr;
        }

        .sidebar {
          border-bottom: 1px solid var(--border);
          border-right: 0;
          padding: 16px;
        }

        .nav {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }

        .main {
          padding: 18px;
        }

        .topbar,
        .panel-header {
          align-items: stretch;
          flex-direction: column;
        }

        .user-panel,
        .search-field {
          width: 100%;
        }

        .summary-grid,
        .dashboard-layout {
          grid-template-columns: 1fr;
        }
      }
    </style>
  </head>
  <body>
    <div id="app"></div>
    <script>
      window.__ADMIN_PREVIEW__ = ${jsonForScript(state)};
    </script>
    <script>
      const state = window.__ADMIN_PREVIEW__;
      const app = document.querySelector("#app");
      let activeRoute = "dashboard";
      let searchTerm = "";

      function render() {
        const active = state.routes.find((route) => route.id === activeRoute);

        app.innerHTML = \`
          <div class="shell">
            <aside class="sidebar">
              <div class="brand">
                <div class="brand-mark">PL</div>
                <div>
                  <div class="brand-title">The Pet Lobby</div>
                  <div class="brand-subtitle">Admin console</div>
                </div>
              </div>
              <nav class="nav" aria-label="Admin sections">
                \${state.routes
                  .map(
                    (route) => \`
                      <button class="nav-button \${route.id === activeRoute ? "is-active" : ""}" data-route="\${route.id}">
                        <span>\${escapeHtml(route.label)}</span>
                      </button>
                    \`,
                  )
                  .join("")}
              </nav>
            </aside>
            <main class="main">
              <header class="topbar">
                <div>
                  <h1>\${escapeHtml(active?.label ?? "Dashboard")}</h1>
                  <p class="meta">Generated \${formatDateTime(state.generatedAt)}</p>
                </div>
                <div class="user-panel" aria-label="Authenticated admin">
                  <div class="avatar">AD</div>
                  <div>
                    <strong>\${escapeHtml(state.identity.email)}</strong>
                    <div class="meta">\${escapeHtml(state.identity.role)} · \${escapeHtml(state.identity.status)}</div>
                  </div>
                  <span class="badge badge-success">Local</span>
                </div>
              </header>
              \${activeRoute === "dashboard" ? renderDashboard() : renderTablePage(activeRoute)}
            </main>
          </div>
        \`;

        document.querySelectorAll("[data-route]").forEach((button) => {
          button.addEventListener("click", () => {
            activeRoute = button.getAttribute("data-route");
            searchTerm = "";
            render();
          });
        });

        const search = document.querySelector("[data-search]");
        if (search) {
          search.value = searchTerm;
          search.addEventListener("input", () => {
            searchTerm = search.value;
            renderTableBody(activeRoute);
          });
        }
      }

      function renderDashboard() {
        const summary = state.summary;

        return \`
          <section class="summary-grid" aria-label="Dashboard summary">
            \${renderMetric("Total users", state.tables.users.rows.length)}
            \${renderMetric("Total providers", state.tables.providers.rows.length)}
            \${renderMetric("Total bookings", state.tables.bookings.rows.length)}
            \${renderMetric("Open reports", summary.openReports, "warning")}
            \${renderMetric("Recent audit logs", state.tables.auditLogs.rows.length)}
          </section>
          <section class="dashboard-layout">
            <div class="panel">
              <div class="panel-header">
                <h2>Recent audit logs</h2>
                <span class="badge badge-neutral">\${state.tables.auditLogs.rows.length} rows</span>
              </div>
              <div class="table-wrap">\${renderTable(state.tables.auditLogs, state.tables.auditLogs.rows)}</div>
            </div>
            <div class="panel">
              <div class="panel-header">
                <h2>Moderation queue</h2>
                <span class="badge badge-warning">\${summary.openReports} items</span>
              </div>
              <div class="queue-list">
                \${renderQueueItem("Open reports", summary.openReports, "warning")}
              </div>
            </div>
          </section>
        \`;
      }

      function renderMetric(label, value, tone = "neutral") {
        return \`
          <article class="metric">
            <div class="metric-label">\${escapeHtml(label)}</div>
            <div class="metric-value">\${escapeHtml(String(value))}</div>
            <span class="badge badge-\${tone}">\${tone}</span>
          </article>
        \`;
      }

      function renderQueueItem(label, value, tone) {
        return \`
          <div class="queue-item">
            <strong>\${escapeHtml(label)}</strong>
            <span class="badge badge-\${tone}">\${escapeHtml(String(value))}</span>
          </div>
        \`;
      }

      function renderTablePage(routeId) {
        const table = state.tables[routeId];

        return \`
          <section class="panel">
            <div class="panel-header">
              <div>
                <h2>\${escapeHtml(routeLabel(routeId))}</h2>
                <p class="meta">\${table.rows.length} rows</p>
              </div>
              <div class="panel-actions">
                <input class="search-field" data-search type="search" placeholder="Search rows" aria-label="Search rows" />
              </div>
            </div>
            <div class="table-wrap" data-table-wrap>
              \${renderTable(table, filterRows(table.rows))}
            </div>
          </section>
        \`;
      }

      function renderTableBody(routeId) {
        const table = state.tables[routeId];
        const wrap = document.querySelector("[data-table-wrap]");

        if (wrap) {
          wrap.innerHTML = renderTable(table, filterRows(table.rows));
        }
      }

      function renderTable(table, rows) {
        if (rows.length === 0) {
          return \`<div class="empty">\${escapeHtml(table.emptyStateMessage)}</div>\`;
        }

        return \`
          <table>
            <thead>
              <tr>
                <th>ID</th>
                \${table.columns.map((column) => \`<th>\${escapeHtml(column.label)}</th>\`).join("")}
              </tr>
            </thead>
            <tbody>
              \${rows
                .map(
                  (row) => \`
                    <tr>
                      <td class="row-id">\${escapeHtml(row.id)}</td>
                      \${table.columns
                        .map(
                          (column) => \`
                            <td>\${renderCell(column.key, row.cells[column.key])}</td>
                          \`,
                        )
                        .join("")}
                    </tr>
                  \`,
                )
                .join("")}
            </tbody>
          </table>
        \`;
      }

      function renderCell(key, value) {
        if (key === "status") {
          return \`<span class="badge \${statusClass(value)}">\${escapeHtml(value)}</span>\`;
        }

        return escapeHtml(value);
      }

      function filterRows(rows) {
        const normalized = searchTerm.trim().toLowerCase();

        if (!normalized) {
          return rows;
        }

        return rows.filter((row) =>
          JSON.stringify(row).toLowerCase().includes(normalized),
        );
      }

      function routeLabel(routeId) {
        return state.routes.find((route) => route.id === routeId)?.label ?? routeId;
      }

      function statusClass(value) {
        const normalized = String(value).toLowerCase();

        if (["active", "confirmed", "completed", "closed"].includes(normalized)) {
          return "badge-success";
        }

        if (["open", "in_review", "paused", "requested"].includes(normalized)) {
          return "badge-warning";
        }

        if (["blocked", "deleted", "cancelled", "dismissed"].includes(normalized)) {
          return "badge-danger";
        }

        return "badge-neutral";
      }

      function formatDateTime(value) {
        return new Intl.DateTimeFormat("en-GB", {
          dateStyle: "medium",
          timeStyle: "short",
        }).format(new Date(value));
      }

      function escapeHtml(value) {
        return String(value ?? "")
          .replaceAll("&", "&amp;")
          .replaceAll("<", "&lt;")
          .replaceAll(">", "&gt;")
          .replaceAll('"', "&quot;")
          .replaceAll("'", "&#039;");
      }

      render();
    </script>
  </body>
</html>`;
}

function jsonForScript(value) {
  return JSON.stringify(value).replace(/[<>&]/g, (character) => {
    switch (character) {
      case "<":
        return "\\u003c";
      case ">":
        return "\\u003e";
      case "&":
        return "\\u0026";
      default:
        return character;
    }
  });
}

function sendJson(response, payload) {
  response.writeHead(200, {
    "Content-Type": "application/json; charset=utf-8",
  });
  response.end(JSON.stringify(payload));
}

function sendHtml(response, html) {
  response.writeHead(200, {
    "Content-Type": "text/html; charset=utf-8",
  });
  response.end(html);
}
