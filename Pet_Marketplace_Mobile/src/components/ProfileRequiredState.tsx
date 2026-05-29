import { router } from "expo-router";
import { EmptyState } from "./EmptyState";
import { t } from "../i18n";

export function TutorProfileRequiredState({
  message = t("access.tutorRequired.body"),
  title = t("access.tutorRequired.title"),
}: {
  message?: string;
  title?: string;
}) {
  return (
    <EmptyState
      actionLabel={t("access.tutorRequired.action")}
      message={message}
      onAction={() => router.push("/profile")}
      title={title}
    />
  );
}

export function TutorAddressRequiredState({
  message = t("access.addressRequired.body"),
  title = t("access.addressRequired.title"),
}: {
  message?: string;
  title?: string;
}) {
  return (
    <EmptyState
      actionLabel={t("access.addressRequired.action")}
      message={message}
      onAction={() => router.push("/profile")}
      title={title}
    />
  );
}
