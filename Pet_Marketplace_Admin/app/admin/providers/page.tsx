import {
  AdminReadOnlyListPage,
  type AdminListSearchParams,
} from "../_components/AdminReadOnlyListPage";

export default function AdminProvidersPage({
  searchParams,
}: {
  readonly searchParams?: Promise<AdminListSearchParams>;
}) {
  return (
    <AdminReadOnlyListPage
      description="Provider profile status and service counts from the backend."
      pageId="providers"
      searchParams={searchParams}
    />
  );
}
