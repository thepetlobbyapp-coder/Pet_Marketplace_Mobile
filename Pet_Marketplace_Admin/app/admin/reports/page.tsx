import Link from "next/link";
import { redirect } from "next/navigation";
import { requireAdmin } from "../../../src/auth/serverSession";
import {
  ADMIN_LIST_PAGE_ERROR_MESSAGE,
  loadAdminListPageViewModel,
} from "../../../src/admin/adminListPageViewModels";
import {
  ADMIN_REPORT_STATUSES,
  type AdminReportListItem,
  type AdminReportStatus,
} from "../../../src/admin/adminResources";
import {
  ConfirmSubmitButton,
  CopyButton,
} from "../_components/AdminActionControls";

const REPORTS_PAGE_LIMIT = 20;
const REPORT_STATUS_LABELS: Readonly<Record<AdminReportStatus, string>> = {
  action_taken: "Action taken",
  closed: "Closed",
  dismissed: "Dismissed",
  in_review: "In review",
  open: "Open",
};

type AdminReportsPageSearchParams = Readonly<
  Record<string, string | string[] | undefined>
>;

interface AdminReportsPageProps {
  readonly searchParams?: Promise<AdminReportsPageSearchParams>;
}

export default async function AdminReportsPage({
  searchParams,
}: AdminReportsPageProps) {
  const { resourceClient } = await requireAdmin();
  const resolvedSearchParams = (await searchParams) ?? {};
  const cursor = readSingleSearchParam(resolvedSearchParams.cursor);
  const actionState = readActionState(resolvedSearchParams.action);
  const state = await loadAdminListPageViewModel(resourceClient, "reports", {
    cursor,
    limit: REPORTS_PAGE_LIMIT,
  });

  return (
    <section>
      <header style={{ marginBottom: "var(--space-4)" }}>
        <h1 style={{ margin: 0 }}>{state.page.title}</h1>
        <p style={{ color: "var(--color-muted)", marginTop: "var(--space-1)" }}>
          Trust &amp; Safety reports submitted by tutors and providers.
        </p>
      </header>

      {actionState ? <ActionFeedback state={actionState} /> : null}

      {state.status === "ready" ? (
        <>
          <ReportsTable
            currentCursor={state.pagination.cursor}
            items={state.items}
          />
          <ReportsPagination
            cursor={state.pagination.cursor}
            isAfterFirstPage={state.pagination.isAfterFirstPage}
            nextCursor={state.pagination.nextCursor}
          />
        </>
      ) : null}

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
          {state.message ?? ADMIN_LIST_PAGE_ERROR_MESSAGE}
        </p>
      ) : null}

      {state.status === "loading" ? (
        <p style={{ color: "var(--color-muted)" }}>Loading...</p>
      ) : null}
    </section>
  );
}

async function updateReportStatusAction(formData: FormData): Promise<void> {
  "use server";

  let cursor: string | null = null;

  try {
    const reportId = readRequiredFormString(formData, "reportId");
    const status = readReportStatus(formData.get("status"));
    const internalNote = readOptionalFormString(formData, "internalNote");
    cursor = readOptionalFormString(formData, "cursor");

    const { resourceClient } = await requireAdmin();
    await resourceClient.updateAdminReport(reportId, {
      internalNote,
      status,
    });
  } catch {
    redirect(buildReportsPath({ action: "update-error", cursor }));
  }

  redirect(buildReportsPath({ action: "updated", cursor }));
}

function ReportsTable({
  currentCursor,
  items,
}: {
  readonly currentCursor: string | null;
  readonly items: readonly AdminReportListItem[];
}) {
  if (items.length === 0) {
    return (
      <p
        style={{
          color: "var(--color-muted)",
          padding: "var(--space-5) 0",
          textAlign: "center",
        }}
      >
        No reports found.
      </p>
    );
  }

  return (
    <div
      style={{
        background: "var(--color-surface)",
        border: "1px solid var(--color-border)",
        borderRadius: "var(--radius-md)",
        overflowX: "auto",
      }}
    >
      <table>
        <thead>
          <tr>
            <th>Category</th>
            <th>Status</th>
            <th>Target</th>
            <th>Created</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {items.map((report) => (
            <tr key={report.id}>
              <td>{formatCellValue(report.category)}</td>
              <td>{REPORT_STATUS_LABELS[report.status]}</td>
              <td>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "var(--space-2)",
                  }}
                >
                  <span>{formatTargetLabel(report)}</span>
                  {report.targetId ? (
                    <CopyButton label="Copy target ID" value={report.targetId} />
                  ) : null}
                </div>
              </td>
              <td>{formatCellValue(report.createdAt)}</td>
              <td>
                <form
                  action={updateReportStatusAction}
                  style={{
                    alignItems: "center",
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "var(--space-2)",
                  }}
                >
                  <input name="reportId" type="hidden" value={report.id} />
                  {currentCursor ? (
                    <input name="cursor" type="hidden" value={currentCursor} />
                  ) : null}
                  <label
                    style={{
                      color: "var(--color-muted)",
                      display: "flex",
                      flexDirection: "column",
                      fontSize: 12,
                      gap: "var(--space-1)",
                    }}
                  >
                    Internal note
                    <input
                      maxLength={1000}
                      name="internalNote"
                      placeholder="Optional"
                      style={{
                        border: "1px solid var(--color-border)",
                        borderRadius: "var(--radius-sm)",
                        padding: "var(--space-2)",
                        width: 180,
                      }}
                      type="text"
                    />
                  </label>
                  <div
                    aria-label={`Report ${report.id} status actions`}
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "var(--space-2)",
                    }}
                  >
                    <ReportStatusButton
                      currentStatus={report.status}
                      label="Start review"
                      status="in_review"
                    />
                    <ReportStatusButton
                      currentStatus={report.status}
                      label="Action taken"
                      status="action_taken"
                    />
                    <ReportStatusButton
                      confirmMessage="Mark this report as dismissed?"
                      currentStatus={report.status}
                      label="Dismiss"
                      status="dismissed"
                    />
                    <ReportStatusButton
                      confirmMessage="Close this report?"
                      currentStatus={report.status}
                      label="Close"
                      status="closed"
                    />
                  </div>
                </form>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ReportStatusButton({
  confirmMessage,
  currentStatus,
  label,
  status,
}: {
  readonly confirmMessage?: string;
  readonly currentStatus: AdminReportStatus;
  readonly label: string;
  readonly status: Exclude<AdminReportStatus, "open">;
}) {
  const isCurrent = currentStatus === status;

  return (
    <ConfirmSubmitButton
      confirmMessage={confirmMessage}
      disabled={isCurrent}
      name="status"
      style={{
        background: isCurrent ? "var(--color-bg)" : "var(--color-accent)",
        border: isCurrent ? "1px solid var(--color-border)" : 0,
        borderRadius: "var(--radius-sm)",
        color: isCurrent ? "var(--color-muted)" : "var(--color-accent-text)",
        padding: "var(--space-2) var(--space-3)",
      }}
      value={status}
    >
      {isCurrent ? `${label} current` : label}
    </ConfirmSubmitButton>
  );
}

function ReportsPagination({
  cursor,
  isAfterFirstPage,
  nextCursor,
}: {
  readonly cursor: string | null;
  readonly isAfterFirstPage: boolean;
  readonly nextCursor: string | null;
}) {
  return (
    <nav
      aria-label="Reports pagination"
      style={{
        alignItems: "center",
        display: "flex",
        gap: "var(--space-3)",
        justifyContent: "space-between",
        marginTop: "var(--space-4)",
      }}
    >
      <span style={{ color: "var(--color-muted)", fontSize: 13 }}>
        {cursor ? "Viewing a later page" : "Viewing first page"}
      </span>
      <div style={{ display: "flex", gap: "var(--space-2)" }}>
        {isAfterFirstPage ? (
          <Link href="/admin/reports" style={paginationLinkStyle}>
            First page
          </Link>
        ) : (
          <span aria-disabled="true" style={paginationDisabledStyle}>
            First page
          </span>
        )}
        {nextCursor ? (
          <Link
            href={buildReportsPath({ cursor: nextCursor })}
            style={paginationLinkStyle}
          >
            Next page
          </Link>
        ) : (
          <span aria-disabled="true" style={paginationDisabledStyle}>
            Next page
          </span>
        )}
      </div>
    </nav>
  );
}

function ActionFeedback({
  state,
}: {
  readonly state: "updated" | "update-error";
}) {
  const isError = state === "update-error";

  return (
    <p
      role={isError ? "alert" : "status"}
      style={{
        background: isError ? "var(--color-warning-bg)" : "var(--color-surface)",
        border: "1px solid var(--color-border)",
        borderRadius: "var(--radius-sm)",
        color: isError ? "var(--color-warning-text)" : "var(--color-muted)",
        marginBottom: "var(--space-4)",
        padding: "var(--space-3) var(--space-4)",
      }}
    >
      {isError
        ? "Could not update the report status."
        : "Report status updated."}
    </p>
  );
}

const paginationLinkStyle = {
  border: "1px solid var(--color-border)",
  borderRadius: "var(--radius-sm)",
  color: "var(--color-text)",
  padding: "var(--space-2) var(--space-3)",
} as const;

const paginationDisabledStyle = {
  ...paginationLinkStyle,
  color: "var(--color-muted)",
  cursor: "not-allowed",
} as const;

function buildReportsPath({
  action,
  cursor,
}: {
  readonly action?: "updated" | "update-error";
  readonly cursor?: string | null;
}): "/admin/reports" | `/admin/reports?${string}` {
  const params = new URLSearchParams();

  if (cursor) params.set("cursor", cursor);
  if (action) params.set("action", action);

  const queryString = params.toString();
  return queryString ? `/admin/reports?${queryString}` : "/admin/reports";
}

function readSingleSearchParam(
  value: string | string[] | undefined,
): string | null {
  if (Array.isArray(value)) return value[0] ?? null;
  return value ?? null;
}

function readActionState(
  value: string | string[] | undefined,
): "updated" | "update-error" | null {
  const action = readSingleSearchParam(value);
  return action === "updated" || action === "update-error" ? action : null;
}

function readRequiredFormString(formData: FormData, key: string): string {
  const value = formData.get(key);
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(`${key} is required.`);
  }

  return value.trim();
}

function readOptionalFormString(formData: FormData, key: string): string | null {
  const value = formData.get(key);
  if (typeof value !== "string") return null;

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function readReportStatus(value: FormDataEntryValue | null): AdminReportStatus {
  if (
    typeof value === "string" &&
    ADMIN_REPORT_STATUSES.includes(value as AdminReportStatus)
  ) {
    return value as AdminReportStatus;
  }

  throw new Error("status is not supported.");
}

function formatCellValue(value: string | undefined): string {
  const trimmed = value?.trim();
  return trimmed ? trimmed : "-";
}

function formatTargetLabel(report: AdminReportListItem): string {
  const targetType = formatCellValue(report.targetType);
  const targetId = formatCellValue(report.targetId);

  return targetId === "-" ? targetType : `${targetType}: ${targetId}`;
}
