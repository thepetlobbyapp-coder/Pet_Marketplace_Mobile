import Link from "next/link";
import { redirect } from "next/navigation";
import { requireAdmin } from "../../../src/auth/serverSession";
import {
  ADMIN_MUTABLE_REVIEW_STATUSES,
  type AdminReviewListItem,
  type AdminReviewStatus,
} from "../../../src/admin/adminResources";
import {
  ConfirmSubmitButton,
  CopyButton,
} from "../_components/AdminActionControls";

const REVIEWS_PAGE_LIMIT = 20;
const REVIEW_STATUS_LABELS: Readonly<Record<AdminReviewStatus, string>> = {
  hidden_by_admin: "Hidden by admin",
  removed: "Removed",
  reported: "Reported",
  visible: "Visible",
};

type AdminReviewsPageSearchParams = Readonly<
  Record<string, string | string[] | undefined>
>;

interface AdminReviewsPageProps {
  readonly searchParams?: Promise<AdminReviewsPageSearchParams>;
}

export default async function AdminReviewsPage({
  searchParams,
}: AdminReviewsPageProps) {
  const { resourceClient } = await requireAdmin();
  const resolvedSearchParams = (await searchParams) ?? {};
  const cursor = readSingleSearchParam(resolvedSearchParams.cursor);
  const actionState = readActionState(resolvedSearchParams.action);

  let items: readonly AdminReviewListItem[] = [];
  let nextCursor: string | null = null;
  let loadFailed = false;

  try {
    const page = await resourceClient.listAdminReviews({
      cursor,
      limit: REVIEWS_PAGE_LIMIT,
    });
    items = page.items;
    nextCursor = page.nextCursor;
  } catch {
    loadFailed = true;
  }

  return (
    <section>
      <header style={{ marginBottom: "var(--space-4)" }}>
        <h1 style={{ margin: 0 }}>Reviews</h1>
        <p style={{ color: "var(--color-muted)", marginTop: "var(--space-1)" }}>
          Service ratings (1-5, no comment). Hide abusive or invalid ratings;
          the provider average recalculates automatically.
        </p>
      </header>

      {actionState ? <ActionFeedback state={actionState} /> : null}

      {loadFailed ? (
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
          Could not load reviews.
        </p>
      ) : (
        <>
          <ReviewsTable currentCursor={cursor} items={items} />
          <ReviewsPagination
            cursor={cursor}
            isAfterFirstPage={Boolean(cursor)}
            nextCursor={nextCursor}
          />
        </>
      )}
    </section>
  );
}

async function updateReviewStatusAction(formData: FormData): Promise<void> {
  "use server";

  let cursor: string | null = null;

  try {
    const reviewId = readRequiredFormString(formData, "reviewId");
    const status = readReviewStatus(formData.get("status"));
    cursor = readOptionalFormString(formData, "cursor");

    const { resourceClient } = await requireAdmin();
    await resourceClient.updateAdminReviewStatus(reviewId, { status });
  } catch {
    redirect(buildReviewsPath({ action: "update-error", cursor }));
  }

  redirect(buildReviewsPath({ action: "updated", cursor }));
}

function ReviewsTable({
  currentCursor,
  items,
}: {
  readonly currentCursor: string | null;
  readonly items: readonly AdminReviewListItem[];
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
        No reviews found.
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
            <th>Rating</th>
            <th>Status</th>
            <th>Booking</th>
            <th>Created</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {items.map((review) => (
            <tr key={review.id}>
              <td>{`${review.rating}/5`}</td>
              <td>{REVIEW_STATUS_LABELS[review.status]}</td>
              <td>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "var(--space-2)",
                  }}
                >
                  <span>{review.bookingId}</span>
                  <CopyButton label="Copy booking ID" value={review.bookingId} />
                </div>
              </td>
              <td>{formatCellValue(review.createdAt)}</td>
              <td>
                <form
                  action={updateReviewStatusAction}
                  style={{
                    alignItems: "center",
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "var(--space-2)",
                  }}
                >
                  <input name="reviewId" type="hidden" value={review.id} />
                  {currentCursor ? (
                    <input name="cursor" type="hidden" value={currentCursor} />
                  ) : null}
                  <div
                    aria-label={`Review ${review.id} moderation actions`}
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "var(--space-2)",
                    }}
                  >
                    <ReviewStatusButton
                      confirmMessage="Hide this review from the provider average?"
                      currentStatus={review.status}
                      label="Hide"
                      status="hidden_by_admin"
                    />
                    <ReviewStatusButton
                      currentStatus={review.status}
                      label="Restore"
                      status="visible"
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

function ReviewStatusButton({
  confirmMessage,
  currentStatus,
  label,
  status,
}: {
  readonly confirmMessage?: string;
  readonly currentStatus: AdminReviewStatus;
  readonly label: string;
  readonly status: (typeof ADMIN_MUTABLE_REVIEW_STATUSES)[number];
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

function ReviewsPagination({
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
      aria-label="Reviews pagination"
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
          <Link href="/admin/reviews" style={paginationLinkStyle}>
            First page
          </Link>
        ) : (
          <span aria-disabled="true" style={paginationDisabledStyle}>
            First page
          </span>
        )}
        {nextCursor ? (
          <Link
            href={buildReviewsPath({ cursor: nextCursor })}
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
      {isError ? "Could not update the review status." : "Review status updated."}
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

function buildReviewsPath({
  action,
  cursor,
}: {
  readonly action?: "updated" | "update-error";
  readonly cursor?: string | null;
}): "/admin/reviews" | `/admin/reviews?${string}` {
  const params = new URLSearchParams();

  if (cursor) params.set("cursor", cursor);
  if (action) params.set("action", action);

  const queryString = params.toString();
  return queryString ? `/admin/reviews?${queryString}` : "/admin/reviews";
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

function readOptionalFormString(
  formData: FormData,
  key: string,
): string | null {
  const value = formData.get(key);
  if (typeof value !== "string") return null;

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function readReviewStatus(
  value: FormDataEntryValue | null,
): (typeof ADMIN_MUTABLE_REVIEW_STATUSES)[number] {
  if (
    typeof value === "string" &&
    (ADMIN_MUTABLE_REVIEW_STATUSES as readonly string[]).includes(value)
  ) {
    return value as (typeof ADMIN_MUTABLE_REVIEW_STATUSES)[number];
  }

  throw new Error("status is not supported.");
}

function formatCellValue(value: string | undefined): string {
  const trimmed = value?.trim();
  return trimmed ? trimmed : "-";
}
