export const ADMIN_RESOURCE_FORBIDDEN_FIELDS = [
  "token",
  "phone",
  "address",
  "location",
  "coordinates",
  "serviceRole",
  "service_role",
  "rawMetadata",
  "metadata",
] as const;

export type AdminResourceForbiddenField =
  (typeof ADMIN_RESOURCE_FORBIDDEN_FIELDS)[number];

export interface AdminResourcePage<T> {
  readonly items: readonly T[];
  readonly nextCursor: string | null;
}

export interface AdminResourceListParams {
  readonly cursor?: string | null;
  readonly limit?: number;
}

export interface AdminUserListItem {
  readonly id: string;
  readonly email: string;
  readonly roles: readonly string[];
  readonly status: AdminUserStatus;
  readonly createdAt: string;
  readonly updatedAt: string;
}

export type AdminUserStatus = "active" | "blocked" | "deleted";

export const ADMIN_MUTABLE_USER_STATUSES: readonly Exclude<
  AdminUserStatus,
  "deleted"
>[] = ["active", "blocked"] as const;

export interface AdminProviderListItem {
  readonly id: string;
  readonly displayName: string;
  readonly status: string;
  readonly serviceCount: number;
  readonly createdAt: string;
  readonly updatedAt: string;
}

export interface AdminBookingListItem {
  readonly id: string;
  readonly service: string;
  readonly date: string;
  readonly timeSlotId: string;
  readonly status: string;
  readonly createdAt: string;
  readonly updatedAt: string;
}

export type AdminReportStatus =
  | "open"
  | "in_review"
  | "action_taken"
  | "dismissed"
  | "closed";

export const ADMIN_REPORT_STATUSES: readonly AdminReportStatus[] = [
  "open",
  "in_review",
  "action_taken",
  "dismissed",
  "closed",
] as const;

export interface AdminReportListItem {
  readonly id: string;
  readonly status: AdminReportStatus;
  readonly category: string;
  readonly targetType?: string;
  readonly targetId?: string;
  readonly createdAt: string;
  readonly updatedAt: string;
}

export type AdminReviewStatus =
  | "visible"
  | "hidden_by_admin"
  | "reported"
  | "removed";

export const ADMIN_REVIEW_STATUSES: readonly AdminReviewStatus[] = [
  "visible",
  "hidden_by_admin",
  "reported",
  "removed",
] as const;

/** Estados que o admin pode definir a partir da UI. */
export const ADMIN_MUTABLE_REVIEW_STATUSES: readonly Extract<
  AdminReviewStatus,
  "visible" | "hidden_by_admin"
>[] = ["visible", "hidden_by_admin"] as const;

export interface AdminReviewListItem {
  readonly id: string;
  readonly bookingId: string;
  readonly rating: number;
  readonly status: AdminReviewStatus;
  readonly createdAt: string;
  readonly updatedAt: string;
}

export interface UpdateAdminReviewStatusRequest {
  readonly status: Extract<AdminReviewStatus, "visible" | "hidden_by_admin">;
}

export interface AdminAuditLogListItem {
  readonly id: string;
  readonly actorUserId: string | null;
  readonly action: string;
  readonly targetType: string | null;
  readonly targetId: string | null;
  readonly createdAt: string;
}

export interface UpdateAdminReportRequest {
  readonly internalNote?: string | null;
  readonly status: AdminReportStatus;
}

export interface UpdateAdminUserStatusRequest {
  readonly status: Exclude<AdminUserStatus, "deleted">;
}

type AssertNoForbiddenFields<T> =
  Extract<keyof T, AdminResourceForbiddenField> extends never ? true : never;

export const adminUserListItemHasNoForbiddenFields: AssertNoForbiddenFields<AdminUserListItem> = true;
export const adminProviderListItemHasNoForbiddenFields: AssertNoForbiddenFields<AdminProviderListItem> = true;
export const adminBookingListItemHasNoForbiddenFields: AssertNoForbiddenFields<AdminBookingListItem> = true;
export const adminReportListItemHasNoForbiddenFields: AssertNoForbiddenFields<AdminReportListItem> = true;
export const adminReviewListItemHasNoForbiddenFields: AssertNoForbiddenFields<AdminReviewListItem> = true;
export const adminAuditLogListItemHasNoForbiddenFields: AssertNoForbiddenFields<AdminAuditLogListItem> = true;

export class AdminResourceContractError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AdminResourceContractError";
  }
}

export function parseAdminUsersList(
  payload: unknown,
): readonly AdminUserListItem[] {
  return readList(payload, "admin users").map((item, index) => {
    const record = expectRecord(item, `admin users[${index}]`);

    return {
      createdAt: expectString(
        record.createdAt,
        `admin users[${index}].createdAt`,
      ),
      email: expectString(record.email, `admin users[${index}].email`),
      id: expectString(record.id, `admin users[${index}].id`),
      roles: expectStringArray(record.roles, `admin users[${index}].roles`),
      status: expectAdminUserStatus(
        record.status,
        `admin users[${index}].status`,
      ),
      updatedAt: expectString(
        record.updatedAt,
        `admin users[${index}].updatedAt`,
      ),
    };
  });
}

export function parseAdminProvidersList(
  payload: unknown,
): readonly AdminProviderListItem[] {
  return readList(payload, "admin providers").map((item, index) => {
    const record = expectRecord(item, `admin providers[${index}]`);

    return {
      createdAt: expectString(
        record.createdAt,
        `admin providers[${index}].createdAt`,
      ),
      displayName: expectString(
        record.displayName,
        `admin providers[${index}].displayName`,
      ),
      id: expectString(record.id, `admin providers[${index}].id`),
      serviceCount: expectNumber(
        record.serviceCount,
        `admin providers[${index}].serviceCount`,
      ),
      status: expectString(record.status, `admin providers[${index}].status`),
      updatedAt: expectString(
        record.updatedAt,
        `admin providers[${index}].updatedAt`,
      ),
    };
  });
}

export function parseAdminBookingsList(
  payload: unknown,
): readonly AdminBookingListItem[] {
  return readList(payload, "admin bookings").map((item, index) => {
    const record = expectRecord(item, `admin bookings[${index}]`);

    return {
      createdAt: expectString(
        record.createdAt,
        `admin bookings[${index}].createdAt`,
      ),
      date: expectString(record.date, `admin bookings[${index}].date`),
      id: expectString(record.id, `admin bookings[${index}].id`),
      service: expectString(record.service, `admin bookings[${index}].service`),
      status: expectString(record.status, `admin bookings[${index}].status`),
      timeSlotId: expectString(
        record.timeSlotId,
        `admin bookings[${index}].timeSlotId`,
      ),
      updatedAt: expectString(
        record.updatedAt,
        `admin bookings[${index}].updatedAt`,
      ),
    };
  });
}

export function parseAdminReportsList(
  payload: unknown,
): readonly AdminReportListItem[] {
  return readList(payload, "admin reports").map((item, index) => {
    const record = expectRecord(item, `admin reports[${index}]`);

    return {
      category: expectString(
        record.category,
        `admin reports[${index}].category`,
      ),
      createdAt: expectString(
        record.createdAt,
        `admin reports[${index}].createdAt`,
      ),
      id: expectString(record.id, `admin reports[${index}].id`),
      status: expectAdminReportStatus(
        record.status,
        `admin reports[${index}].status`,
      ),
      targetId: readOptionalString(
        record.targetId,
        `admin reports[${index}].targetId`,
      ),
      targetType: readOptionalString(
        record.targetType,
        `admin reports[${index}].targetType`,
      ),
      updatedAt: expectString(
        record.updatedAt,
        `admin reports[${index}].updatedAt`,
      ),
    };
  });
}

export function parseAdminReviewsList(
  payload: unknown,
): readonly AdminReviewListItem[] {
  return readList(payload, "admin reviews").map((item, index) => {
    const record = expectRecord(item, `admin reviews[${index}]`);

    return {
      bookingId: expectString(
        record.bookingId,
        `admin reviews[${index}].bookingId`,
      ),
      createdAt: expectString(
        record.createdAt,
        `admin reviews[${index}].createdAt`,
      ),
      id: expectString(record.id, `admin reviews[${index}].id`),
      rating: expectNumber(record.rating, `admin reviews[${index}].rating`),
      status: expectAdminReviewStatus(
        record.status,
        `admin reviews[${index}].status`,
      ),
      updatedAt: expectString(
        record.updatedAt,
        `admin reviews[${index}].updatedAt`,
      ),
    };
  });
}

export function parseAdminAuditLogsList(
  payload: unknown,
): readonly AdminAuditLogListItem[] {
  return readList(payload, "admin audit logs").map((item, index) => {
    const record = expectRecord(item, `admin audit logs[${index}]`);

    return {
      action: expectString(record.action, `admin audit logs[${index}].action`),
      actorUserId: readNullableString(
        record.actorUserId,
        `admin audit logs[${index}].actorUserId`,
      ),
      createdAt: expectString(
        record.createdAt,
        `admin audit logs[${index}].createdAt`,
      ),
      id: expectString(record.id, `admin audit logs[${index}].id`),
      targetId: readNullableString(
        record.targetId,
        `admin audit logs[${index}].targetId`,
      ),
      targetType: readNullableString(
        record.targetType,
        `admin audit logs[${index}].targetType`,
      ),
    };
  });
}

export function parseAdminUsersPage(
  payload: unknown,
): AdminResourcePage<AdminUserListItem> {
  return parseAdminResourcePage(payload, "admin users", parseAdminUsersList);
}

export function parseAdminProvidersPage(
  payload: unknown,
): AdminResourcePage<AdminProviderListItem> {
  return parseAdminResourcePage(
    payload,
    "admin providers",
    parseAdminProvidersList,
  );
}

export function parseAdminBookingsPage(
  payload: unknown,
): AdminResourcePage<AdminBookingListItem> {
  return parseAdminResourcePage(
    payload,
    "admin bookings",
    parseAdminBookingsList,
  );
}

export function parseAdminReportsPage(
  payload: unknown,
): AdminResourcePage<AdminReportListItem> {
  return parseAdminResourcePage(
    payload,
    "admin reports",
    parseAdminReportsList,
  );
}

export function parseAdminReviewsPage(
  payload: unknown,
): AdminResourcePage<AdminReviewListItem> {
  return parseAdminResourcePage(
    payload,
    "admin reviews",
    parseAdminReviewsList,
  );
}

export function parseAdminAuditLogsPage(
  payload: unknown,
): AdminResourcePage<AdminAuditLogListItem> {
  return parseAdminResourcePage(
    payload,
    "admin audit logs",
    parseAdminAuditLogsList,
  );
}

function parseAdminResourcePage<T>(
  payload: unknown,
  label: string,
  parseList: (payload: unknown) => readonly T[],
): AdminResourcePage<T> {
  return {
    items: parseList(payload),
    nextCursor: readNextCursor(payload, label),
  };
}

function readList(payload: unknown, label: string): readonly unknown[] {
  if (Array.isArray(payload)) {
    return payload;
  }

  const record = expectRecord(payload, label);

  if (!Array.isArray(record.items)) {
    throw new AdminResourceContractError(`${label}.items must be an array.`);
  }

  return record.items;
}

function readNextCursor(payload: unknown, label: string): string | null {
  if (Array.isArray(payload)) {
    return null;
  }

  const record = expectRecord(payload, label);
  if (record.nextCursor === undefined || record.nextCursor === null) {
    return null;
  }

  return expectString(record.nextCursor, `${label}.nextCursor`);
}

function expectRecord(value: unknown, label: string): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new AdminResourceContractError(`${label} must be an object.`);
  }

  return value as Record<string, unknown>;
}

function expectString(value: unknown, label: string): string {
  if (typeof value !== "string" || value.length === 0) {
    throw new AdminResourceContractError(
      `${label} must be a non-empty string.`,
    );
  }

  return value;
}

function expectNumber(value: unknown, label: string): number {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    throw new AdminResourceContractError(`${label} must be a finite number.`);
  }

  return value;
}

function expectStringArray(value: unknown, label: string): readonly string[] {
  if (!Array.isArray(value)) {
    throw new AdminResourceContractError(`${label} must be an array.`);
  }

  return value.map((item, index) => expectString(item, `${label}[${index}]`));
}

function expectAdminReportStatus(
  value: unknown,
  label: string,
): AdminReportStatus {
  const status = expectString(value, label);
  if (!ADMIN_REPORT_STATUSES.includes(status as AdminReportStatus)) {
    throw new AdminResourceContractError(`${label} is not supported.`);
  }

  return status as AdminReportStatus;
}

function expectAdminReviewStatus(
  value: unknown,
  label: string,
): AdminReviewStatus {
  const status = expectString(value, label);
  if (!ADMIN_REVIEW_STATUSES.includes(status as AdminReviewStatus)) {
    throw new AdminResourceContractError(`${label} is not supported.`);
  }

  return status as AdminReviewStatus;
}

function expectAdminUserStatus(value: unknown, label: string): AdminUserStatus {
  const status = expectString(value, label);
  if (!["active", "blocked", "deleted"].includes(status)) {
    throw new AdminResourceContractError(`${label} is not supported.`);
  }

  return status as AdminUserStatus;
}

function readOptionalString(value: unknown, label: string): string | undefined {
  if (value === undefined || value === null) {
    return undefined;
  }

  return expectString(value, label);
}

function readNullableString(value: unknown, label: string): string | null {
  if (value === undefined || value === null) {
    return null;
  }

  return expectString(value, label);
}
