import {
  AdminReadOnlyListPage,
  type AdminListSearchParams,
} from "../_components/AdminReadOnlyListPage";

export default function AdminBookingsPage({
  searchParams,
}: {
  readonly searchParams?: Promise<AdminListSearchParams>;
}) {
  return (
    <AdminReadOnlyListPage
      description="Booking lifecycle overview without participant private data."
      pageId="bookings"
      searchParams={searchParams}
    />
  );
}
