import { Ionicons } from "@expo/vector-icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import { type ComponentProps, type ReactNode, useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import {
  ApiClientError,
  createAddress,
  createPet,
  createProviderProfile,
  createTutorProfile,
  deletePet,
  getAddresses,
  getPets,
  getMe,
  updateAddress,
  updatePet,
} from "../../src/api/client";
import type {
  AddressLocationPrecision,
  AddressResponse,
  CreateAddressRequest,
  CreatePetRequest,
  MeResponse,
  PetResponse,
  PetSpecies,
  ProviderProfileStatus,
  Role,
  UpdateAddressRequest,
  UpdatePetRequest,
} from "../../src/api/types";
import {
  hasProviderProfile,
  hasTutorProfile,
  meQueryKey as buildMeQueryKey,
} from "../../src/api/useMeQuery";
import { useAuth } from "../../src/auth/AuthProvider";
import {
  AddressSheet,
  type AddressSheetSubmission,
} from "../../src/components/AddressSheet";
import {
  PetSheet,
  type PetSheetSubmission,
} from "../../src/components/PetSheet";
import { AvatarUploader } from "../../src/components/AvatarUploader";
import { Badge } from "../../src/components/Badge";
import { Button } from "../../src/components/Button";
import { Card } from "../../src/components/Card";
import { ErrorState } from "../../src/components/ErrorState";
import { LoadingState } from "../../src/components/LoadingState";
import { RatingStars } from "../../src/components/RatingStars";
import { Screen } from "../../src/components/Screen";
import { SectionHeader } from "../../src/components/SectionHeader";
import { TextField } from "../../src/components/TextField";
import { colors, spacing, typography } from "../../src/design/tokens";
import { t } from "../../src/i18n";

type AddressSheetState =
  | { mode: "create" }
  | { mode: "edit"; address: AddressResponse };

type PetSheetState =
  | { mode: "create" }
  | { mode: "edit"; pet: PetResponse };

export default function ProfileScreen() {
  const { accessToken, session, signOut } = useAuth();
  const queryClient = useQueryClient();
  const meQueryKey = useMemo(
    () => buildMeQueryKey(session?.user.id),
    [session?.user.id],
  );
  const petsQueryKey = useMemo(
    () => ["pets", session?.user.id],
    [session?.user.id],
  );
  const addressesQueryKey = useMemo(
    () => ["addresses", session?.user.id],
    [session?.user.id],
  );
  const [tutorDisplayNameDraft, setTutorDisplayNameDraft] = useState<
    string | null
  >(null);
  const [tutorProfileMessage, setTutorProfileMessage] = useState<string | null>(
    null,
  );
  const [providerDisplayNameDraft, setProviderDisplayNameDraft] = useState<
    string | null
  >(null);
  const [providerProfileMessage, setProviderProfileMessage] = useState<
    string | null
  >(null);
  const [petSheet, setPetSheet] = useState<PetSheetState | null>(null);
  const [pendingDeletePetId, setPendingDeletePetId] = useState<string | null>(
    null,
  );
  const [petMessage, setPetMessage] = useState<string | null>(null);
  const [addressSheet, setAddressSheet] = useState<AddressSheetState | null>(
    null,
  );
  const [addressMessage, setAddressMessage] = useState<string | null>(null);
  const [isSigningOut, setIsSigningOut] = useState(false);

  const meQuery = useQuery({
    enabled: Boolean(accessToken),
    queryKey: meQueryKey,
    queryFn: () => getMe(accessToken),
    retry: 1,
  });
  const canUseTutorTools = hasTutorProfile(meQuery.data);
  const canUseProviderTools = hasProviderProfile(meQuery.data);

  const petsQuery = useQuery({
    enabled: Boolean(accessToken && canUseTutorTools),
    queryKey: petsQueryKey,
    queryFn: () => getPets(accessToken),
    retry: 1,
  });

  const addressesQuery = useQuery({
    enabled: Boolean(accessToken && canUseTutorTools),
    queryKey: addressesQueryKey,
    queryFn: () => getAddresses(accessToken),
    retry: 1,
  });

  const tutorProfile = meQuery.data?.profiles?.tutor;
  const tutorDisplayName =
    tutorDisplayNameDraft ?? tutorProfile?.displayName ?? "";
  const providerProfile = meQuery.data?.profiles?.provider;
  const providerDisplayName =
    providerDisplayNameDraft ?? providerProfile?.displayName ?? "";

  const upsertTutorProfile = useMutation({
    mutationFn: () =>
      createTutorProfile(accessToken, {
        displayName: tutorDisplayName.trim(),
      }),
    onError: () => {
      setTutorProfileMessage(t("profile.tutorProfileSaveError"));
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: meQueryKey });
      setTutorDisplayNameDraft(null);
      setTutorProfileMessage(t("profile.tutorProfileSaveSuccess"));
    },
  });

  const upsertProviderProfile = useMutation({
    mutationFn: () =>
      createProviderProfile(accessToken, {
        displayName: providerDisplayName.trim(),
      }),
    onError: () => {
      setProviderProfileMessage(t("profile.providerProfileSaveError"));
    },
    onSuccess: async (profile) => {
      await queryClient.invalidateQueries({ queryKey: meQueryKey });
      setProviderDisplayNameDraft(null);
      setProviderProfileMessage(
        profile.status === "paused"
          ? t("profile.providerProfilePausedSuccess")
          : t("profile.providerProfileSaveSuccess"),
      );
    },
  });

  const createAddressMutation = useMutation({
    mutationFn: (body: CreateAddressRequest) => createAddress(accessToken, body),
    onError: (error) => {
      setAddressMessage(formatAddressError(error));
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: addressesQueryKey });
      setAddressSheet(null);
      setAddressMessage(t("profile.addressesCreateSuccess"));
    },
  });

  const updateAddressMutation = useMutation({
    mutationFn: ({ id, body }: { id: string; body: UpdateAddressRequest }) =>
      updateAddress(accessToken, id, body),
    onError: (error) => {
      setAddressMessage(formatAddressError(error));
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: addressesQueryKey });
      setAddressSheet(null);
      setAddressMessage(t("profile.addressesUpdateSuccess"));
    },
  });

  const createPetMutation = useMutation({
    mutationFn: (body: CreatePetRequest) => createPet(accessToken, body),
    onError: (error) => {
      setPetMessage(formatPetError(error));
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: petsQueryKey });
      setPetSheet(null);
      setPetMessage(t("profile.petsCreateSuccess"));
    },
  });

  const updatePetMutation = useMutation({
    mutationFn: ({ id, body }: { id: string; body: UpdatePetRequest }) =>
      updatePet(accessToken, id, body),
    onError: (error) => {
      setPetMessage(formatPetError(error));
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: petsQueryKey });
      setPetSheet(null);
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

  const trimmedTutorDisplayName = tutorDisplayName.trim();
  const savedTutorDisplayName = tutorProfile?.displayName ?? "";
  const hasTutorProfileChanges =
    trimmedTutorDisplayName !== savedTutorDisplayName;
  const isTutorDisplayNameValid =
    trimmedTutorDisplayName.length > 0 && trimmedTutorDisplayName.length <= 80;
  const trimmedProviderDisplayName = providerDisplayName.trim();
  const savedProviderDisplayName = providerProfile?.displayName ?? "";
  const hasProviderProfileChanges =
    trimmedProviderDisplayName !== savedProviderDisplayName;
  const isProviderDisplayNameValid =
    trimmedProviderDisplayName.length > 0 &&
    trimmedProviderDisplayName.length <= 80;
  const shouldShowTutorDisplayNameError =
    tutorDisplayNameDraft !== null && !isTutorDisplayNameValid;
  const shouldShowProviderDisplayNameError =
    providerDisplayNameDraft !== null && !isProviderDisplayNameValid;
  const canSaveTutorProfile =
    Boolean(accessToken) &&
    Boolean(meQuery.data) &&
    isTutorDisplayNameValid &&
    !upsertTutorProfile.isPending;
  const canSaveProviderProfile =
    Boolean(accessToken) &&
    Boolean(meQuery.data) &&
    isProviderDisplayNameValid &&
    !upsertProviderProfile.isPending;
  const isAddressSheetSubmitting =
    createAddressMutation.isPending || updateAddressMutation.isPending;
  const addressMutationsHaveError =
    createAddressMutation.isError || updateAddressMutation.isError;
  const isPetSheetSubmitting =
    createPetMutation.isPending || updatePetMutation.isPending;
  const petMutationsHaveError =
    createPetMutation.isError ||
    updatePetMutation.isError ||
    deletePetMutation.isError;

  const heroName = tutorProfile?.displayName?.trim() || t("profile.title");
  const heroAvatarUrl = meQuery.data?.avatarUrl ?? null;

  function openCreateAddressSheet() {
    setAddressMessage(null);
    setAddressSheet({ mode: "create" });
  }

  function openEditAddressSheet(address: AddressResponse) {
    setAddressMessage(null);
    setAddressSheet({ mode: "edit", address });
  }

  function closeAddressSheet() {
    if (isAddressSheetSubmitting) return;
    setAddressSheet(null);
  }

  function handleAddressSubmit(submission: AddressSheetSubmission) {
    if (addressSheet === null) return;
    if (addressSheet.mode === "create") {
      // CREATE always carries a fresh postcode lookup, so lat/long are
      // guaranteed by the sheet (Save button is disabled otherwise).
      if (submission.latitude === null || submission.longitude === null) {
        return;
      }
      createAddressMutation.mutate({
        city: submission.city,
        countryCode: "GB",
        label: submission.label,
        latitude: submission.latitude,
        locationPrecision: "postcode",
        longitude: submission.longitude,
        postcode: submission.postcode,
        publicAreaLabel: submission.publicAreaLabel,
        setAsDefaultTutorAddress: submission.setAsDefault,
      });
      return;
    }

    const original = addressSheet.address;
    const body: UpdateAddressRequest = {};

    if (submission.postcode !== (original.postcode ?? "")) {
      body.postcode = submission.postcode;
    }
    // City moves with the postcode lookup; only patch when it actually
    // changed so we never overwrite a manually-curated value with null.
    if (submission.city !== original.city) {
      body.city = submission.city;
    }
    if (submission.label !== original.label) {
      body.label = submission.label;
    }
    if (submission.publicAreaLabel !== original.publicAreaLabel) {
      body.publicAreaLabel = submission.publicAreaLabel;
    }
    if (submission.setAsDefault && !original.isDefaultTutorAddress) {
      body.setAsDefaultTutorAddress = true;
    }
    // Geo precision is implied by the workflow: if the user re-ran the
    // lookup it becomes 'postcode'; otherwise we leave the saved value.
    if (
      submission.latitude !== null &&
      submission.longitude !== null &&
      original.locationPrecision !== "postcode"
    ) {
      body.locationPrecision = "postcode";
    }

    if (Object.keys(body).length === 0) {
      setAddressSheet(null);
      return;
    }

    updateAddressMutation.mutate({ id: original.id, body });
  }

  function openCreatePetSheet() {
    setPetMessage(null);
    setPetSheet({ mode: "create" });
  }

  function openEditPetSheet(pet: PetResponse) {
    setPetMessage(null);
    setPetSheet({ mode: "edit", pet });
  }

  function closePetSheet() {
    if (isPetSheetSubmitting) return;
    setPetSheet(null);
  }

  function handlePetSubmit(submission: PetSheetSubmission) {
    if (petSheet === null) return;
    if (petSheet.mode === "create") {
      createPetMutation.mutate({
        name: submission.name,
        species: submission.species,
        size: submission.size,
        breed: submission.breed,
        ageRange: submission.ageRange,
        notes: submission.notes,
      });
      return;
    }

    // EDIT: send only the fields that actually changed. The backend's
    // `parseUpdatePetBody` rejects empty bodies, so we close the sheet
    // silently if nothing moved.
    const original = petSheet.pet;
    const body: UpdatePetRequest = {};
    if (submission.name !== original.name) body.name = submission.name;
    if (submission.species !== original.species) body.species = submission.species;
    if (submission.size !== original.size) body.size = submission.size;
    if (submission.breed !== (original.breed ?? null)) body.breed = submission.breed;
    if (submission.ageRange !== (original.ageRange ?? null)) {
      body.ageRange = submission.ageRange;
    }
    if (submission.notes !== (original.notes ?? null)) body.notes = submission.notes;

    if (Object.keys(body).length === 0) {
      setPetSheet(null);
      return;
    }
    updatePetMutation.mutate({ id: original.id, body });
  }

  // Patch the cached /me response in place so the hero avatar updates
  // instantly after upload/remove, without round-tripping through a
  // refetch. The next natural invalidation will reconcile if the server
  // returns extra fields.
  function handleAvatarChange(nextAvatarUrl: string | null) {
    queryClient.setQueryData(meQueryKey, (prev: MeResponse | undefined) => {
      if (!prev) return prev;
      return { ...prev, avatarUrl: nextAvatarUrl };
    });
  }

  async function runSignOut() {
    setIsSigningOut(true);
    try {
      await signOut();
      queryClient.clear();
      router.replace("/(auth)/login");
    } finally {
      setIsSigningOut(false);
    }
  }

  return (
    <Screen variant="top">
      <View style={styles.hero}>
        <AvatarUploader
          accessToken={accessToken}
          avatarUrl={heroAvatarUrl}
          disabled={!meQuery.data}
          name={heroName}
          onChange={handleAvatarChange}
          size={96}
        />
        <View style={styles.heroText}>
          <Text numberOfLines={1} style={styles.heroName}>
            {heroName}
          </Text>
          {meQuery.data?.email ? (
            <Text numberOfLines={1} style={styles.heroEmail}>
              {meQuery.data.email}
            </Text>
          ) : null}
          {meQuery.data ? (
            <View style={styles.heroChips}>
              {tutorProfile ? (
                <Badge
                  icon="person"
                  label={t("profile.hero.roleTutor")}
                  tone="info"
                />
              ) : null}
              {providerProfile ? (
                <Badge
                  icon="briefcase"
                  label={getProviderRoleLabel(providerProfile.status)}
                  tone={getProviderRoleTone(providerProfile.status)}
                />
              ) : null}
              {!tutorProfile && !providerProfile ? (
                <Badge
                  label={t("profile.hero.noRoles")}
                  tone="neutral"
                />
              ) : null}
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
          {!canUseTutorTools && !canUseProviderTools ? (
            <Card>
              <View style={styles.details}>
                <Text style={styles.sectionTitle}>
                  {t("profile.onboarding.title")}
                </Text>
                <Text style={styles.body}>{t("profile.onboarding.body")}</Text>
              </View>
            </Card>
          ) : null}

          <Card>
            <View style={styles.details}>
              <SectionHeader
                icon="person-circle"
                title={t("profile.section.account")}
              />
              <ProfileRow
                label={t("profile.email")}
                value={meQuery.data.email ?? t("common.notAvailable")}
              />
              <ProfileRow
                label={t("profile.status")}
                value={meQuery.data.status}
              />
              <ProfileRow label={t("profile.roles")}>
                {meQuery.data.roles.length > 0 ? (
                  <View style={styles.chipRow}>
                    {meQuery.data.roles.map((role) => (
                      <Badge
                        key={role}
                        label={formatRoleLabel(role)}
                        tone="info"
                      />
                    ))}
                  </View>
                ) : (
                  <Text style={styles.value}>{t("common.notAvailable")}</Text>
                )}
              </ProfileRow>
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
              <SectionHeader
                icon="id-card"
                title={t("profile.section.profiles")}
              />

              <View style={styles.profileSection}>
                <ProfileRow
                  label={t("profile.tutorProfile")}
                  value={formatTutorProfile(tutorProfile)}
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
                <Text style={styles.help}>
                  {t("profile.tutorDisplayNameHelp")}
                </Text>
                {shouldShowTutorDisplayNameError ? (
                  <Text style={styles.errorMessage}>
                    {t("profile.tutorDisplayNameInvalid")}
                  </Text>
                ) : null}
                {hasTutorProfileChanges ? (
                  <Text style={styles.notice}>
                    {t("profile.unsavedChanges")}
                  </Text>
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
                    label={getProfileActionLabel(
                      Boolean(tutorProfile),
                      hasTutorProfileChanges,
                      "tutor",
                    )}
                    onPress={() => upsertTutorProfile.mutate()}
                  />
                </View>
              </View>

              <View style={styles.dividerLine} />

              <View style={styles.profileSection}>
                <ProfileRow
                  label={t("profile.providerProfile")}
                  value={formatProviderProfile(providerProfile)}
                />
                {providerProfile ? (
                  <View style={styles.providerStats}>
                    {providerProfile.ratingAverage !== null ? (
                      <RatingStars
                        rating={providerProfile.ratingAverage}
                        reviewCount={providerProfile.ratingCount}
                      />
                    ) : (
                      <Badge
                        icon="star-outline"
                        label={t("profile.provider.stats.noRating")}
                        tone="neutral"
                      />
                    )}
                    <Badge
                      icon="navigate"
                      label={`${providerProfile.serviceRadiusKm} ${t(
                        "profile.provider.stats.km",
                      )}`}
                      tone="neutral"
                    />
                    <Badge
                      label={formatProviderStatus(providerProfile.status)}
                      tone={getProviderRoleTone(providerProfile.status)}
                    />
                  </View>
                ) : null}
                {providerProfile?.status === "paused" ? (
                  <Text style={styles.notice}>
                    {t("profile.providerPausedHelp")}
                  </Text>
                ) : null}
                <TextField
                  autoCapitalize="words"
                  autoCorrect={false}
                  label={t("profile.providerDisplayName")}
                  maxLength={80}
                  onChangeText={(value) => {
                    setProviderDisplayNameDraft(value);
                    setProviderProfileMessage(null);
                  }}
                  placeholder={t("profile.providerDisplayNamePlaceholder")}
                  value={providerDisplayName}
                />
                <Text style={styles.help}>
                  {t("profile.providerDisplayNameHelp")}
                </Text>
                {shouldShowProviderDisplayNameError ? (
                  <Text style={styles.errorMessage}>
                    {t("profile.providerDisplayNameInvalid")}
                  </Text>
                ) : null}
                {hasProviderProfileChanges ? (
                  <Text style={styles.notice}>
                    {t("profile.unsavedChanges")}
                  </Text>
                ) : null}
                {providerProfileMessage ? (
                  <Text
                    style={[
                      styles.message,
                      upsertProviderProfile.isError
                        ? styles.errorMessage
                        : null,
                    ]}
                  >
                    {providerProfileMessage}
                  </Text>
                ) : null}
                <View style={styles.actions}>
                  <Button
                    disabled={
                      !hasProviderProfileChanges ||
                      upsertProviderProfile.isPending
                    }
                    label={t("common.cancel")}
                    onPress={() => {
                      setProviderDisplayNameDraft(null);
                      setProviderProfileMessage(null);
                    }}
                    variant="secondary"
                  />
                  <Button
                    disabled={!canSaveProviderProfile}
                    isLoading={upsertProviderProfile.isPending}
                    label={getProfileActionLabel(
                      Boolean(providerProfile),
                      hasProviderProfileChanges,
                      "provider",
                    )}
                    onPress={() => upsertProviderProfile.mutate()}
                  />
                </View>
              </View>
            </View>
          </Card>

          <Card>
            <View style={styles.details}>
              <SectionHeader
                icon="location"
                title={t("profile.section.addresses")}
              />
              {!canUseTutorTools ? (
                <Text style={styles.body}>{t("profile.tutorToolsLocked")}</Text>
              ) : (
                <>
                  {addressMessage ? (
                    <Text
                      style={[
                        styles.message,
                        addressMutationsHaveError ? styles.errorMessage : null,
                      ]}
                    >
                      {addressMessage}
                    </Text>
                  ) : null}
                  {addressesQuery.isLoading ? (
                    <LoadingState label={t("profile.addressesLoading")} />
                  ) : addressesQuery.isError ? (
                    <ErrorState
                      actionLabel={t("common.retry")}
                      message={t("profile.addressesError")}
                      onRetry={() => addressesQuery.refetch()}
                      title={t("common.error")}
                    />
                  ) : addressesQuery.data && addressesQuery.data.length > 0 ? (
                    <View style={styles.addressList}>
                      {addressesQuery.data.map((address) => (
                        <View key={address.id} style={styles.addressItem}>
                          <View style={styles.addressSummary}>
                            <Text style={styles.addressName}>
                              {formatAddressTitle(address)}
                            </Text>
                            <Text style={styles.addressMeta}>
                              {formatAddressMeta(address)}
                            </Text>
                            {address.isDefaultTutorAddress ? (
                              <View style={styles.heroBadge}>
                                <Badge
                                  label={t("profile.addressDefaultActive")}
                                  tone="info"
                                />
                              </View>
                            ) : null}
                          </View>
                          <View style={styles.actions}>
                            <Button
                              disabled={isAddressSheetSubmitting}
                              label={t("profile.editAddress")}
                              onPress={() => openEditAddressSheet(address)}
                              variant="secondary"
                            />
                          </View>
                        </View>
                      ))}
                    </View>
                  ) : (
                    <Text style={styles.body}>
                      {t("profile.addressesEmpty")}
                    </Text>
                  )}
                  <Button
                    disabled={isAddressSheetSubmitting}
                    label={t("profile.createAddress")}
                    onPress={openCreateAddressSheet}
                  />
                </>
              )}
            </View>
          </Card>

          <Card>
            <View style={styles.details}>
              <SectionHeader
                icon="paw"
                title={t("profile.section.pets")}
              />
              {!canUseTutorTools ? (
                <Text style={styles.body}>{t("profile.tutorToolsLocked")}</Text>
              ) : (
                <>
                  {petMessage ? (
                    <Text
                      style={[
                        styles.message,
                        petMutationsHaveError ? styles.errorMessage : null,
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
                        const isConfirmingDelete = pendingDeletePetId === pet.id;
                        const isDeleting =
                          deletePetMutation.isPending &&
                          deletePetMutation.variables?.id === pet.id;

                        return (
                          <View key={pet.id} style={styles.petItem}>
                            <View style={styles.petSummary}>
                              <Text style={styles.petName}>{pet.name}</Text>
                              <View style={styles.petBadges}>
                                <Badge
                                  label={formatSpecies(pet.species)}
                                  tone="info"
                                />
                                {pet.size !== "unknown" ? (
                                  <Badge
                                    label={t(`profile.pet.size.${pet.size}`)}
                                    tone="neutral"
                                  />
                                ) : null}
                                {pet.breed ? (
                                  <Badge label={pet.breed} tone="neutral" />
                                ) : null}
                                {pet.ageRange ? (
                                  <Badge
                                    icon="time"
                                    label={pet.ageRange}
                                    tone="neutral"
                                  />
                                ) : null}
                              </View>
                              {pet.notes ? (
                                <Text
                                  numberOfLines={2}
                                  style={styles.petNotes}
                                >
                                  {pet.notes}
                                </Text>
                              ) : null}
                            </View>
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
                                  disabled={isPetSheetSubmitting}
                                  label={t("profile.editPet")}
                                  onPress={() => openEditPetSheet(pet)}
                                  variant="secondary"
                                />
                                <Button
                                  disabled={deletePetMutation.isPending}
                                  label={t("profile.deletePet")}
                                  onPress={() => {
                                    setPendingDeletePetId(pet.id);
                                    setPetMessage(null);
                                  }}
                                  variant="secondary"
                                />
                              </View>
                            )}
                          </View>
                        );
                      })}
                    </View>
                  ) : (
                    <Text style={styles.body}>{t("profile.petsEmpty")}</Text>
                  )}
                  <Button
                    disabled={isPetSheetSubmitting}
                    label={t("profile.createPet")}
                    onPress={openCreatePetSheet}
                  />
                </>
              )}
            </View>
          </Card>

          <Card>
            <View style={styles.details}>
              <SectionHeader
                icon="shield-checkmark"
                title={t("profile.section.accountAndLegal")}
              />
              <LegalLinkRow
                icon="document-text"
                label={t("profile.legal.terms")}
                onPress={() => router.push("/legal/terms")}
              />
              <LegalLinkRow
                icon="lock-closed"
                label={t("profile.legal.privacy")}
                onPress={() => router.push("/legal/privacy")}
              />
              <View style={styles.dividerLine} />
              <LegalLinkRow
                icon="settings-sharp"
                label={t("profile.legal.openSettings")}
                onPress={() => router.push("/settings")}
              />
              <Text style={styles.help}>
                {t("profile.legal.openSettingsHint")}
              </Text>
            </View>
          </Card>

          {/*
           * DESIGN AGENT: Locale (Preferences) card hidden while the app is
           * UK-only. The PATCH /me { locale } endpoint in
           * `src/api/client.ts`, the `UpdateMeRequest` type in
           * `src/api/types.ts` and the i18n keys `profile.locale*` in
           * `src/i18n/en-GB.ts` are deliberately preserved so reactivating
           * this card when we expand to other countries is a localised JSX
           * change. The screen-local `localeDraft` state, the
           * `updateProfile` mutation and their `canSave` / `saveMessage`
           * derivations were removed alongside the card because nothing
           * else on this screen consumed them — re-add them here when the
           * card returns.
           */}
        </>
      ) : null}

      <View style={styles.actions}>
        <Button
          disabled={!accessToken}
          label={t("profile.refresh")}
          onPress={() => meQuery.refetch()}
          variant="secondary"
        />
        <Button
          disabled={!accessToken}
          isLoading={isSigningOut}
          label={t("settings.signOut.button")}
          onPress={() => {
            void runSignOut();
          }}
          variant="secondary"
        />
      </View>
      {petSheet ? (
        <PetSheet
          // Re-key on mode/target so internal form state resets cleanly when
          // the parent switches between create and editing a different pet.
          key={
            petSheet.mode === "edit"
              ? `edit:${petSheet.pet.id}`
              : "create"
          }
          externalErrorMessage={
            petMutationsHaveError ? petMessage : null
          }
          initialPet={
            petSheet.mode === "edit" ? petSheet.pet : undefined
          }
          isSubmitting={isPetSheetSubmitting}
          mode={petSheet.mode}
          onClose={closePetSheet}
          onSubmit={handlePetSubmit}
          visible
        />
      ) : null}
      {addressSheet ? (
        <AddressSheet
        // switches modes — no useEffect-driven reset needed.
        key={
          addressSheet.mode === "edit"
            ? `edit:${addressSheet.address.id}`
            : "create"
        }
        defaultLocked={
          addressSheet.mode === "edit"
            ? addressSheet.address.isDefaultTutorAddress
            : false
        }
        externalErrorMessage={
          addressMutationsHaveError ? addressMessage : null
        }
        initialAddress={
          addressSheet.mode === "edit" ? addressSheet.address : undefined
        }
        isSubmitting={isAddressSheetSubmitting}
        mode={addressSheet.mode}
        onClose={closeAddressSheet}
        onSubmit={handleAddressSubmit}
        showDefaultControl={Boolean(tutorProfile)}
          visible
        />
      ) : null}
    </Screen>
  );
}

function ProfileRow({
  label,
  value,
  children,
}: {
  label: string;
  value?: string;
  // When provided, replaces the plain `<Text>` value with arbitrary JSX —
  // used for the role chips on the account card.
  children?: ReactNode;
}) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      {children ?? (
        <Text style={styles.value}>{value ?? t("common.notAvailable")}</Text>
      )}
    </View>
  );
}

function LegalLinkRow({
  icon,
  label,
  onPress,
}: {
  icon: ComponentProps<typeof Ionicons>["name"];
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      hitSlop={6}
      onPress={onPress}
      style={({ pressed }) => [
        styles.legalRow,
        pressed ? styles.legalRowPressed : null,
      ]}
    >
      <View style={styles.legalRowLeft}>
        <Ionicons color={colors.accent} name={icon} size={18} />
        <Text style={styles.legalRowLabel}>{label}</Text>
      </View>
      <Ionicons color={colors.muted} name="chevron-forward" size={18} />
    </Pressable>
  );
}

function getProviderRoleLabel(status: ProviderProfileStatus): string {
  if (status === "paused") return t("profile.hero.roleProviderPaused");
  if (status === "blocked") return t("profile.hero.roleProviderBlocked");
  return t("profile.hero.roleProvider");
}

function getProviderRoleTone(
  status: ProviderProfileStatus,
): "info" | "warning" | "danger" {
  if (status === "paused") return "warning";
  if (status === "blocked" || status === "deleted") return "danger";
  return "info";
}

function formatRoleLabel(role: Role): string {
  if (role === "tutor") return t("profile.hero.roleTutor");
  if (role === "provider") return t("profile.hero.roleProvider");
  // Admin is intentionally surfaced verbatim — there's no public-facing copy
  // for it and falling through to a generic label would be misleading.
  return role;
}

function getProfileActionLabel(
  hasProfile: boolean,
  hasChanges: boolean,
  kind: "provider" | "tutor",
): string {
  if (!hasProfile) {
    return kind === "provider"
      ? t("profile.createProviderProfile")
      : t("profile.createTutorProfile");
  }

  if (hasChanges) {
    return kind === "provider"
      ? t("profile.saveProviderProfile")
      : t("profile.saveTutorProfile");
  }

  return kind === "provider"
    ? t("profile.ensureProviderProfile")
    : t("profile.ensureTutorProfile");
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

function formatAddressError(error: unknown): string {
  const status =
    error instanceof ApiClientError
      ? error.status
      : typeof error === "object" && error && "status" in error
        ? (error as { status?: unknown }).status
        : null;

  if (status === 401) return t("profile.addressesAuthError");
  if (status === 404) return t("profile.addressesNotFoundError");
  if (status === 400) return t("profile.addressesValidationError");

  return t("profile.addressesActionError");
}

function formatSpecies(species: PetSpecies): string {
  return t(`profile.petSpecies.${species}`);
}

function formatAddressPrecision(precision: AddressLocationPrecision): string {
  return t(`profile.addressPrecision.${precision}`);
}

function formatAddressTitle(address: AddressResponse): string {
  return (
    address.label ||
    address.publicAreaLabel ||
    address.city ||
    address.postcode ||
    t("common.notAvailable")
  );
}

function formatAddressMeta(address: AddressResponse): string {
  const parts = [
    address.publicAreaLabel,
    address.city,
    address.postcode,
    formatAddressPrecision(address.locationPrecision),
  ].filter(Boolean);

  return parts.length > 0 ? parts.join(" - ") : t("common.notAvailable");
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

function formatTutorProfile(profile?: { displayName: string; id: string }) {
  return profile?.displayName || t("profile.notSet");
}

function formatProviderProfile(profile?: {
  displayName: string;
  id: string;
  ratingAverage: number | null;
  ratingCount: number;
  serviceRadiusKm: number;
  status: ProviderProfileStatus;
}) {
  if (!profile) {
    return t("profile.notSet");
  }

  return `${profile.displayName} - ${formatProviderStatus(profile.status)}`;
}

function formatProviderStatus(status: ProviderProfileStatus): string {
  if (status === "paused") return t("profile.providerStatus.paused");
  if (status === "active") return t("profile.providerStatus.active");
  if (status === "blocked") return t("profile.providerStatus.blocked");
  return t("profile.providerStatus.deleted");
}

const styles = StyleSheet.create({
  hero: {
    alignItems: "center",
    flexDirection: "column",
    gap: spacing[3],
    marginBottom: spacing[2],
    paddingVertical: spacing[2],
  },
  heroText: {
    alignItems: "center",
    gap: spacing[1],
    maxWidth: "100%",
  },
  heroName: {
    color: colors.text,
    fontSize: typography.display,
    fontWeight: "800",
    textAlign: "center",
  },
  heroEmail: {
    color: colors.muted,
    fontSize: typography.small,
    textAlign: "center",
  },
  // Wrapper around the existing `<Badge>` reused by the address default
  // marker; kept for layout-only margin so the new hero pill below is a
  // separate style with its own surface treatment.
  heroBadge: {
    marginTop: spacing[1],
  },
  heroChips: {
    alignItems: "center",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing[2],
    justifyContent: "center",
    marginTop: spacing[1],
  },
  chipRow: {
    flexDirection: "row",
    flexShrink: 1,
    flexWrap: "wrap",
    gap: spacing[2],
    justifyContent: "flex-end",
  },
  providerStats: {
    alignItems: "center",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing[2],
  },
  legalRow: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: spacing[2],
  },
  legalRowPressed: {
    opacity: 0.6,
  },
  legalRowLeft: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing[3],
  },
  legalRowLabel: {
    color: colors.text,
    fontSize: typography.body,
    fontWeight: "700",
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
  profileSection: {
    gap: spacing[3],
  },
  dividerLine: {
    backgroundColor: colors.border,
    height: 1,
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
  addressList: {
    gap: spacing[3],
  },
  addressItem: {
    borderColor: colors.border,
    borderTopWidth: 1,
    gap: spacing[3],
    paddingTop: spacing[3],
  },
  addressSummary: {
    gap: spacing[1],
  },
  addressName: {
    color: colors.text,
    fontSize: typography.body,
    fontWeight: "800",
  },
  addressMeta: {
    color: colors.muted,
    fontSize: typography.small,
    fontWeight: "700",
    lineHeight: 20,
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
  petBadges: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing[1],
  },
  petNotes: {
    color: colors.muted,
    fontSize: typography.small,
    fontStyle: "italic",
    lineHeight: 20,
    marginTop: spacing[1],
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
