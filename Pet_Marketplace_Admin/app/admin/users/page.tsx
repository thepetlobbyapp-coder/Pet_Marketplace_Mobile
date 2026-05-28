import Link from "next/link";
import { redirect } from "next/navigation";
import {
  ADMIN_LIST_PAGE_ERROR_MESSAGE,
  loadAdminListPageViewModel,
} from "../../../src/admin/adminListPageViewModels";
import {
  type AdminUserListItem,
  type AdminUserStatus,
} from "../../../src/admin/adminResources";
import { requireAdmin } from "../../../src/auth/serverSession";
import { ConfirmSubmitButton } from "../_components/AdminActionControls";

const USERS_PAGE_LIMIT = 20;

type AdminUsersPageSearchParams = Readonly<
  Record<string, string | string[] | undefined>
>;

interface AdminUsersPageProps {
  readonly searchParams?: Promise<AdminUsersPageSearchParams>;
}

export default async function AdminUsersPage({
  searchParams,
}: AdminUsersPageProps) {
  const { resourceClient, state: authState } = await requireAdmin();
  const resolvedSearchParams = (await searchParams) ?? {};
  const cursor = readSingleSearchParam(resolvedSearchParams.cursor);
  const actionState = readActionState(resolvedSearchParams.action);
  const state = await loadAdminListPageViewModel(resourceClient, "users", {
    cursor,
    limit: USERS_PAGE_LIMIT,
  });

  return (
    <section>
      <header style={{ marginBottom: "var(--space-4)" }}>
        <h1 style={{ margin: 0 }}>{state.page.title}</h1>
        <p style={{ color: "var(--color-muted)", marginTop: "var(--space-1)" }}>
          Safe user account operations for blocking and reactivation.
        </p>
      </header>

      {actionState ? <ActionFeedback state={actionState} /> : null}

      {state.status === "ready" ? (
        <>
          <UsersTable
            currentAdminId={authState.user.id}
            currentCursor={state.pagination.cursor}
            items={state.items}
          />
          <UsersPagination
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

async function updateUserStatusAction(formData: FormData): Promise<void> {
  "use server";

  let cursor: string | null = null;
  let successAction: "blocked" | "reactivated" = "blocked";

  try {
    const userId = readRequiredFormString(formData, "userId");
    const status = readMutableUserStatus(formData.get("status"));
    cursor = readOptionalFormString(formData, "cursor");
    successAction = status === "blocked" ? "blocked" : "reactivated";

    const { resourceClient } = await requireAdmin();
    await resourceClient.updateAdminUserStatus(userId, { status });
  } catch {
    redirect(buildUsersPath({ action: "update-error", cursor }));
  }

  redirect(buildUsersPath({ action: successAction, cursor }));
}

function UsersTable({
  currentAdminId,
  currentCursor,
  items,
}: {
  readonly currentAdminId: string;
  readonly currentCursor: string | null;
  readonly items: readonly AdminUserListItem[];
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
        No users found.
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
            <th>Email</th>
            <th>Roles</th>
            <th>Status</th>
            <th>Created</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {items.map((user) => (
            <tr key={user.id}>
              <td>{formatCellValue(user.email)}</td>
              <td>{formatCellValue(user.roles.join(", "))}</td>
              <td>{formatCellValue(user.status)}</td>
              <td>{formatCellValue(user.createdAt)}</td>
              <td>
                <UserStatusForm
                  currentAdminId={currentAdminId}
                  currentCursor={currentCursor}
                  user={user}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function UserStatusForm({
  currentAdminId,
  currentCursor,
  user,
}: {
  readonly currentAdminId: string;
  readonly currentCursor: string | null;
  readonly user: AdminUserListItem;
}) {
  const action = getUserStatusAction(user, currentAdminId);

  if (!action) {
    return <span style={{ color: "var(--color-muted)" }}>No action</span>;
  }

  if (action.disabled) {
    return (
      <span aria-disabled="true" style={{ color: "var(--color-muted)" }}>
        {action.label}
      </span>
    );
  }

  return (
    <form action={updateUserStatusAction}>
      <input name="userId" type="hidden" value={user.id} />
      <input name="status" type="hidden" value={action.status} />
      {currentCursor ? (
        <input name="cursor" type="hidden" value={currentCursor} />
      ) : null}
      <ConfirmSubmitButton
        confirmMessage={
          action.status === "blocked"
            ? `Block ${user.email}? This prevents critical user actions.`
            : undefined
        }
        style={{
          background:
            action.status === "blocked"
              ? "var(--color-warning-bg)"
              : "var(--color-surface)",
          border: "1px solid var(--color-border)",
          borderRadius: "var(--radius-sm)",
          color:
            action.status === "blocked"
              ? "var(--color-warning-text)"
              : "var(--color-accent)",
          fontWeight: 600,
          padding: "var(--space-2) var(--space-3)",
        }}
      >
        {action.label}
      </ConfirmSubmitButton>
    </form>
  );
}

function UsersPagination({
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
      aria-label="Users pagination"
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
          <Link href="/admin/users" style={paginationLinkStyle}>
            First page
          </Link>
        ) : (
          <span aria-disabled="true" style={paginationDisabledStyle}>
            First page
          </span>
        )}
        {nextCursor ? (
          <Link
            href={buildUsersPath({ cursor: nextCursor })}
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
  readonly state: "blocked" | "reactivated" | "update-error";
}) {
  const isError = state === "update-error";

  return (
    <p
      role={isError ? "alert" : "status"}
      style={{
        background: isError
          ? "var(--color-warning-bg)"
          : "var(--color-surface)",
        border: "1px solid var(--color-border)",
        borderRadius: "var(--radius-sm)",
        color: isError ? "var(--color-warning-text)" : "var(--color-muted)",
        marginBottom: "var(--space-4)",
        padding: "var(--space-3) var(--space-4)",
      }}
    >
      {isError
        ? "Could not update the user status."
        : state === "blocked"
          ? "User blocked."
          : "User reactivated."}
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

function getUserStatusAction(
  user: AdminUserListItem,
  currentAdminId: string,
):
  | {
      readonly disabled?: false;
      readonly label: string;
      readonly status: Exclude<AdminUserStatus, "deleted">;
    }
  | { readonly disabled: true; readonly label: string }
  | null {
  if (user.status === "deleted") {
    return { disabled: true, label: "Deleted" };
  }
  if (user.id === currentAdminId && user.status === "active") {
    return { disabled: true, label: "Current admin" };
  }
  if (user.status === "blocked") {
    return { label: "Reactivate", status: "active" };
  }
  if (user.status === "active") {
    return { label: "Block", status: "blocked" };
  }
  return null;
}

function buildUsersPath({
  action,
  cursor,
}: {
  readonly action?: "blocked" | "reactivated" | "update-error";
  readonly cursor?: string | null;
}): "/admin/users" | `/admin/users?${string}` {
  const params = new URLSearchParams();

  if (cursor) params.set("cursor", cursor);
  if (action) params.set("action", action);

  const queryString = params.toString();
  return queryString ? `/admin/users?${queryString}` : "/admin/users";
}

function readSingleSearchParam(
  value: string | string[] | undefined,
): string | null {
  if (Array.isArray(value)) return value[0] ?? null;
  return value ?? null;
}

function readActionState(
  value: string | string[] | undefined,
): "blocked" | "reactivated" | "update-error" | null {
  const action = readSingleSearchParam(value);
  if (
    action === "blocked" ||
    action === "reactivated" ||
    action === "update-error"
  ) {
    return action;
  }
  return null;
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

function readMutableUserStatus(
  value: FormDataEntryValue | null,
): Exclude<AdminUserStatus, "deleted"> {
  if (value === "active" || value === "blocked") {
    return value;
  }

  throw new Error("status is not supported.");
}

function formatCellValue(value: string | undefined): string {
  const trimmed = value?.trim();
  return trimmed ? trimmed : "-";
}
