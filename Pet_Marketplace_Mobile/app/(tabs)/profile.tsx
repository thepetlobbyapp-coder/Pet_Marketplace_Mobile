import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import { useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import {
  ApiClientError,
  createAddress,
  createPet,
  createTutorProfile,
  deletePet,
  getAddresses,
  getPets,
  getMe,
  updateAddress,
  updatePet,
  updateMe,
  updateTutorProfile,
} from "../../src/api/client";
import type {
  AddressLocationPrecision,
  AddressResponse,
  PetResponse,
  PetSpecies,
} from "../../src/api/types";
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
const ADDRESS_LABEL_LIMIT = 60;
const ADDRESS_CITY_LIMIT = 120;
const ADDRESS_POSTCODE_LIMIT = 16;
const ADDRESS_PUBLIC_AREA_LIMIT = 160;
const ADDRESS_PRECISION_OPTIONS: AddressLocationPrecision[] = [
  "approximate",
  "postcode",
];

interface AddressDraft {
  city: string;
  label: string;
  latitude: string;
  locationPrecision: AddressLocationPrecision;
  longitude: string;
  postcode: string;
  publicAreaLabel: string;
  setAsDefaultTutorAddress: boolean;
}

export default function ProfileScreen() {
  const { accessToken, session, signOut } = useAuth();
  const queryClient = useQueryClient();
  const meQueryKey = useMemo(
    () => ["me", session?.user.id],
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
  const [newAddressDraft, setNewAddressDraft] = useState<AddressDraft>(() =>
    createEmptyAddressDraft(),
  );
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [editingAddressDraft, setEditingAddressDraft] = useState<AddressDraft>(
    () => createEmptyAddressDraft(),
  );
  const [addressMessage, setAddressMessage] = useState<string | null>(null);
  const [isSigningOut, setIsSigningOut] = useState(false);

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

  const addressesQuery = useQuery({
    enabled: Boolean(accessToken && meQuery.data),
    queryKey: addressesQueryKey,
    queryFn: () => getAddresses(accessToken),
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

  const createAddressMutation = useMutation({
    mutationFn: () =>
      createAddress(accessToken, buildCreateAddressRequest(newAddressDraft)),
    onError: (error) => {
      setAddressMessage(formatAddressError(error));
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: addressesQueryKey });
      setNewAddressDraft(createEmptyAddressDraft());
      setAddressMessage(t("profile.addressesCreateSuccess"));
    },
  });

  const updateAddressMutation = useMutation({
    mutationFn: (address: AddressResponse) =>
      updateAddress(
        accessToken,
        address.id,
        buildUpdateAddressRequest(editingAddressDraft, address),
      ),
    onError: (error) => {
      setAddressMessage(formatAddressError(error));
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: addressesQueryKey });
      setEditingAddressId(null);
      setEditingAddressDraft(createEmptyAddressDraft());
      setAddressMessage(t("profile.addressesUpdateSuccess"));
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
  const editingAddress = addressesQuery.data?.find(
    (address) => address.id === editingAddressId,
  );
  const isNewPetNameValid =
    trimmedNewPetName.length > 0 && trimmedNewPetName.length <= PET_NAME_LIMIT;
  const isEditingPetNameValid =
    trimmedEditingPetName.length > 0 &&
    trimmedEditingPetName.length <= PET_NAME_LIMIT;
  const isNewAddressReadable = hasReadableAddress(newAddressDraft);
  const areNewAddressCoordinatesValid =
    hasValidAddressCoordinates(newAddressDraft);
  const isEditingAddressReadable = hasReadableAddress(editingAddressDraft);
  const hasEditingPetNameChanges =
    Boolean(editingPet) && trimmedEditingPetName !== editingPet?.name;
  const hasEditingAddressChanges =
    Boolean(editingAddress) &&
    hasAddressDraftChanges(editingAddressDraft, editingAddress);
  const shouldShowTutorDisplayNameError =
    tutorDisplayNameDraft !== null && !isTutorDisplayNameValid;
  const shouldShowNewPetNameError = newPetName.length > 0 && !isNewPetNameValid;
  const shouldShowEditingPetNameError =
    editingPetId !== null &&
    editingPetName.length > 0 &&
    !isEditingPetNameValid;
  const shouldShowNewAddressReadableError =
    hasAnyAddressDraftValue(newAddressDraft) && !isNewAddressReadable;
  const shouldShowNewAddressCoordinatesError =
    hasAnyCoordinateValue(newAddressDraft) && !areNewAddressCoordinatesValid;
  const shouldShowEditingAddressReadableError =
    editingAddressId !== null && !isEditingAddressReadable;
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
  const canCreateAddress =
    Boolean(accessToken) &&
    Boolean(meQuery.data) &&
    isNewAddressReadable &&
    areNewAddressCoordinatesValid &&
    !createAddressMutation.isPending;
  const canSavePetName =
    Boolean(accessToken) &&
    Boolean(meQuery.data) &&
    hasEditingPetNameChanges &&
    isEditingPetNameValid &&
    !updatePetMutation.isPending;
  const canSaveAddress =
    Boolean(accessToken) &&
    Boolean(meQuery.data) &&
    Boolean(editingAddress) &&
    hasEditingAddressChanges &&
    isEditingAddressReadable &&
    !updateAddressMutation.isPending;

  const heroName = tutorProfile?.displayName?.trim() || t("profile.title");
  const heroAvatarUrl = meQuery.data?.avatarUrl ?? null;

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
        <Avatar name={heroName} size={96} uri={heroAvatarUrl ?? undefined} />
        <View style={styles.heroText}>
          <Text numberOfLines={1} style={styles.heroName}>
            {heroName}
          </Text>
          <Text numberOfLines={1} style={styles.heroEmail}>
            {meQuery.data?.email ?? t("profile.body")}
          </Text>
          {meQuery.data ? (
            <View style={styles.heroStatusPill}>
              <Text style={styles.heroStatusPillText}>
                {meQuery.data.status}
              </Text>
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
              <ProfileRow
                label={t("profile.status")}
                value={meQuery.data.status}
              />
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
              <Text style={styles.help}>{t("profile.openSettingsHelp")}</Text>
              <View style={styles.actions}>
                <Button
                  label={t("profile.openSettings")}
                  onPress={() => router.push("/settings")}
                  variant="secondary"
                />
              </View>
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
              <Text style={styles.sectionTitle}>{t("profile.addresses")}</Text>
              <AddressDraftFields
                draft={newAddressDraft}
                onChange={(draft) => {
                  setNewAddressDraft(draft);
                  setAddressMessage(null);
                }}
                showCoordinateFields
                showDefaultControl={Boolean(tutorProfile)}
              />
              {shouldShowNewAddressReadableError ? (
                <Text style={styles.errorMessage}>
                  {t("profile.addressReadableInvalid")}
                </Text>
              ) : null}
              {shouldShowNewAddressCoordinatesError ? (
                <Text style={styles.errorMessage}>
                  {t("profile.addressCoordinatesInvalid")}
                </Text>
              ) : null}
              <Button
                disabled={!canCreateAddress}
                isLoading={createAddressMutation.isPending}
                label={t("profile.createAddress")}
                onPress={() => createAddressMutation.mutate()}
              />
              {addressMessage ? (
                <Text
                  style={[
                    styles.message,
                    createAddressMutation.isError ||
                    updateAddressMutation.isError
                      ? styles.errorMessage
                      : null,
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
                    const isEditing = editingAddressId === address.id;
                    const isUpdating =
                      updateAddressMutation.isPending &&
                      updateAddressMutation.variables?.id === address.id;

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
                        {isEditing ? (
                          <View style={styles.details}>
                            <AddressDraftFields
                              defaultLocked={address.isDefaultTutorAddress}
                              draft={editingAddressDraft}
                              onChange={(draft) => {
                                setEditingAddressDraft(draft);
                                setAddressMessage(null);
                              }}
                              showDefaultControl={Boolean(tutorProfile)}
                            />
                            {shouldShowEditingAddressReadableError ? (
                              <Text style={styles.errorMessage}>
                                {t("profile.addressReadableInvalid")}
                              </Text>
                            ) : null}
                            <View style={styles.actions}>
                              <Button
                                disabled={isUpdating}
                                label={t("common.cancel")}
                                onPress={() => {
                                  setEditingAddressId(null);
                                  setEditingAddressDraft(
                                    createEmptyAddressDraft(),
                                  );
                                  setAddressMessage(null);
                                }}
                                variant="secondary"
                              />
                              <Button
                                disabled={!canSaveAddress}
                                isLoading={isUpdating}
                                label={t("profile.saveAddress")}
                                onPress={() =>
                                  updateAddressMutation.mutate(address)
                                }
                              />
                            </View>
                          </View>
                        ) : (
                          <View style={styles.actions}>
                            <Button
                              disabled={updateAddressMutation.isPending}
                              label={t("profile.editAddress")}
                              onPress={() => {
                                setEditingAddressId(address.id);
                                setEditingAddressDraft(
                                  createAddressDraftFromAddress(address),
                                );
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
                <Text style={styles.body}>{t("profile.addressesEmpty")}</Text>
              )}
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
                <Text style={styles.errorMessage}>
                  {t("profile.petNameInvalid")}
                </Text>
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
              <Text style={styles.sectionTitle}>
                {t("profile.preferences")}
              </Text>
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

interface AddressDraftFieldsProps {
  defaultLocked?: boolean;
  draft: AddressDraft;
  onChange: (draft: AddressDraft) => void;
  showCoordinateFields?: boolean;
  showDefaultControl?: boolean;
}

function AddressDraftFields({
  defaultLocked = false,
  draft,
  onChange,
  showCoordinateFields = false,
  showDefaultControl = false,
}: AddressDraftFieldsProps) {
  const updateDraft = (patch: Partial<AddressDraft>) => {
    onChange({ ...draft, ...patch });
  };

  return (
    <View style={styles.details}>
      <TextField
        autoCapitalize="words"
        autoCorrect={false}
        label={t("profile.addressLabel")}
        maxLength={ADDRESS_LABEL_LIMIT}
        onChangeText={(label) => updateDraft({ label })}
        placeholder={t("profile.addressLabelPlaceholder")}
        value={draft.label}
      />
      <TextField
        autoCapitalize="words"
        autoCorrect={false}
        label={t("profile.addressCity")}
        maxLength={ADDRESS_CITY_LIMIT}
        onChangeText={(city) => updateDraft({ city })}
        placeholder={t("profile.addressCityPlaceholder")}
        value={draft.city}
      />
      <TextField
        autoCapitalize="characters"
        autoCorrect={false}
        label={t("profile.addressPostcode")}
        maxLength={ADDRESS_POSTCODE_LIMIT}
        onChangeText={(postcode) => updateDraft({ postcode })}
        placeholder={t("profile.addressPostcodePlaceholder")}
        value={draft.postcode}
      />
      <TextField
        autoCapitalize="words"
        autoCorrect={false}
        label={t("profile.addressPublicArea")}
        maxLength={ADDRESS_PUBLIC_AREA_LIMIT}
        onChangeText={(publicAreaLabel) => updateDraft({ publicAreaLabel })}
        placeholder={t("profile.addressPublicAreaPlaceholder")}
        value={draft.publicAreaLabel}
      />
      {showCoordinateFields ? (
        <>
          <View style={styles.coordinateRow}>
            <View style={styles.coordinateField}>
              <TextField
                autoCapitalize="none"
                autoCorrect={false}
                inputMode="decimal"
                keyboardType="decimal-pad"
                label={t("profile.addressLatitude")}
                onChangeText={(latitude) => updateDraft({ latitude })}
                placeholder="51.5074"
                value={draft.latitude}
              />
            </View>
            <View style={styles.coordinateField}>
              <TextField
                autoCapitalize="none"
                autoCorrect={false}
                inputMode="decimal"
                keyboardType="decimal-pad"
                label={t("profile.addressLongitude")}
                onChangeText={(longitude) => updateDraft({ longitude })}
                placeholder="-0.1278"
                value={draft.longitude}
              />
            </View>
          </View>
          <Text style={styles.help}>{t("profile.addressLocationHelp")}</Text>
        </>
      ) : null}
      <View style={styles.segmentGroup}>
        {ADDRESS_PRECISION_OPTIONS.map((precision) => (
          <Pressable
            accessibilityRole="button"
            key={precision}
            onPress={() => updateDraft({ locationPrecision: precision })}
            style={[
              styles.segment,
              draft.locationPrecision === precision
                ? styles.segmentSelected
                : null,
            ]}
          >
            <Text
              style={[
                styles.segmentLabel,
                draft.locationPrecision === precision
                  ? styles.segmentSelectedLabel
                  : null,
              ]}
            >
              {formatAddressPrecision(precision)}
            </Text>
          </Pressable>
        ))}
        {showDefaultControl ? (
          <Pressable
            accessibilityRole="button"
            disabled={defaultLocked}
            onPress={() =>
              updateDraft({
                setAsDefaultTutorAddress: !draft.setAsDefaultTutorAddress,
              })
            }
            style={[
              styles.segment,
              draft.setAsDefaultTutorAddress ? styles.segmentSelected : null,
              defaultLocked ? styles.segmentLocked : null,
            ]}
          >
            <Text
              style={[
                styles.segmentLabel,
                draft.setAsDefaultTutorAddress
                  ? styles.segmentSelectedLabel
                  : null,
              ]}
            >
              {defaultLocked
                ? t("profile.addressDefaultActive")
                : t("profile.addressSetDefault")}
            </Text>
          </Pressable>
        ) : null}
      </View>
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

function createEmptyAddressDraft(): AddressDraft {
  return {
    city: "",
    label: "",
    latitude: "",
    locationPrecision: "approximate",
    longitude: "",
    postcode: "",
    publicAreaLabel: "",
    setAsDefaultTutorAddress: false,
  };
}

function createAddressDraftFromAddress(address: AddressResponse): AddressDraft {
  return {
    city: address.city ?? "",
    label: address.label ?? "",
    latitude: "",
    locationPrecision: address.locationPrecision,
    longitude: "",
    postcode: address.postcode ?? "",
    publicAreaLabel: address.publicAreaLabel ?? "",
    setAsDefaultTutorAddress: address.isDefaultTutorAddress,
  };
}

function buildCreateAddressRequest(draft: AddressDraft) {
  return {
    city: toNullableText(draft.city),
    countryCode: "GB" as const,
    label: toNullableText(draft.label),
    latitude: Number(draft.latitude.trim()),
    locationPrecision: draft.locationPrecision,
    longitude: Number(draft.longitude.trim()),
    postcode: toNullableText(draft.postcode),
    publicAreaLabel: toNullableText(draft.publicAreaLabel),
    setAsDefaultTutorAddress: draft.setAsDefaultTutorAddress,
  };
}

function buildUpdateAddressRequest(
  draft: AddressDraft,
  address: AddressResponse,
) {
  const body: {
    city?: string | null;
    countryCode?: "GB";
    label?: string | null;
    locationPrecision?: AddressLocationPrecision;
    postcode?: string | null;
    publicAreaLabel?: string | null;
    setAsDefaultTutorAddress?: boolean;
  } = {};
  const label = toNullableText(draft.label);
  const city = toNullableText(draft.city);
  const postcode = toNullableText(draft.postcode);
  const publicAreaLabel = toNullableText(draft.publicAreaLabel);

  if (label !== address.label) body.label = label;
  if (city !== address.city) body.city = city;
  if (postcode !== address.postcode) body.postcode = postcode;
  if (publicAreaLabel !== address.publicAreaLabel) {
    body.publicAreaLabel = publicAreaLabel;
  }
  if (draft.locationPrecision !== address.locationPrecision) {
    body.locationPrecision = draft.locationPrecision;
  }
  if (draft.setAsDefaultTutorAddress && !address.isDefaultTutorAddress) {
    body.setAsDefaultTutorAddress = true;
  }

  return body;
}

function hasAddressDraftChanges(
  draft: AddressDraft,
  address?: AddressResponse,
): boolean {
  return address
    ? Object.keys(buildUpdateAddressRequest(draft, address)).length > 0
    : false;
}

function hasReadableAddress(draft: AddressDraft): boolean {
  return Boolean(
    draft.postcode.trim() || draft.city.trim() || draft.publicAreaLabel.trim(),
  );
}

function hasAnyAddressDraftValue(draft: AddressDraft): boolean {
  return Boolean(
    draft.label.trim() ||
    draft.postcode.trim() ||
    draft.city.trim() ||
    draft.publicAreaLabel.trim() ||
    draft.latitude.trim() ||
    draft.longitude.trim() ||
    draft.setAsDefaultTutorAddress,
  );
}

function hasAnyCoordinateValue(draft: AddressDraft): boolean {
  return Boolean(draft.latitude.trim() || draft.longitude.trim());
}

function hasValidAddressCoordinates(draft: AddressDraft): boolean {
  const latitude = Number(draft.latitude.trim());
  const longitude = Number(draft.longitude.trim());
  return (
    Number.isFinite(latitude) &&
    latitude >= 49 &&
    latitude <= 61 &&
    Number.isFinite(longitude) &&
    longitude >= -9 &&
    longitude <= 2
  );
}

function toNullableText(value: string): string | null {
  const trimmed = value.trim();
  return trimmed ? trimmed : null;
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
  heroStatusPill: {
    backgroundColor: colors.accentSoft,
    borderRadius: 999,
    marginTop: spacing[1],
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[1],
  },
  heroStatusPillText: {
    color: colors.accentPressed,
    fontSize: typography.caption,
    fontWeight: "700",
    letterSpacing: 0.4,
    textTransform: "uppercase",
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
  coordinateRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing[3],
  },
  coordinateField: {
    flex: 1,
    minWidth: 124,
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
  segmentLocked: {
    opacity: 0.72,
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
