import type { AdminTableViewModel } from "../../../src/admin/adminTableViewModels";
import { CopyButton } from "./AdminActionControls";

/**
 * Renderiza um AdminTableViewModel sem inventar formatação extra — `cells`
 * já vem como strings via `formatCellValue` do view-model. Linhas vazias
 * (sem dados) usam `emptyStateMessage` da view-model, em vez de hardcode.
 */
export function DataTable({
  viewModel,
}: {
  readonly viewModel: AdminTableViewModel;
}) {
  const hasActions = viewModel.rows.some(
    (row) => (row.actionValues?.length ?? 0) > 0,
  );

  if (viewModel.rows.length === 0) {
    return (
      <p
        style={{
          color: "var(--color-muted)",
          padding: "var(--space-5) 0",
          textAlign: "center",
        }}
      >
        {viewModel.emptyStateMessage}
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
            {viewModel.columns.map((column) => (
              <th key={column.key}>{column.label}</th>
            ))}
            {hasActions ? <th>Actions</th> : null}
          </tr>
        </thead>
        <tbody>
          {viewModel.rows.map((row) => (
            <tr key={row.id}>
              {viewModel.columns.map((column) => (
                <td key={column.key}>{row.cells[column.key] ?? "-"}</td>
              ))}
              {hasActions ? (
                <td>
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "var(--space-2)",
                    }}
                  >
                    {(row.actionValues ?? []).map((action) => (
                      <CopyButton
                        key={`${row.id}-${action.label}`}
                        label={action.label}
                        value={action.value}
                      />
                    ))}
                  </div>
                </td>
              ) : null}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
