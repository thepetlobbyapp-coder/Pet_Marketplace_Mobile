import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import {
  ApiClientError,
  createPet,
  createTutorProfile,
  deletePet,
  getPets,
  getMe,
  updatePet,
  updateMe,
  updateTutorProfile,
} from "../../src/api/client";
import type { PetResponse, PetSpecies } from "../../src/api/types";
import { useAuth } from "../../src/auth/AuthProvider";
import { Avatar } from "../../src/components/Avatar";
import { Badge } from "../../src/components/Badge";
import { Button } from "../../src/components/Button";
import { Card } from "../../src/components/Card";
import { ErrorState } from "../../src/components/ErrorState";
import { LoadingState } from "../../src/components/LoadingState";
import { Screen } from "../../src/components/Screen";
import { TextField } from "../../src/components/TextField";
import { colors, spacing, typography } from "../../src/design/tokens";
import { t } from "../../src/i18n";

const PET_NAME_LIMIT = 120;
const PET_SPECIES_OPTIONS: PetSpecies[] = ["dog", "cat", "other"];

export default function ProfileScreen() {
  const { accessToken, session } = useAuth();
  const queryClient = useQueryClient();
  const meQueryKey = useMemo(
    () => ["me", session?.user.id],
    [session?.user.id],
  );
  const petsQueryKey = useMemo(
    () => ["pets", session?.user.id],
    [session?.user.id],
  );
  const [localeDraft, setLocaleDraft] = useState<string | null>(null);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [tutorDisplayNameDraft, setTutorDisplayNameDraft] = useState<
    string | null
  >(null);
  const [tutorProfileMessage, setTutorProfileMessage] = useState<string | null>(
    null,
  );
  const [newPetName, setNewPetName] = useState("");
  const [newPetSpecies, setNewPetSpecies] = useState<PetSpecies>("other");
  const [editingPetId, setEditingPetId] = useState<string | null>(null);
  const [editingPetName, setEditingPetName] = useState("");
  const [pendingDeletePetId, setPendingDeletePetId] = useState<string | null>(
    null,
  );
  const [petMessage, setPetMessage] = useState<string | null>(null);

  const meQuery = useQuery({
    enabled: Boolean(accessToken),
    queryKey: meQueryKey,
    queryFn: () => getMe(accessToken),
    retry: 1,
  });

  const petsQuery = useQuery({
    enabled: Boolean(accessToken && meQuery.data),
    queryKey: petsQueryKey,
    queryFn: () => getPets(accessToken),
    retry: 1,
  });

  const locale = localeDraft ?? meQuery.data?.locale ?? "";
  const tutorProfile = meQuery.data?.profiles?.tutor;
  const tutorDisplayName =
    tutorDisplayNameDraft ?? tutorProfile?.displayName ?? "";

  const updateProfile = useMutation({
    mutationFn: () => updateMe(accessToken, { locale: locale.trim() }),
    onError: () => {
      setSaveMessage(t("profile.saveError"));
    },
    onSuccess: (updatedProfile) => {
      queryClient.setQueryData(meQueryKey, updatedProfile);
      setLocaleDraft(null);
      setSaveMessage(t("profile.saveSuccess"));
    },
  });

  const upsertTutorProfile = useMutation({
    mutationFn: () => {
      const body = { displayName: tutorDisplayName.trim() };
      return tutorProfile
        ? updateTutorProfile(accessToken, body)
        : createTutorProfile(accessToken, body);
    },
    onError: () => {
      setTutorProfileMessage(t("profile.tutorProfileSaveError"));
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: meQueryKey });
      setTutorDisplayNameDraft(null);
      setTutorProfileMessage(t("profile.tutorProfileSaveSuccess"));
    },
  });

  const createPetMutation = useMutation({
    mutationFn: () =>
      createPet(accessToken, {
        name: newPetName.trim(),
        species: newPetSpecies,
      }),
    onError: (error) => {
      setPetMessage(formatPetError(error));
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: petsQueryKey });
      setNewPetName("");
      setNewPetSpecies("other");
      setPetMessage(t("profile.petsCreateSuccess"));
    },
  });

  const updatePetMutation = useMutation({
    mutationFn: (pet: PetResponse) =>
      updatePet(accessToken, pet.id, { name: editingPetName.trim() }),
    onError: (error) => {
      setPetMessage(formatPetError(error));
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: petsQueryKey });
      setEditingPetId(null);
      setEditingPetName("");
      setPetMessage(t("profile.petsUpdateSuccess"));
    },
  });

  const deletePetMutation = useMutation({
    mutationFn: (pet: PetResponse) => deletePet(accessToken, pet.id),
    onError: (error) => {
      setPetMessage(formatPetError(error));
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: petsQueryKey });
      setPendingDeletePetId(null);
      setPetMessage(t("profile.petsDeleteSuccess"));
    },
  });

  const trimmedLocale = locale.trim();
  const savedLocale = meQuery.data?.locale ?? "";
  const hasLocaleChanges = trimmedLocale !== savedLocale;
  const trimmedTutorDisplayName = tutorDisplayName.trim();
  const savedTutorDisplayName = tutorProfile?.displayName ?? "";
  const hasTutorProfileChanges =
    trimmedTutorDisplayName !== savedTutorDisplayName;
  const isTutorDisplayNameValid =
    trimmedTutorDisplayName.length > 0 && trimmedTutorDisplayName.length <= 80;
  const trimmedNewPetName = newPetName.trim();
  const editingPet = petsQuery.data?.find((pet) => pet.id === editingPetId);
  const trimmedEditingPetName = editingPetName.trim();
  const isNewPetNameValid =
    trimmedNewPetName.length > 0 &&
    trimmedNewPetName.length <= PET_NAME_LIMIT;
  const isEditingPetNameValid =
    trimmedEditingPetName.length > 0 &&
    trimmedEditingPetName.length <= PET_NAME_LIMIT;
  const hasEditingPetNameChanges =
    Boolean(editingPet) && trimmedEditingPetName !== editingPet?.name;
  const shouldShowTutorDisplayNameError =
    tutorDisplayNameDraft !== null && !isTutorDisplayNameValid;
  const shouldShowNewPetNameError =
    newPetName.length > 0 && !isNewPetNameValid;
  const shouldShowEditingPetNameError =
    editingPetId !== null && editingPetName.length > 0 && !isEditingPetNameValid;
  const canSave =
    Boolean(accessToken) &&
    Boolean(meQuery.data) &&
    trimmedLocale.length > 0 &&
    hasLocaleChanges &&
    !updateProfile.isPending;
  const canSaveTutorProfile =
    Boolean(accessToken) &&
    Boolean(meQuery.data) &&
    hasTutorProfileChanges &&
    isTutorDisplayNameValid &&
    !upsertTutorProfile.isPending;
  const canCreatePet =
    Boolean(accessToken) &&
    Boolean(meQuery.data) &&
    isNewPetNameValid &&
    !createPetMutation.isPending;
  const canSavePetName =
    Boolean(accessToken) &&
    Boolean(meQuery.data) &&
    hasEditingPetNameChanges &&
    isEditingPetNameValid &&
    !updatePetMutation.isPending;

  const heroName = tutorProfile?.displayName?.trim() || t("profile.title");

  return (
    <Screen variant="top">
      <View style={styles.hero}>
        <Avatar name={heroName} size={64} />
        <View style={styles.heroText}>
          <Text numberOfLines={1} style={styles.title}>
            {heroName}
          </Text>
          <Text numberOfLines={1} style={styles.heroEmail}>
            {meQuery.data?.email ?? t("profile.body")}
          </Text>
          {meQuery.data ? (
            <View style={styles.heroBadge}>
              <Badge label={meQuery.data.status} tone="info" />
            </View>
          ) : null}
        </View>
      </View>

      {!accessToken ? (
        <Card>
          <Text style={styles.body}>{t("profile.noSession")}</Text>
        </Card>
      ) : meQuery.isLoading ? (
        <Card>
          <LoadingState label={t("profile.loading")} />
        </Card>
      ) : meQuery.isError ? (
        <Card>
          <ErrorState
            actionLabel={t("common.retry")}
            message={t("profile.error")}
            onRetry={() => meQuery.refetch()}
            title={t("common.error")}
          />
        </Card>
      ) : meQuery.data ? (
        <>
          <Card>
            <View style={styles.details}>
              <Text style={styles.sectionTitle}>{t("profile.account")}</Text>
              <ProfileRow
                label={t("profile.email")}
                value={meQuery.data.email ?? t("common.notAvailable")}
              />
              <ProfileRow label={t("profile.status")} value={meQuery.data.status} />
              <ProfileRow
                label={t("profile.roles")}
                value={formatRoles(meQuery.data.roles)}
              />
              <ProfileRow
                label={t("profile.createdAt")}
                value={formatDate(meQuery.data.createdAt)}
              />
              <ProfileRow
                label={t("profile.updatedAt")}
                value={formatDate(meQuery.data.updatedAt)}
              />
            </View>
          </Card>

          <Card>
            <View style={styles.details}>
              <Text style={styles.sectionTitle}>{t("profile.details")}</Text>
              <ProfileRow
                label={t("profile.tutorProfile")}
                value={formatTutorProfile(meQuery.data.profiles?.tutor)}
              />
              <TextField
                autoCapitalize="words"
                autoCorrect={false}
                label={t("profile.tutorDisplayName")}
                maxLength={80}
                onChangeText={(value) => {
                  setTutorDisplayNameDraft(value);
                  setTutorProfileMessage(null);
                }}
                placeholder={t("profile.tutorDisplayNamePlaceholder")}
                value={tutorDisplayName}
              />
              <Text style={styles.help}>{t("profile.tutorDisplayNameHelp")}</Text>
              {shouldShowTutorDisplayNameError ? (
                <Text style={styles.errorMessage}>
                  {t("profile.tutorDisplayNameInvalid")}
                </Text>
              ) : null}
              {hasTutorProfileChanges ? (
                <Text style={styles.notice}>{t("profile.unsavedChanges")}</Text>
              ) : null}
              {tutorProfileMessage ? (
                <Text
                  style={[
                    styles.message,
                    upsertTutorProfile.isError ? styles.errorMessage : null,
                  ]}
                >
                  {tutorProfileMessage}
                </Text>
              ) : null}
              <View style={styles.actions}>
                <Button
                  disabled={
                    !hasTutorProfileChanges || upsertTutorProfile.isPending
                  }
                  label={t("common.cancel")}
                  onPress={() => {
                    setTutorDisplayNameDraft(null);
                    setTutorProfileMessage(null);
                  }}
                  variant="secondary"
                />
                <Button
                  disabled={!canSaveTutorProfile}
                  isLoading={upsertTutorProfile.isPending}
                  label={t("profile.saveTutorProfile")}
                  onPress={() => upsertTutorProfile.mutate()}
                />
              </View>
              <ProfileRow
                label={t("profile.providerProfile")}
                value={formatProviderProfile(meQuery.data.profiles?.provider)}
              />
            </View>
          </Card>

          <Card>
            <View style={styles.details}>
              <Text style={styles.sectionTitle}>{t("profile.pets")}</Text>
              <TextField
                autoCapitalize="words"
                autoCorrect={false}
                label={t("profile.petName")}
                maxLength={PET_NAME_LIMIT}
                onChangeText={(value) => {
                  setNewPetName(value);
                  setPetMessage(null);
                }}
                placeholder={t("profile.petNamePlaceholder")}
                value={newPetName}
              />
              {shouldShowNewPetNameError ? (
                <Text style={styles.errorMessage}>{t("profile.petNameInvalid")}</Text>
              ) : null}
              <View style={styles.segmentGroup}>
                {PET_SPECIES_OPTIONS.map((species) => (
                  <Pressable
                    accessibilityRole="button"
                    key={species}
                    onPress={() => {
                      setNewPetSpecies(species);
                      setPetMessage(null);
                    }}
                    style={[
                      styles.segment,
                      newPetSpecies === species ? styles.segmentSelected : null,
                    ]}
                  >
                    <Text
                      style={[
                        styles.segmentLabel,
                        newPetSpecies === species
                          ? styles.segmentSelectedLabel
                          : null,
                      ]}
                    >
                      {formatSpecies(species)}
                    </Text>
                  </Pressable>
                ))}
              </View>
              <Button
                disabled={!canCreatePet}
                isLoading={createPetMutation.isPending}
                label={t("profile.createPet")}
                onPress={() => createPetMutation.mutate()}
              />
              {petMessage ? (
                <Text
                  style={[
                    styles.message,
                    createPetMutation.isError ||
                    updatePetMutation.isError ||
                    deletePetMutation.isError
                      ? styles.errorMessage
                      : null,
                  ]}
                >
                  {petMessage}
                </Text>
              ) : null}
              {petsQuery.isLoading ? (
                <LoadingState label={t("profile.petsLoading")} />
              ) : petsQuery.isError ? (
                <ErrorState
                  actionLabel={t("common.retry")}
                  message={t("profile.petsError")}
                  onRetry={() => petsQuery.refetch()}
                  title={t("common.error")}
                />
              ) : petsQuery.data && petsQuery.data.length > 0 ? (
                <View style={styles.petList}>
                  {petsQuery.data.map((pet) => {
                    const isEditing = editingPetId === pet.id;
                    const isConfirmingDelete = pendingDeletePetId === pet.id;
                    const isUpdating =
                      updatePetMutation.isPending &&
                      updatePetMutation.variables?.id === pet.id;
                    const isDeleting =
                      deletePetMutation.isPending &&
                      deletePetMutation.variables?.id === pet.id;

                    return (
                      <View key={pet.id} style={styles.petItem}>
                        <View style={styles.petSummary}>
                          <Text style={styles.petName}>{pet.name}</Text>
                          <Text style={styles.petMeta}>
                            {formatSpecies(pet.species)}
                          </Text>
                        </View>
                        {isEditing ? (
                          <View style={styles.details}>
                            <TextField
                              autoCapitalize="words"
                              autoCorrect={false}
                              label={t("profile.editPetName")}
                              maxLength={PET_NAME_LIMIT}
                              onChangeText={(value) => {
                                setEditingPetName(value);
                                setPetMessage(null);
                              }}
                              value={editingPetName}
                            />
                            {shouldShowEditingPetNameError ? (
                              <Text style={styles.errorMessage}>
                                {t("profile.petNameInvalid")}
                              </Text>
                            ) : null}
                            <View style={styles.actions}>
                              <Button
                                disabled={isUpdating}
                                label={t("common.cancel")}
                                onPress={() => {
                                  setEditingPetId(null);
                                  setEditingPetName("");
                                  setPetMessage(null);
                                }}
                                variant="secondary"
                              />
                              <Button
                                disabled={!canSavePetName}
                                isLoading={isUpdating}
                                label={t("common.save")}
                                onPress={() => updatePetMutation.mutate(pet)}
                              />
                            </View>
                          </View>
                        ) : (
                          <>
                            {isConfirmingDelete ? (
                              <View style={styles.deleteConfirm}>
                                <Text style={styles.deleteConfirmText}>
                                  {t("profile.deletePetConfirm")}
                                </Text>
                                <View style={styles.actions}>
                                  <Button
                                    disabled={isDeleting}
                                    label={t("common.cancel")}
                                    onPress={() => {
                                      setPendingDeletePetId(null);
                                      setPetMessage(null);
                                    }}
                                    variant="secondary"
                                  />
                                  <Button
                                    disabled={deletePetMutation.isPending}
                                    isLoading={isDeleting}
                                    label={t("profile.deletePet")}
                                    onPress={() => {
                                      setPetMessage(null);
                                      deletePetMutation.mutate(pet);
                                    }}
                                  />
                                </View>
                              </View>
                            ) : (
                              <View style={styles.actions}>
                                <Button
                                  disabled={updatePetMutation.isPending}
                                  label={t("profile.editPet")}
                                  onPress={() => {
                                    setEditingPetId(pet.id);
                                    setEditingPetName(pet.name);
                                    setPendingDeletePetId(null);
                                    setPetMessage(null);
                                  }}
                                  variant="secondary"
                                />
                                <Button
                                  disabled={deletePetMutation.isPending}
                                  label={t("profile.deletePet")}
                                  onPress={() => {
                                    setEditingPetId(null);
                                    setEditingPetName("");
                                    setPendingDeletePetId(pet.id);
                                    setPetMessage(null);
                                  }}
                                  variant="secondary"
                                />
                              </View>
                            )}
                          </>
                        )}
                      </View>
                    );
                  })}
                </View>
              ) : (
                <Text style={styles.body}>{t("profile.petsEmpty")}</Text>
              )}
            </View>
          </Card>

          <Card>
            <View style={styles.details}>
              <Text style={styles.sectionTitle}>{t("profile.preferences")}</Text>
              <TextField
                autoCapitalize="none"
                autoCorrect={false}
                label={t("profile.locale")}
                onChangeText={(value) => {
                  setLocaleDraft(value);
                  setSaveMessage(null);
                }}
                placeholder="en-GB"
                value={locale}
              />
              <Text style={styles.help}>{t("profile.localeHelp")}</Text>
              {hasLocaleChanges ? (
                <Text style={styles.notice}>{t("profile.unsavedChanges")}</Text>
              ) : null}
              {saveMessage ? (
                <Text
                  style={[
                    styles.message,
                    updateProfile.isError ? styles.errorMessage : null,
                  ]}
                >
                  {saveMessage}
                </Text>
              ) : null}
              <View style={styles.actions}>
                <Button
                  disabled={!hasLocaleChanges || updateProfile.isPending}
                  label={t("common.cancel")}
                  onPress={() => {
                    setLocaleDraft(null);
                    setSaveMessage(null);
                  }}
                  variant="secondary"
                />
                <Button
                  disabled={!canSave}
                  isLoading={updateProfile.isPending}
                  label={t("common.save")}
                  onPress={() => updateProfile.mutate()}
                />
              </View>
            </View>
          </Card>
        </>
      ) : null}

      <Button
        disabled={!accessToken}
        label={t("profile.refresh")}
        onPress={() => meQuery.refetch()}
        variant="secondary"
      />
    </Screen>
  );
}

function ProfileRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

function formatPetError(error: unknown): string {
  const status =
    error instanceof ApiClientError
      ? error.status
      : typeof error === "object" && error && "status" in error
        ? (error as { status?: unknown }).status
        : null;

  if (status === 401) return t("profile.petsAuthError");
  if (status === 404) return t("profile.petsNotFoundError");
  if (status === 409) return t("profile.petsConflictError");
  if (status === 400) return t("profile.petsValidationError");

  return t("profile.petsActionError");
}

function formatSpecies(species: PetSpecies): string {
  return t(`profile.petSpecies.${species}`);
}

function formatDate(value?: string): string {
  if (!value) {
    return t("common.notAvailable");
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return t("common.notAvailable");
  }

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

function formatRoles(roles: string[]): string {
  return roles.length > 0 ? roles.join(", ") : t("common.notAvailable");
}

function formatTutorProfile(profile?: { displayName: string; id: string }) {
  return profile?.displayName || t("profile.notSet");
}

function formatProviderProfile(profile?: {
  displayName: string;
  id: string;
  ratingAverage: number | null;
  ratingCount: number;
  serviceRadiusKm: number;
  status: string;
}) {
  if (!profile) {
    return t("profile.notSet");
  }

  return `${profile.displayName} - ${profile.status}`;
}

const styles = StyleSheet.create({
  hero: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing[4],
    marginBottom: spacing[2],
  },
  heroText: {
    flex: 1,
    gap: spacing[1],
  },
  heroEmail: {
    color: colors.muted,
    fontSize: typography.small,
  },
  heroBadge: {
    marginTop: spacing[1],
  },
  title: {
    color: colors.text,
    fontSize: typography.section,
    fontWeight: "800",
  },
  body: {
    color: colors.muted,
    fontSize: typography.body,
    lineHeight: 24,
  },
  details: {
    gap: spacing[3],
  },
  sectionTitle: {
    color: colors.text,
    fontSize: typography.section,
    fontWeight: "700",
  },
  row: {
    gap: spacing[1],
  },
  label: {
    color: colors.muted,
    fontSize: typography.caption,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  value: {
    color: colors.text,
    fontSize: typography.body,
    fontWeight: "700",
  },
  petList: {
    gap: spacing[3],
  },
  petItem: {
    borderColor: colors.border,
    borderTopWidth: 1,
    gap: spacing[3],
    paddingTop: spacing[3],
  },
  petSummary: {
    gap: spacing[1],
  },
  petName: {
    color: colors.text,
    fontSize: typography.body,
    fontWeight: "800",
  },
  petMeta: {
    color: colors.muted,
    fontSize: typography.small,
    fontWeight: "700",
  },
  deleteConfirm: {
    backgroundColor: colors.surfaceMuted,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    gap: spacing[3],
    padding: spacing[3],
  },
  deleteConfirmText: {
    color: colors.text,
    fontSize: typography.body,
    fontWeight: "700",
  },
  segmentGroup: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing[2],
  },
  segment: {
    backgroundColor: colors.surfaceMuted,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    minHeight: 40,
    minWidth: 84,
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2],
  },
  segmentSelected: {
    backgroundColor: colors.accentSoft,
    borderColor: colors.accent,
  },
  segmentLabel: {
    color: colors.muted,
    fontSize: typography.small,
    fontWeight: "700",
    textAlign: "center",
  },
  segmentSelectedLabel: {
    color: colors.accentPressed,
  },
  help: {
    color: colors.muted,
    fontSize: typography.small,
    lineHeight: 20,
  },
  notice: {
    color: colors.accentPressed,
    fontSize: typography.small,
    fontWeight: "700",
  },
  message: {
    color: colors.successText,
    fontSize: typography.small,
    fontWeight: "700",
  },
  errorMessage: {
    color: colors.danger,
  },
  actions: {
    gap: spacing[3],
  },
});
