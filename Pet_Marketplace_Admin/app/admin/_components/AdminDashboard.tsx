import Link from "next/link";
import {
  ADMIN_DASHBOARD_SUMMARY_ERROR_MESSAGE,
  type AdminDashboardKpiCard,
  createAdminDashboardViewModel,
  type AdminDashboardSummaryState,
} from "../../../src/admin/adminDashboardSummary";

export function AdminDashboard({
  state,
}: {
  readonly state: AdminDashboardSummaryState;
}) {
  return (
    <section>
      <header style={{ marginBottom: "var(--space-4)" }}>
        <h1 style={{ margin: 0 }}>Admin dashboard</h1>
        <p style={{ color: "var(--color-muted)", marginTop: "var(--space-1)" }}>
          MVP operations
        </p>
      </header>

      {state.status === "ready" ? <ReadyDashboard state={state} /> : null}

      {state.status === "error" ? (
        <p
          role="alert"
          style={{
            background: "var(--color-warning-bg)",
            border: "1px solid var(--color-border)",
            borderRadius: "var(--radius-sm)",
            color: "var(--color-warning-text)",
            padding: "var(--space-3) var(--space-4)",
          }}
        >
          {state.message ?? ADMIN_DASHBOARD_SUMMARY_ERROR_MESSAGE}
        </p>
      ) : null}

      {state.status === "loading" ? (
        <p style={{ color: "var(--color-muted)" }}>Loading...</p>
      ) : null}
    </section>
  );
}

function ReadyDashboard({
  state,
}: {
  readonly state: Extract<AdminDashboardSummaryState, { status: "ready" }>;
}) {
  const viewModel = createAdminDashboardViewModel(state.summary);

  return (
    <>
      <div
        style={{
          display: "grid",
          gap: "var(--space-3)",
          gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
          marginBottom: "var(--space-5)",
        }}
      >
        {viewModel.kpiCards.map((card) => (
          <article
            key={card.id}
            style={{
              background: "var(--color-surface)",
              border: "1px solid var(--color-border)",
              borderRadius: "var(--radius-sm)",
              padding: "var(--space-4)",
            }}
          >
            <div style={{ color: "var(--color-muted)", fontSize: 13 }}>
              {card.label}
            </div>
            <strong
              style={{
                display: "block",
                fontSize: 28,
                lineHeight: 1.15,
                marginTop: "var(--space-2)",
              }}
            >
              {formatCount(card.value)}
            </strong>
            <Link
              href={dashboardCardPath(card)}
              style={{
                color: "var(--color-accent)",
                display: "inline-block",
                fontSize: 13,
                marginTop: "var(--space-3)",
              }}
            >
              {dashboardCardActionLabel(card)}
            </Link>
          </article>
        ))}
      </div>

      <nav
        aria-label="Admin dashboard shortcuts"
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "var(--space-2)",
          marginBottom: "var(--space-5)",
        }}
      >
        {(
          [
            ["Users", "/admin/users"],
            ["Providers", "/admin/providers"],
            ["Bookings", "/admin/bookings"],
            ["Reports", "/admin/reports"],
            ["Audit logs", "/admin/audit-logs"],
          ] as const
        ).map(([label, href]) => (
          <Link
            href={href}
            key={href}
            style={{
              background: "var(--color-surface)",
              border: "1px solid var(--color-border)",
              borderRadius: "var(--radius-sm)",
              color: "var(--color-text)",
              padding: "var(--space-2) var(--space-3)",
            }}
          >
            {label}
          </Link>
        ))}
      </nav>

      {viewModel.isEmpty ? (
        <p
          style={{
            background: "var(--color-surface)",
            border: "1px solid var(--color-border)",
            borderRadius: "var(--radius-sm)",
            color: "var(--color-muted)",
            marginBottom: "var(--space-5)",
            padding: "var(--space-3) var(--space-4)",
          }}
        >
          No MVP activity yet.
        </p>
      ) : null}

      <section aria-labelledby="booking-status-heading">
        <header
          style={{
            alignItems: "baseline",
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "var(--space-3)",
          }}
        >
          <h2 id="booking-status-heading" style={{ fontSize: 18, margin: 0 }}>
            Bookings by status
          </h2>
          <span style={{ color: "var(--color-muted)", fontSize: 13 }}>
            Total {formatCount(viewModel.totalBookings)}
          </span>
        </header>

        <table aria-label="Bookings by status">
          <thead>
            <tr>
              <th>Status</th>
              <th>Bookings</th>
            </tr>
          </thead>
          <tbody>
            {viewModel.bookingStatusRows.map((row) => (
              <tr key={row.status}>
                <td>{row.label}</td>
                <td>{formatCount(row.count)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </>
  );
}

function formatCount(value: number): string {
  return new Intl.NumberFormat("en-GB").format(value);
}

function dashboardCardPath(card: AdminDashboardKpiCard): string {
  if (card.id === "totalProviders") return "/admin/providers";
  if (card.id === "openReports") return "/admin/reports";
  return "/admin/users";
}

function dashboardCardActionLabel(card: AdminDashboardKpiCard): string {
  if (card.id === "totalProviders") return "View providers";
  if (card.id === "openReports") return "Review reports";
  if (card.id === "blockedUsers") return "Review users";
  return "View users";
}
