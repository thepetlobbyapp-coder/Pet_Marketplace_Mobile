import {
  AdminReadOnlyListPage,
  type AdminListSearchParams,
} from "../_components/AdminReadOnlyListPage";

export default function AdminAuditLogsPage({
  searchParams,
}: {
  readonly searchParams?: Promise<AdminListSearchParams>;
}) {
  return (
    <AdminReadOnlyListPage
      description="Operational audit events with metadata omitted from the UI."
      pageId="auditLogs"
      searchParams={searchParams}
    />
  );
}
