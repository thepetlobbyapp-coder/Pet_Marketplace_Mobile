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

export interface AdminUserListItem {
  readonly id: string;
  readonly email: string;
  readonly displayName?: string;
  readonly roles: readonly string[];
  readonly status: string;
  readonly createdAt: string;
  readonly updatedAt: string;
}

export interface AdminProviderListItem {
  readonly id: string;
  readonly userId?: string;
  readonly displayName?: string;
  readonly status: string;
  readonly serviceCount?: number;
  readonly createdAt: string;
  readonly updatedAt: string;
}

export interface AdminBookingListItem {
  readonly id: string;
  readonly status: string;
  readonly serviceType?: string;
  readonly startsAt?: string;
  readonly endsAt?: string;
  readonly participantCount?: number;
  readonly createdAt: string;
  readonly updatedAt: string;
}

export interface AdminReportListItem {
  readonly id: string;
  readonly status: string;
  readonly category: string;
  readonly targetType?: string;
  readonly targetId?: string;
  readonly createdAt: string;
  readonly updatedAt: string;
}

export type AdminReportStatus =
  | "open"
  | "in_review"
  | "action_taken"
  | "dismissed"
  | "closed";

export interface UpdateAdminReportRequest {
  readonly internalNote?: string | null;
  readonly status: AdminReportStatus;
}

export interface AdminReviewListItem {
  readonly id: string;
  readonly status: string;
  readonly rating: number;
  readonly reportCount?: number;
  readonly createdAt: string;
  readonly updatedAt: string;
}

export interface AdminAuditLogListItem {
  readonly id: string;
  readonly action: string;
  readonly actorEmail?: string;
  readonly targetType?: string;
  readonly targetId?: string;
  readonly createdAt: string;
}

type AssertNoForbiddenFields<T> =
  Extract<keyof T, AdminResourceForbiddenField> extends never ? true : never;

export const adminUserListItemHasNoForbiddenFields: AssertNoForbiddenFields<AdminUserListItem> =
  true;
export const adminProviderListItemHasNoForbiddenFields: AssertNoForbiddenFields<AdminProviderListItem> =
  true;
export const adminBookingListItemHasNoForbiddenFields: AssertNoForbiddenFields<AdminBookingListItem> =
  true;
export const adminReportListItemHasNoForbiddenFields: AssertNoForbiddenFields<AdminReportListItem> =
  true;
export const adminReviewListItemHasNoForbiddenFields: AssertNoForbiddenFields<AdminReviewListItem> =
  true;
export const adminAuditLogListItemHasNoForbiddenFields: AssertNoForbiddenFields<AdminAuditLogListItem> =
  true;

export class AdminResourceContractError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AdminResourceContractError";
  }
}

export function parseAdminUsersList(payload: unknown): readonly AdminUserListItem[] {
  return readList(payload, "admin users").map((item, index) => {
    const record = expectRecord(item, `admin users[${index}]`);

    return {
      createdAt: expectString(record.createdAt, `admin users[${index}].createdAt`),
      displayName: readOptionalString(
        record.displayName,
        `admin users[${index}].displayName`,
      ),
      email: expectString(record.email, `admin users[${index}].email`),
      id: expectString(record.id, `admin users[${index}].id`),
      roles: expectStringArray(record.roles, `admin users[${index}].roles`),
      status: expectString(record.status, `admin users[${index}].status`),
      updatedAt: expectString(record.updatedAt, `admin users[${index}].updatedAt`),
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
      displayName: readOptionalString(
        record.displayName,
        `admin providers[${index}].displayName`,
      ),
      id: expectString(record.id, `admin providers[${index}].id`),
      serviceCount: readOptionalNumber(
        record.serviceCount,
        `admin providers[${index}].serviceCount`,
      ),
      status: expectString(record.status, `admin providers[${index}].status`),
      updatedAt: expectString(
        record.updatedAt,
        `admin providers[${index}].updatedAt`,
      ),
      userId: readOptionalString(record.userId, `admin providers[${index}].userId`),
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
      endsAt: readOptionalString(record.endsAt, `admin bookings[${index}].endsAt`),
      id: expectString(record.id, `admin bookings[${index}].id`),
      participantCount: readOptionalNumber(
        record.participantCount,
        `admin bookings[${index}].participantCount`,
      ),
      serviceType: readOptionalString(
        record.serviceType,
        `admin bookings[${index}].serviceType`,
      ),
      startsAt: readOptionalString(
        record.startsAt,
        `admin bookings[${index}].startsAt`,
      ),
      status: expectString(record.status, `admin bookings[${index}].status`),
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
      category: expectString(record.category, `admin reports[${index}].category`),
      createdAt: expectString(
        record.createdAt,
        `admin reports[${index}].createdAt`,
      ),
      id: expectString(record.id, `admin reports[${index}].id`),
      status: expectString(record.status, `admin reports[${index}].status`),
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
      createdAt: expectString(
        record.createdAt,
        `admin reviews[${index}].createdAt`,
      ),
      id: expectString(record.id, `admin reviews[${index}].id`),
      rating: expectNumber(record.rating, `admin reviews[${index}].rating`),
      reportCount: readOptionalNumber(
        record.reportCount,
        `admin reviews[${index}].reportCount`,
      ),
      status: expectString(record.status, `admin reviews[${index}].status`),
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
      actorEmail: readOptionalString(
        record.actorEmail,
        `admin audit logs[${index}].actorEmail`,
      ),
      createdAt: expectString(
        record.createdAt,
        `admin audit logs[${index}].createdAt`,
      ),
      id: expectString(record.id, `admin audit logs[${index}].id`),
      targetId: readOptionalString(
        record.targetId,
        `admin audit logs[${index}].targetId`,
      ),
      targetType: readOptionalString(
        record.targetType,
        `admin audit logs[${index}].targetType`,
      ),
    };
  });
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

function expectRecord(value: unknown, label: string): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new AdminResourceContractError(`${label} must be an object.`);
  }

  return value as Record<string, unknown>;
}

function expectString(value: unknown, label: string): string {
  if (typeof value !== "string" || value.length === 0) {
    throw new AdminResourceContractError(`${label} must be a non-empty string.`);
  }

  return value;
}

function readOptionalString(value: unknown, label: string): string | undefined {
  if (value === undefined || value === null) {
    return undefined;
  }

  return expectString(value, label);
}

function expectNumber(value: unknown, label: string): number {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    throw new AdminResourceContractError(`${label} must be a finite number.`);
  }

  return value;
}

function readOptionalNumber(value: unknown, label: string): number | undefined {
  if (value === undefined || value === null) {
    return undefined;
  }

  return expectNumber(value, label);
}

function expectStringArray(value: unknown, label: string): readonly string[] {
  if (!Array.isArray(value)) {
    throw new AdminResourceContractError(`${label} must be an array.`);
  }

  return value.map((item, index) => {
    if (typeof item !== "string" || item.length === 0) {
      throw new AdminResourceContractError(
        `${label}[${index}] must be a non-empty string.`,
      );
    }

    return item;
  });
}
