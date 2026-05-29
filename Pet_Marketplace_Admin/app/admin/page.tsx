import { loadAdminDashboardSummary } from "../../src/admin/adminDashboardSummary";
import { requireAdmin } from "../../src/auth/serverSession";
import { AdminDashboard } from "./_components/AdminDashboard";

export default async function AdminHomePage() {
  const { resourceClient } = await requireAdmin();
  const state = await loadAdminDashboardSummary(resourceClient);

  return <AdminDashboard state={state} />;
}
