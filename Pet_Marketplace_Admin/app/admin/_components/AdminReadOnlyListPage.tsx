import Link from "next/link";
import {
  ADMIN_LIST_PAGE_ERROR_MESSAGE,
  loadAdminListPageViewModel,
  type AdminListPageId,
} from "../../../src/admin/adminListPageViewModels";
import { requireAdmin } from "../../../src/auth/serverSession";
import { DataTable } from "./DataTable";

const ADMIN_LIST_PAGE_LIMIT = 20;

export type AdminListSearchParams = Readonly<
  Record<string, string | string[] | undefined>
>;

export interface AdminReadOnlyListPageProps {
  readonly description: string;
  readonly pageId: AdminListPageId;
  readonly searchParams?: Promise<AdminListSearchParams>;
}

export async function AdminReadOnlyListPage({
  description,
  pageId,
  searchParams,
}: AdminReadOnlyListPageProps) {
  const { resourceClient } = await requireAdmin();
  const resolvedSearchParams = (await searchParams) ?? {};
  const cursor = readSingleSearchParam(resolvedSearchParams.cursor);
  const state = await loadAdminListPageViewModel(resourceClient, pageId, {
    cursor,
    limit: ADMIN_LIST_PAGE_LIMIT,
  });

  return (
    <section>
      <header
        style={{
          alignItems: "flex-start",
          display: "flex",
          flexWrap: "wrap",
          gap: "var(--space-3)",
          justifyContent: "space-between",
          marginBottom: "var(--space-4)",
        }}
      >
        <div>
          <h1 style={{ margin: 0 }}>{state.page.title}</h1>
          <p
            style={{ color: "var(--color-muted)", marginTop: "var(--space-1)" }}
          >
            {description}
          </p>
        </div>
        <Link
          href={cursor ? buildListPath(state.page.path, cursor) : state.page.path}
          style={paginationLinkStyle}
        >
          Refresh
        </Link>
      </header>

      {state.status === "ready" ? (
        <>
          <DataTable viewModel={state.table} />
          <AdminListPagination
            basePath={state.page.path}
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

function AdminListPagination({
  basePath,
  cursor,
  isAfterFirstPage,
  nextCursor,
}: {
  readonly basePath: string;
  readonly cursor: string | null;
  readonly isAfterFirstPage: boolean;
  readonly nextCursor: string | null;
}) {
  return (
    <nav
      aria-label="Admin list pagination"
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
          <Link href={basePath} style={paginationLinkStyle}>
            First page
          </Link>
        ) : (
          <span aria-disabled="true" style={paginationDisabledStyle}>
            First page
          </span>
        )}
        {nextCursor ? (
          <Link
            href={buildListPath(basePath, nextCursor)}
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

function buildListPath(basePath: string, cursor: string): string {
  const params = new URLSearchParams({ cursor });
  return `${basePath}?${params.toString()}`;
}

function readSingleSearchParam(
  value: string | string[] | undefined,
): string | null {
  if (Array.isArray(value)) return value[0] ?? null;
  return value ?? null;
}
