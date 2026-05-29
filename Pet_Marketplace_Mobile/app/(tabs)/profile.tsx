import { Ionicons } from "@expo/vector-icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import { type ComponentProps, type ReactNode, useMemo, useState } from "react";
import { Pressable, StyleSheet, Switch, Text, View } from "react-native";
import {
  ApiClientError,
  createAddress,
  createPet,
  createProviderProfile,
  createTutorProfile,
  deleteAddress,
  deletePet,
  getAddresses,
  getOwnProviderAvailability,
  getPets,
  getMe,
  updateAddress,
  updateOwnProviderAvailability,
  updatePet,
  updateProviderProfile,
  updateTutorProfile,
} from "../../src/api/client";
import type {
  AddressLocationPrecision,
  AddressResponse,
  CreateAddressRequest,
  CreatePetRequest,
  MeResponse,
  PetResponse,
  PetSpecies,
  ProviderWeeklyAvailability,
  ProviderCategory,
  ProviderProfileStatus,
  Role,
  UpdateAddressRequest,
  UpdatePetRequest,
} from "../../src/api/types";
import {
  hasActiveProviderProfile,
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
import { TimeChip } from "../../src/components/TimeChip";
import { colors, spacing, typography } from "../../src/design/tokens";
import { t } from "../../src/i18n";

type AddressSheetState =
  | { mode: "create" }
  | { mode: "edit"; address: AddressResponse };

type PetSheetState = { mode: "create" } | { mode: "edit"; pet: PetResponse };
type CollapsibleSectionId =
  | "availability"
  | "pets"
  | "providerProfile"
  | "tutorProfile";

const PROVIDER_CATEGORY_OPTIONS: readonly ProviderCategory[] = [
  "walk",
  "sitting",
  "transport",
  "boarding",
];

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
  const providerAvailabilityQueryKey = useMemo(
    () => ["providerAvailability", session?.user.id],
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
  const [providerBioDraft, setProviderBioDraft] = useState<string | null>(null);
  const [providerCategoryDraft, setProviderCategoryDraft] =
    useState<ProviderCategory | null>(null);
  const [providerPriceDraft, setProviderPriceDraft] = useState<string | null>(
    null,
  );
  const [providerServiceDraft, setProviderServiceDraft] = useState<
    string | null
  >(null);
  const [providerActiveDraft, setProviderActiveDraft] = useState<
    boolean | null
  >(null);
  const [providerProfileMessage, setProviderProfileMessage] = useState<
    string | null
  >(null);
  const [providerAvailabilityDraft, setProviderAvailabilityDraft] =
    useState<ProviderWeeklyAvailability | null>(null);
  const [providerAvailabilityMessage, setProviderAvailabilityMessage] =
    useState<string | null>(null);
  const [petSheet, setPetSheet] = useState<PetSheetState | null>(null);
  const [pendingDeletePetId, setPendingDeletePetId] = useState<string | null>(
    null,
  );
  const [petMessage, setPetMessage] = useState<string | null>(null);
  const [addressSheet, setAddressSheet] = useState<AddressSheetState | null>(
    null,
  );
  const [pendingDeleteAddressId, setPendingDeleteAddressId] = useState<
    string | null
  >(null);
  const [addressMessage, setAddressMessage] = useState<string | null>(null);
  const [expandedSections, setExpandedSections] = useState<
    Record<CollapsibleSectionId, boolean>
  >({
    availability: false,
    pets: false,
    providerProfile: false,
    tutorProfile: false,
  });
  const [isSigningOut, setIsSigningOut] = useState(false);

  const meQuery = useQuery({
    enabled: Boolean(accessToken),
    queryKey: meQueryKey,
    queryFn: () => getMe(accessToken),
    retry: 1,
  });
  const canUseTutorTools = hasTutorProfile(meQuery.data);
  const hasProviderTools = hasProviderProfile(meQuery.data);
  const canUseProviderTools = hasActiveProviderProfile(meQuery.data);

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

  const providerAvailabilityQuery = useQuery({
    enabled: Boolean(accessToken && canUseProviderTools),
    queryKey: providerAvailabilityQueryKey,
    queryFn: () => getOwnProviderAvailability(accessToken),
    retry: 1,
  });

  const tutorProfile = meQuery.data?.profiles?.tutor;
  const tutorDisplayName =
    tutorDisplayNameDraft ?? tutorProfile?.displayName ?? "";
  const providerProfile = meQuery.data?.profiles?.provider;
  const providerDisplayName =
    providerDisplayNameDraft ?? providerProfile?.displayName ?? "";
  const providerBio = providerBioDraft ?? providerProfile?.bio ?? "";
  const providerCategory =
    providerCategoryDraft ?? providerProfile?.categoryId ?? "walk";
  const providerPrice =
    providerPriceDraft ??
    (providerProfile?.pricePerHour !== null &&
    providerProfile?.pricePerHour !== undefined
      ? String(providerProfile.pricePerHour)
      : "");
  const providerService =
    providerServiceDraft ?? providerProfile?.service ?? "";
  const providerProfileIsActive = providerProfile?.status === "active";
  const providerActive = providerActiveDraft ?? providerProfileIsActive;
  const canEditProviderAvailability = canUseProviderTools && providerActive;
  const providerAvailability =
    providerAvailabilityDraft ??
    providerAvailabilityQuery.data ??
    buildEmptyWeeklyAvailability();
  const hasProviderAvailabilityChanges =
    providerAvailabilityDraft !== null &&
    availabilitySignature(providerAvailabilityDraft) !==
      availabilitySignature(
        providerAvailabilityQuery.data ?? buildEmptyWeeklyAvailability(),
      );

  const upsertTutorProfile = useMutation({
    mutationFn: () => {
      const saveTutorProfile = tutorProfile
        ? updateTutorProfile
        : createTutorProfile;

      return saveTutorProfile(accessToken, {
        displayName: tutorDisplayName.trim(),
      });
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

  const upsertProviderProfile = useMutation({
    mutationFn: () => {
      const saveProviderProfile = providerProfile
        ? updateProviderProfile
        : createProviderProfile;
      const body = {
        bio: providerBio.trim() || null,
        categoryId: providerCategory,
        displayName: providerDisplayName.trim(),
        isAvailable: providerActive,
        pricePerHour: Number(providerPrice.trim()),
        publish: providerActive,
        service: providerService.trim(),
        serviceRadiusKm: providerProfile?.serviceRadiusKm ?? 5,
      };

      if (!providerActive) {
        return saveProviderProfile(accessToken, {
          bio: body.bio,
          displayName: body.displayName,
          publish: false,
          serviceRadiusKm: body.serviceRadiusKm,
        });
      }

      return saveProviderProfile(accessToken, body);
    },
    onError: () => {
      setProviderProfileMessage(t("profile.providerProfileSaveError"));
    },
    onSuccess: async (profile) => {
      await queryClient.invalidateQueries({ queryKey: meQueryKey });
      setProviderDisplayNameDraft(null);
      setProviderBioDraft(null);
      setProviderCategoryDraft(null);
      setProviderPriceDraft(null);
      setProviderServiceDraft(null);
      setProviderActiveDraft(null);
      setProviderProfileMessage(
        profile.status === "paused"
          ? t("profile.providerProfilePausedSuccess")
          : t("profile.providerProfileSaveSuccess"),
      );
    },
  });

  const saveProviderAvailability = useMutation({
    mutationFn: () =>
      updateOwnProviderAvailability(accessToken, providerAvailability),
    onError: () => {
      setProviderAvailabilityMessage(t("profile.availabilitySaveError"));
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: providerAvailabilityQueryKey,
      });
      setProviderAvailabilityDraft(null);
      setProviderAvailabilityMessage(t("profile.availabilitySaveSuccess"));
    },
  });

  const createAddressMutation = useMutation({
    mutationFn: (body: CreateAddressRequest) =>
      createAddress(accessToken, body),
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

  const deleteAddressMutation = useMutation({
    mutationFn: (address: AddressResponse) =>
      deleteAddress(accessToken, address.id),
    onError: (error) => {
      setAddressMessage(formatAddressError(error));
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: addressesQueryKey }),
        queryClient.invalidateQueries({ queryKey: meQueryKey }),
      ]);
      setPendingDeleteAddressId(null);
      setAddressMessage(t("profile.addressesDeleteSuccess"));
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
  const trimmedProviderBio = providerBio.trim();
  const trimmedProviderService = providerService.trim();
  const trimmedProviderPrice = providerPrice.trim();
  const providerPriceNumber = Number(trimmedProviderPrice);
  const savedProviderDisplayName = providerProfile?.displayName ?? "";
  const savedProviderBio = providerProfile?.bio ?? "";
  const savedProviderCategory = providerProfile?.categoryId ?? "walk";
  const savedProviderPrice =
    providerProfile?.pricePerHour !== null &&
    providerProfile?.pricePerHour !== undefined
      ? String(providerProfile.pricePerHour)
      : "";
  const savedProviderService = providerProfile?.service ?? "";
  const hasProviderActiveChanges = providerActive !== providerProfileIsActive;
  const hasProviderProfileChanges =
    trimmedProviderDisplayName !== savedProviderDisplayName ||
    trimmedProviderBio !== savedProviderBio ||
    providerCategory !== savedProviderCategory ||
    trimmedProviderPrice !== savedProviderPrice ||
    trimmedProviderService !== savedProviderService ||
    hasProviderActiveChanges;
  const isProviderDisplayNameValid =
    trimmedProviderDisplayName.length > 0 &&
    trimmedProviderDisplayName.length <= 80;
  const isProviderListingValid =
    !providerActive ||
    (trimmedProviderService.length > 0 &&
      trimmedProviderService.length <= 160 &&
      trimmedProviderPrice.length > 0 &&
      Number.isFinite(providerPriceNumber) &&
      providerPriceNumber >= 0);
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
    isProviderListingValid &&
    !upsertProviderProfile.isPending;
  const isAddressSheetSubmitting =
    createAddressMutation.isPending || updateAddressMutation.isPending;
  const addressMutationsHaveError =
    createAddressMutation.isError ||
    updateAddressMutation.isError ||
    deleteAddressMutation.isError;
  const isAddressActionPending =
    isAddressSheetSubmitting || deleteAddressMutation.isPending;
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
    setPendingDeleteAddressId(null);
    setAddressSheet({ mode: "create" });
  }

  function openEditAddressSheet(address: AddressResponse) {
    setAddressMessage(null);
    setPendingDeleteAddressId(null);
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
    if (submission.species !== original.species)
      body.species = submission.species;
    if (submission.size !== original.size) body.size = submission.size;
    if (submission.breed !== (original.breed ?? null))
      body.breed = submission.breed;
    if (submission.ageRange !== (original.ageRange ?? null)) {
      body.ageRange = submission.ageRange;
    }
    if (submission.notes !== (original.notes ?? null))
      body.notes = submission.notes;

    if (Object.keys(body).length === 0) {
      setPetSheet(null);
      return;
    }
    updatePetMutation.mutate({ id: original.id, body });
  }

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

  function toggleSection(section: CollapsibleSectionId) {
    setExpandedSections((current) => ({
      ...current,
      [section]: !current[section],
    }));
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
                <Badge label={t("profile.hero.noRoles")} tone="neutral" />
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
          {!canUseTutorTools && !hasProviderTools ? (
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

          <CollapsibleCard
            expanded={expandedSections.tutorProfile}
            icon="id-card"
            onToggle={() => toggleSection("tutorProfile")}
            summary={formatTutorProfile(tutorProfile)}
            title={t("profile.section.profiles")}
          >
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
                  label={getProfileActionLabel(
                    Boolean(tutorProfile),
                    hasTutorProfileChanges,
                    "tutor",
                  )}
                  onPress={() => upsertTutorProfile.mutate()}
                />
              </View>
            </View>
          </CollapsibleCard>

          <CollapsibleCard
            expanded={expandedSections.providerProfile}
            icon="briefcase"
            onToggle={() => toggleSection("providerProfile")}
            summary={formatProviderProfile(providerProfile)}
            title={t("profile.section.providerProfile")}
          >
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
              <View style={styles.switchRow}>
                <View style={styles.switchCopy}>
                  <Text style={styles.switchTitle}>
                    {t("profile.providerActive.label")}
                  </Text>
                  <Text style={styles.help}>
                    {t("profile.providerActive.help")}
                  </Text>
                </View>
                <Switch
                  disabled={upsertProviderProfile.isPending}
                  onValueChange={(value) => {
                    setProviderActiveDraft(value);
                    setProviderProfileMessage(null);
                  }}
                  value={providerActive}
                />
              </View>
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
              <TextField
                autoCapitalize="sentences"
                autoCorrect
                label={t("profile.providerService")}
                maxLength={160}
                onChangeText={(value) => {
                  setProviderServiceDraft(value);
                  setProviderProfileMessage(null);
                }}
                placeholder={t("profile.providerServicePlaceholder")}
                value={providerService}
              />
              <View style={styles.segmentGroup}>
                {PROVIDER_CATEGORY_OPTIONS.map((category) => {
                  const selected = providerCategory === category;
                  return (
                    <Pressable
                      accessibilityRole="button"
                      key={category}
                      onPress={() => {
                        setProviderCategoryDraft(category);
                        setProviderProfileMessage(null);
                      }}
                      style={[
                        styles.segment,
                        selected ? styles.segmentSelected : null,
                      ]}
                    >
                      <Text
                        style={[
                          styles.segmentLabel,
                          selected ? styles.segmentSelectedLabel : null,
                        ]}
                      >
                        {formatProviderCategory(category)}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
              <TextField
                keyboardType="decimal-pad"
                label={t("profile.providerPricePerHour")}
                maxLength={8}
                onChangeText={(value) => {
                  setProviderPriceDraft(value.replace(",", "."));
                  setProviderProfileMessage(null);
                }}
                placeholder="18"
                value={providerPrice}
              />
              <TextField
                autoCapitalize="sentences"
                autoCorrect
                label={t("profile.providerBio")}
                maxLength={600}
                multiline
                onChangeText={(value) => {
                  setProviderBioDraft(value);
                  setProviderProfileMessage(null);
                }}
                placeholder={t("profile.providerBioPlaceholder")}
                value={providerBio}
              />
              {shouldShowProviderDisplayNameError ? (
                <Text style={styles.errorMessage}>
                  {t("profile.providerDisplayNameInvalid")}
                </Text>
              ) : null}
              {!isProviderListingValid ? (
                <Text style={styles.errorMessage}>
                  {t("profile.providerPublishInvalid")}
                </Text>
              ) : null}
              {hasProviderProfileChanges ? (
                <Text style={styles.notice}>{t("profile.unsavedChanges")}</Text>
              ) : null}
              {providerProfileMessage ? (
                <Text
                  style={[
                    styles.message,
                    upsertProviderProfile.isError ? styles.errorMessage : null,
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
                    setProviderBioDraft(null);
                    setProviderCategoryDraft(null);
                    setProviderPriceDraft(null);
                    setProviderServiceDraft(null);
                    setProviderActiveDraft(null);
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
          </CollapsibleCard>

          <CollapsibleCard
            disabled={!canEditProviderAvailability}
            expanded={expandedSections.availability}
            icon="calendar"
            onToggle={() => toggleSection("availability")}
            summary={
              canEditProviderAvailability
                ? t("profile.availability.summary")
                : t("profile.availability.inactive")
            }
            title={t("profile.availability.title")}
          >
            <View style={styles.availabilityBlock}>
              <Text style={styles.help}>{t("profile.availability.help")}</Text>
              {!canEditProviderAvailability ? (
                <Text style={styles.notice}>
                  {t("profile.availability.inactive")}
                </Text>
              ) : providerAvailabilityQuery.isLoading ? (
                <LoadingState label={t("profile.availability.loading")} />
              ) : providerAvailabilityQuery.isError ? (
                <ErrorState
                  actionLabel={t("common.retry")}
                  message={t("profile.availability.error")}
                  onRetry={() => providerAvailabilityQuery.refetch()}
                  title={t("common.error")}
                />
              ) : (
                <>
                  <WeeklyAvailabilityEditor
                    availability={providerAvailability}
                    disabled={saveProviderAvailability.isPending}
                    onToggle={(weekday, timeSlotId) => {
                      setProviderAvailabilityDraft((current) =>
                        toggleAvailabilitySlot(
                          current ??
                            providerAvailabilityQuery.data ??
                            buildEmptyWeeklyAvailability(),
                          weekday,
                          timeSlotId,
                        ),
                      );
                      setProviderAvailabilityMessage(null);
                    }}
                  />
                  {providerAvailabilityMessage ? (
                    <Text
                      style={[
                        styles.message,
                        saveProviderAvailability.isError
                          ? styles.errorMessage
                          : null,
                      ]}
                    >
                      {providerAvailabilityMessage}
                    </Text>
                  ) : null}
                  <View style={styles.actions}>
                    <Button
                      disabled={
                        !hasProviderAvailabilityChanges ||
                        saveProviderAvailability.isPending
                      }
                      label={t("common.cancel")}
                      onPress={() => {
                        setProviderAvailabilityDraft(null);
                        setProviderAvailabilityMessage(null);
                      }}
                      variant="secondary"
                    />
                    <Button
                      disabled={
                        !hasProviderAvailabilityChanges ||
                        saveProviderAvailability.isPending
                      }
                      isLoading={saveProviderAvailability.isPending}
                      label={t("profile.availability.save")}
                      onPress={() => saveProviderAvailability.mutate()}
                    />
                  </View>
                </>
              )}
            </View>
          </CollapsibleCard>

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
                      {addressesQuery.data.map((address) => {
                        const isConfirmingDelete =
                          pendingDeleteAddressId === address.id;
                        const isDeleting =
                          deleteAddressMutation.isPending &&
                          deleteAddressMutation.variables?.id === address.id;

                        return (
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
                            {isConfirmingDelete ? (
                              <View style={styles.deleteConfirm}>
                                <Text style={styles.deleteConfirmText}>
                                  {t("profile.deleteAddressConfirm")}
                                </Text>
                                <View style={styles.actions}>
                                  <Button
                                    disabled={isDeleting}
                                    label={t("common.cancel")}
                                    onPress={() => {
                                      setPendingDeleteAddressId(null);
                                      setAddressMessage(null);
                                    }}
                                    variant="secondary"
                                  />
                                  <Button
                                    disabled={deleteAddressMutation.isPending}
                                    isLoading={isDeleting}
                                    label={t("profile.deleteAddress")}
                                    onPress={() => {
                                      setAddressMessage(null);
                                      deleteAddressMutation.mutate(address);
                                    }}
                                  />
                                </View>
                              </View>
                            ) : (
                              <View style={styles.actions}>
                                <Button
                                  disabled={isAddressActionPending}
                                  label={t("profile.editAddress")}
                                  onPress={() => openEditAddressSheet(address)}
                                  variant="secondary"
                                />
                                <Button
                                  disabled={deleteAddressMutation.isPending}
                                  label={t("profile.deleteAddress")}
                                  onPress={() => {
                                    setPendingDeleteAddressId(address.id);
                                    setAddressMessage(null);
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
                    <Text style={styles.body}>
                      {t("profile.addressesEmpty")}
                    </Text>
                  )}
                  <Button
                    disabled={isAddressActionPending}
                    label={t("profile.createAddress")}
                    onPress={openCreateAddressSheet}
                  />
                </>
              )}
            </View>
          </Card>

          <CollapsibleCard
            expanded={expandedSections.pets}
            icon="paw"
            onToggle={() => toggleSection("pets")}
            summary={formatPetsSummary(petsQuery.data)}
            title={t("profile.section.pets")}
          >
            <View style={styles.details}>
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
                        const isConfirmingDelete =
                          pendingDeletePetId === pet.id;
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
                                <Text numberOfLines={2} style={styles.petNotes}>
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
          </CollapsibleCard>

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
          key={petSheet.mode === "edit" ? `edit:${petSheet.pet.id}` : "create"}
          externalErrorMessage={petMutationsHaveError ? petMessage : null}
          initialPet={petSheet.mode === "edit" ? petSheet.pet : undefined}
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

function CollapsibleCard({
  children,
  disabled = false,
  expanded,
  icon,
  onToggle,
  summary,
  title,
}: {
  children: ReactNode;
  disabled?: boolean;
  expanded: boolean;
  icon: ComponentProps<typeof Ionicons>["name"];
  onToggle: () => void;
  summary?: string;
  title: string;
}) {
  return (
    <Card>
      <View style={styles.details}>
        <Pressable
          accessibilityRole="button"
          accessibilityState={{ disabled, expanded }}
          disabled={disabled}
          onPress={onToggle}
          style={({ pressed }) => [
            styles.collapsibleHeader,
            pressed && !disabled ? styles.legalRowPressed : null,
            disabled ? styles.disabledHeader : null,
          ]}
        >
          <View style={styles.collapsibleTitleGroup}>
            <Ionicons color={colors.accent} name={icon} size={20} />
            <View style={styles.collapsibleTitleText}>
              <Text style={styles.title}>{title}</Text>
              {summary ? (
                <Text numberOfLines={1} style={styles.collapsibleSummary}>
                  {summary}
                </Text>
              ) : null}
            </View>
          </View>
          <Ionicons
            color={colors.muted}
            name={expanded ? "chevron-up" : "chevron-down"}
            size={20}
          />
        </Pressable>
        {expanded && !disabled ? children : null}
      </View>
    </Card>
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

const WEEKDAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const WEEKLY_TIME_SLOTS = [
  "08:00",
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
  "19:00",
] as const;

function WeeklyAvailabilityEditor({
  availability,
  disabled,
  onToggle,
}: {
  availability: ProviderWeeklyAvailability;
  disabled: boolean;
  onToggle: (weekday: number, timeSlotId: string) => void;
}) {
  return (
    <View style={styles.availabilityDays}>
      {normaliseWeeklyAvailability(availability).days.map((day) => (
        <View key={day.weekday} style={styles.availabilityDay}>
          <Text style={styles.availabilityDayLabel}>
            {WEEKDAY_LABELS[day.weekday]}
          </Text>
          <View style={styles.availabilitySlots}>
            {WEEKLY_TIME_SLOTS.map((slot) => (
              <TimeChip
                disabled={disabled}
                key={`${day.weekday}:${slot}`}
                label={slot}
                onPress={() => onToggle(day.weekday, slot)}
                selected={day.timeSlotIds.includes(slot)}
              />
            ))}
          </View>
        </View>
      ))}
    </View>
  );
}

function buildEmptyWeeklyAvailability(): ProviderWeeklyAvailability {
  return {
    days: WEEKDAY_LABELS.map((_, weekday) => ({ timeSlotIds: [], weekday })),
  };
}

function normaliseWeeklyAvailability(
  availability: ProviderWeeklyAvailability,
): ProviderWeeklyAvailability {
  const byWeekday = new Map<number, string[]>();
  for (let weekday = 0; weekday <= 6; weekday += 1) {
    byWeekday.set(weekday, []);
  }
  for (const day of availability.days) {
    byWeekday.set(day.weekday, [...day.timeSlotIds].sort());
  }
  return {
    days: [...byWeekday.entries()].map(([weekday, timeSlotIds]) => ({
      timeSlotIds,
      weekday,
    })),
  };
}

function toggleAvailabilitySlot(
  availability: ProviderWeeklyAvailability,
  weekday: number,
  timeSlotId: string,
): ProviderWeeklyAvailability {
  const next = normaliseWeeklyAvailability(availability);
  return {
    days: next.days.map((day) => {
      if (day.weekday !== weekday) return day;
      const selected = day.timeSlotIds.includes(timeSlotId);
      const timeSlotIds = selected
        ? day.timeSlotIds.filter((slot) => slot !== timeSlotId)
        : [...day.timeSlotIds, timeSlotId].sort();
      return { ...day, timeSlotIds };
    }),
  };
}

function availabilitySignature(
  availability: ProviderWeeklyAvailability,
): string {
  return JSON.stringify(normaliseWeeklyAvailability(availability));
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
  if (status === 409) return t("profile.addressesConflictError");
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
  pricePerHour: number | null;
  ratingAverage: number | null;
  ratingCount: number;
  service: string | null;
  serviceRadiusKm: number;
  status: ProviderProfileStatus;
}) {
  if (!profile) {
    return t("profile.notSet");
  }

  const service = profile.service ? ` - ${profile.service}` : "";
  const price =
    profile.pricePerHour !== null ? ` - GBP ${profile.pricePerHour}/h` : "";
  return `${profile.displayName}${service}${price} - ${formatProviderStatus(
    profile.status,
  )}`;
}

function formatProviderStatus(status: ProviderProfileStatus): string {
  if (status === "paused") return t("profile.providerStatus.paused");
  if (status === "active") return t("profile.providerStatus.active");
  if (status === "blocked") return t("profile.providerStatus.blocked");
  return t("profile.providerStatus.deleted");
}

function formatPetsSummary(pets?: PetResponse[]): string {
  if (!pets) return t("profile.petsSummary.loading");
  if (pets.length === 0) return t("profile.petsSummary.empty");
  if (pets.length === 1) return t("profile.petsSummary.one");
  return t("profile.petsSummary.many").replace("{count}", String(pets.length));
}

function formatProviderCategory(category: ProviderCategory): string {
  if (category === "walk") return t("search.categories.walk");
  if (category === "sitting") return t("search.categories.sitting");
  if (category === "transport") return t("search.categories.transport");
  return t("search.categories.boarding");
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
  switchRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing[3],
    justifyContent: "space-between",
  },
  switchCopy: {
    flex: 1,
    gap: spacing[1],
  },
  switchTitle: {
    color: colors.text,
    fontSize: typography.body,
    fontWeight: "800",
  },
  collapsibleHeader: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing[3],
    justifyContent: "space-between",
  },
  collapsibleTitleGroup: {
    alignItems: "center",
    flex: 1,
    flexDirection: "row",
    gap: spacing[2],
  },
  collapsibleTitleText: {
    flex: 1,
    gap: spacing[1],
  },
  collapsibleSummary: {
    color: colors.muted,
    fontSize: typography.small,
    fontWeight: "600",
  },
  disabledHeader: {
    opacity: 0.58,
  },
  availabilityBlock: {
    gap: spacing[3],
    marginTop: spacing[2],
  },
  availabilityDays: {
    gap: spacing[3],
  },
  availabilityDay: {
    gap: spacing[2],
  },
  availabilityDayLabel: {
    color: colors.text,
    fontSize: typography.small,
    fontWeight: "800",
  },
  availabilitySlots: {
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
