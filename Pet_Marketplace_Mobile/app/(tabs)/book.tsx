import { Ionicons } from "@expo/vector-icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { router, useLocalSearchParams } from "expo-router";
import { useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import {
  ApiClientError,
  createBooking,
  getBookings,
  getPets,
  getProvider,
  getProviderAvailability,
  updateBooking,
} from "../../src/api/client";
import type {
  BookingResponse,
  PetResponse,
  ProviderResponse,
} from "../../src/api/types";
import {
  hasProviderProfile,
  hasTutorProfile,
  useMeQuery,
} from "../../src/api/useMeQuery";
import { useAuth } from "../../src/auth/AuthProvider";
import { Avatar } from "../../src/components/Avatar";
import { Button } from "../../src/components/Button";
import { buildUpcomingDates, DateStrip } from "../../src/components/DateStrip";
import { EmptyState } from "../../src/components/EmptyState";
import { ErrorState } from "../../src/components/ErrorState";
import { LoadingState } from "../../src/components/LoadingState";
import { TutorProfileRequiredState } from "../../src/components/ProfileRequiredState";
import { RatingStars } from "../../src/components/RatingStars";
import { Screen } from "../../src/components/Screen";
import { SectionHeader } from "../../src/components/SectionHeader";
import { TimeChip } from "../../src/components/TimeChip";
import { demoProviders, demoTimeSlots } from "../../src/data/demoFixtures";
import {
  colors,
  radius,
  shadow,
  spacing,
  typography,
} from "../../src/design/tokens";
import { t } from "../../src/i18n";
import { env } from "../../src/lib/env";
import { formatPriceBRL, formatPriceGBP } from "../../src/lib/format";

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export default function BookScreen() {
  const { providerId } = useLocalSearchParams<{ providerId?: string }>();
  const routeProviderId = typeof providerId === "string" ? providerId : "";

  if (UUID_PATTERN.test(routeProviderId)) {
    return <RealBookScreen providerId={routeProviderId} />;
  }

  if (!routeProviderId) {
    return <RealBookingsListScreen />;
  }

  if (!env.isDemoFixturesEnabled) {
    return <UnsupportedDemoBookingRoute />;
  }

  return <DemoBookScreen providerId={routeProviderId} />;
}

function UnsupportedDemoBookingRoute() {
  return (
    <Screen>
      <EmptyState
        actionLabel={t("book.findProvider")}
        message={t("book.error.provider.body")}
        onAction={() => router.push("/search")}
        title={t("book.error.provider.title")}
      />
    </Screen>
  );
}

function RealBookingsListScreen() {
  const { accessToken, session } = useAuth();
  const meQuery = useMeQuery();
  const userId = session?.user.id;
  const canUseBookings =
    hasTutorProfile(meQuery.data) || hasProviderProfile(meQuery.data);
  const viewerIsProvider = hasProviderProfile(meQuery.data);
  const bookingsQuery = useQuery({
    enabled: Boolean(accessToken && canUseBookings),
    queryKey: ["bookings", userId],
    queryFn: () => getBookings(accessToken),
    refetchInterval: 5000,
    retry: 1,
  });

  if (!accessToken) {
    return (
      <Screen>
        <EmptyState
          actionLabel={t("common.signIn")}
          message={t("book.authenticatedList.body")}
          onAction={() => router.push("/login")}
          title={t("book.authenticatedList.title")}
        />
      </Screen>
    );
  }

  if (bookingsQuery.isLoading) {
    return (
      <Screen>
        <LoadingState label={t("book.list.loading")} />
      </Screen>
    );
  }

  if (meQuery.isLoading) {
    return (
      <Screen>
        <LoadingState label={t("profile.loading")} />
      </Screen>
    );
  }

  if (meQuery.isError) {
    return (
      <Screen>
        <ErrorState
          actionLabel={t("common.retry")}
          message={t("profile.error")}
          onRetry={() => meQuery.refetch()}
          title={t("common.error")}
        />
      </Screen>
    );
  }

  if (!canUseBookings) {
    return (
      <Screen>
        <TutorProfileRequiredState message={t("book.profileRequired.body")} />
      </Screen>
    );
  }

  if (bookingsQuery.isError) {
    return (
      <Screen>
        <ErrorState
          actionLabel={t("common.retry")}
          message={t("book.listUnavailable.body")}
          onRetry={() => bookingsQuery.refetch()}
          title={t("book.listUnavailable.title")}
        />
      </Screen>
    );
  }

  const bookings = bookingsQuery.data ?? [];

  return (
    <Screen variant="top">
      <View style={styles.listHeader}>
        <View style={styles.listTitleBlock}>
          <Text style={styles.title}>{t("book.list.title")}</Text>
          <Text style={styles.listSubtitle}>{t("book.list.subtitle")}</Text>
        </View>
        <Button
          label={t("book.findProvider")}
          onPress={() => router.push("/home")}
          variant="secondary"
        />
      </View>

      {bookings.length === 0 ? (
        <EmptyState
          actionLabel={t("book.empty.action")}
          message={t("book.empty.body")}
          onAction={() => router.push("/home")}
          title={t("book.empty.title")}
        />
      ) : (
        <View style={styles.bookingList}>
          {bookings.map((booking) => (
            <BookingListCard
              booking={booking}
              key={booking.id}
              viewerIsProvider={viewerIsProvider}
            />
          ))}
        </View>
      )}
    </Screen>
  );
}

function RealBookScreen({ providerId }: { providerId: string }) {
  const { accessToken, session } = useAuth();
  const meQuery = useMeQuery();
  const dates = useMemo(() => buildUpcomingDates(10), []);
  const [selectedDate, setSelectedDate] = useState(dates[0]!.id);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedPetId, setSelectedPetId] = useState<string | null>(null);
  const [confirmedBooking, setConfirmedBooking] =
    useState<BookingResponse | null>(null);

  const userId = session?.user.id;
  const canUseMarketplace = hasTutorProfile(meQuery.data);
  const providerQuery = useQuery({
    enabled: Boolean(accessToken && canUseMarketplace),
    queryKey: ["provider", userId, providerId],
    queryFn: () => getProvider(accessToken, providerId),
    retry: 1,
  });
  const petsQuery = useQuery({
    enabled: Boolean(accessToken && canUseMarketplace),
    queryKey: ["pets", userId],
    queryFn: () => getPets(accessToken),
    retry: 1,
  });
  const availabilityQuery = useQuery({
    enabled: Boolean(accessToken && canUseMarketplace),
    queryKey: ["providerAvailability", userId, providerId, selectedDate],
    queryFn: () =>
      getProviderAvailability(accessToken, providerId, selectedDate),
    retry: 1,
  });

  const pets = petsQuery.data ?? [];
  const selectedPet =
    pets.find((pet) => pet.id === selectedPetId) ?? pets[0] ?? null;
  const dateLabel = useDateLabel(dates, selectedDate);
  const selectedSlot = availabilityQuery.data?.find(
    (slot) => slot.id === selectedTime,
  );
  const selectedTimeForBooking = selectedSlot?.isAvailable
    ? selectedTime
    : null;
  const timeLabel = selectedSlot?.label ?? selectedTime;

  const bookingMutation = useMutation({
    mutationFn: () => {
      if (!selectedTimeForBooking || !selectedPet || !providerQuery.data) {
        throw new Error("BOOKING_INPUT_MISSING");
      }
      if (!providerQuery.data.isAvailable) {
        throw new Error("PROVIDER_UNAVAILABLE");
      }

      return createBooking(accessToken, {
        date: selectedDate,
        petId: selectedPet.id,
        providerId,
        service: providerQuery.data.service,
        timeSlotId: selectedTimeForBooking,
      });
    },
    onSuccess: (booking) => {
      setConfirmedBooking(booking);
    },
  });

  if (!accessToken) {
    return (
      <Screen>
        <EmptyState
          actionLabel={t("common.signIn")}
          message={t("book.authenticatedBooking.body")}
          onAction={() => router.push("/login")}
          title={t("book.authenticatedBooking.title")}
        />
      </Screen>
    );
  }

  if (providerQuery.isLoading || petsQuery.isLoading) {
    return (
      <Screen>
        <LoadingState label={t("book.loading")} />
      </Screen>
    );
  }

  if (meQuery.isLoading) {
    return (
      <Screen>
        <LoadingState label={t("profile.loading")} />
      </Screen>
    );
  }

  if (meQuery.isError) {
    return (
      <Screen>
        <ErrorState
          actionLabel={t("common.retry")}
          message={t("profile.error")}
          onRetry={() => meQuery.refetch()}
          title={t("common.error")}
        />
      </Screen>
    );
  }

  if (!canUseMarketplace) {
    return (
      <Screen>
        <TutorProfileRequiredState message={t("book.profileRequired.body")} />
      </Screen>
    );
  }

  if (providerQuery.isError || !providerQuery.data) {
    return (
      <Screen>
        <ErrorState
          actionLabel={t("common.retry")}
          message={t("book.error.provider.body")}
          onRetry={() => providerQuery.refetch()}
          title={t("book.error.provider.title")}
        />
      </Screen>
    );
  }

  if (petsQuery.isError) {
    return (
      <Screen>
        <ErrorState
          actionLabel={t("common.retry")}
          message="The app could not load your pets right now."
          onRetry={() => petsQuery.refetch()}
          title="Pets unavailable"
        />
      </Screen>
    );
  }

  if (!selectedPet) {
    return (
      <Screen>
        <EmptyState
          actionLabel={t("book.noPet.action")}
          message={t("book.noPet.body")}
          onAction={() => router.push("/profile")}
          title={t("book.noPet.title")}
        />
      </Screen>
    );
  }

  const provider = providerQuery.data;

  if (!provider.isAvailable) {
    return (
      <Screen variant="top">
        <Text style={styles.title}>{t("book.title")}</Text>
        <ProviderSummary provider={provider} />
        <EmptyState
          actionLabel={t("book.findProvider")}
          message={t("book.providerUnavailable.body")}
          onAction={() => router.push("/search")}
          title={t("book.providerUnavailable.title")}
        />
      </Screen>
    );
  }

  if (confirmedBooking) {
    return (
      <RealBookingSuccess
        booking={confirmedBooking}
        dateLabel={dateLabel}
        onNewBooking={() => {
          setConfirmedBooking(null);
          setSelectedTime(null);
          bookingMutation.reset();
          availabilityQuery.refetch();
        }}
        pet={selectedPet}
        provider={provider}
        timeLabel={timeLabel ?? confirmedBooking.timeSlotId}
      />
    );
  }

  return (
    <Screen variant="top">
      <Text style={styles.title}>{t("book.title")}</Text>

      <ProviderSummary provider={provider} />

      <SectionHeader title={t("book.choosePet")} />
      <View style={styles.petGrid}>
        {pets.map((pet) => (
          <PetChip
            key={pet.id}
            onPress={() => setSelectedPetId(pet.id)}
            pet={pet}
            selected={pet.id === selectedPet.id}
          />
        ))}
      </View>

      <SectionHeader title={t("book.chooseDate")} />
      <DateStrip
        dates={dates}
        onSelect={(date) => {
          setSelectedDate(date);
          setSelectedTime(null);
          bookingMutation.reset();
        }}
        selectedId={selectedDate}
      />

      <SectionHeader title={t("book.slots.title")} />
      {availabilityQuery.isLoading ? (
        <LoadingState label={t("book.slots.loading")} />
      ) : availabilityQuery.isError ? (
        <ErrorState
          actionLabel={t("common.retry")}
          message={t("book.error.availability.body")}
          onRetry={() => availabilityQuery.refetch()}
          title={t("book.error.availability.title")}
        />
      ) : (
        <View style={styles.timeGrid}>
          {(availabilityQuery.data ?? []).map((slot) => (
            <TimeChip
              disabled={!slot.isAvailable || bookingMutation.isPending}
              key={slot.id}
              label={slot.label}
              onPress={() => {
                setSelectedTime(slot.id);
                bookingMutation.reset();
              }}
              selected={slot.isAvailable && selectedTime === slot.id}
            />
          ))}
        </View>
      )}

      <View style={styles.summary}>
        <Text style={styles.summaryTitle}>{t("book.summary.title")}</Text>
        <SummaryRow label={t("book.provider")} value={provider.name} />
        <SummaryRow label={t("book.summary.pet")} value={selectedPet.name} />
        <SummaryRow label={t("book.service")} value={provider.service} />
        <SummaryRow label={t("book.bookingDate")} value={dateLabel} />
        <SummaryRow
          label={t("book.bookingTime")}
          value={timeLabel ?? t("book.selectTime")}
        />
        <View style={styles.divider} />
        <SummaryRow
          label={t("book.summary.estimatedPrice")}
          strong
          value={`${formatPriceGBP(provider.pricePerHour)} / ${t(
            "book.summary.perHour",
          )}`}
        />
      </View>

      <Text style={styles.disclaimer}>{t("book.disclaimer")}</Text>

      {bookingMutation.isError ? (
        <Text accessibilityRole="alert" style={styles.errorText}>
          {getBookingErrorMessage(bookingMutation.error)}
        </Text>
      ) : null}

      <Button
        disabled={
          !provider.isAvailable ||
          !selectedTimeForBooking ||
          availabilityQuery.isLoading
        }
        isLoading={bookingMutation.isPending}
        label={t("book.confirm")}
        onPress={() => bookingMutation.mutate()}
      />
    </Screen>
  );
}

function DemoBookScreen({ providerId }: { providerId: string }) {
  const { accessToken } = useAuth();
  const meQuery = useMeQuery();
  const canUseMarketplace = hasTutorProfile(meQuery.data);
  // DEMO SEED: local IDs still use fixtures so the standalone Book tab and
  // legacy demo providers remain renderable. UUID providers use the real API.
  const provider =
    demoProviders.find((item) => item.id === providerId) ?? demoProviders[0]!;
  const dates = useMemo(() => buildUpcomingDates(10), []);

  const [selectedDate, setSelectedDate] = useState(dates[0]!.id);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState(false);

  const dateLabel = useDateLabel(dates, selectedDate);
  const timeLabel =
    demoTimeSlots.find((slot) => slot.id === selectedTime)?.label ?? null;

  if (!accessToken) {
    return (
      <Screen>
        <EmptyState
          actionLabel={t("common.signIn")}
          message={t("book.authenticatedBooking.body")}
          onAction={() => router.push("/login")}
          title={t("book.authenticatedBooking.title")}
        />
      </Screen>
    );
  }

  if (meQuery.isLoading) {
    return (
      <Screen>
        <LoadingState label={t("profile.loading")} />
      </Screen>
    );
  }

  if (meQuery.isError) {
    return (
      <Screen>
        <ErrorState
          actionLabel={t("common.retry")}
          message={t("profile.error")}
          onRetry={() => meQuery.refetch()}
          title={t("common.error")}
        />
      </Screen>
    );
  }

  if (!canUseMarketplace) {
    return (
      <Screen>
        <TutorProfileRequiredState message={t("book.profileRequired.body")} />
      </Screen>
    );
  }

  if (confirmed) {
    return (
      <Screen>
        <View style={styles.successWrap}>
          <View style={styles.successIcon}>
            <Ionicons color={colors.successText} name="checkmark" size={44} />
          </View>
          <Text style={styles.successTitle}>{t("book.demo.successTitle")}</Text>
          <Text style={styles.successBody}>
            {provider.name} received your {provider.service.toLowerCase()}{" "}
            request for {dateLabel} at {timeLabel}.{" "}
            {t("book.demo.successBodySuffix")}
          </Text>
          <View style={styles.successActions}>
            <Button
              label={t("tabs.chat")}
              onPress={() => router.push("/chat")}
            />
            <Button
              label={t("book.success.home")}
              onPress={() => router.push("/home")}
              variant="secondary"
            />
          </View>
        </View>
      </Screen>
    );
  }

  return (
    <Screen variant="top">
      <Text style={styles.title}>{t("book.title")}</Text>

      <View style={styles.card}>
        <Avatar name={provider.name} size={52} uri={provider.avatarUri} />
        <View style={styles.providerBody}>
          <Text style={styles.providerName}>{provider.name}</Text>
          <Text style={styles.providerService}>{provider.service}</Text>
          <RatingStars
            rating={provider.rating}
            reviewCount={provider.reviewCount}
          />
        </View>
      </View>

      <SectionHeader title={t("book.chooseDate")} />
      <DateStrip
        dates={dates}
        onSelect={setSelectedDate}
        selectedId={selectedDate}
      />

      <SectionHeader title={t("book.slots.title")} />
      <View style={styles.timeGrid}>
        {demoTimeSlots.map((slot) => (
          <TimeChip
            disabled={!slot.isAvailable}
            key={slot.id}
            label={slot.label}
            onPress={() => setSelectedTime(slot.id)}
            selected={selectedTime === slot.id}
          />
        ))}
      </View>

      <View style={styles.summary}>
        <Text style={styles.summaryTitle}>{t("book.summary.title")}</Text>
        <SummaryRow label={t("book.service")} value={provider.service} />
        <SummaryRow label={t("book.bookingDate")} value={dateLabel} />
        <SummaryRow
          label={t("book.bookingTime")}
          value={timeLabel ?? t("book.selectTime")}
        />
        <View style={styles.divider} />
        <SummaryRow
          label={t("book.summary.estimatedPrice")}
          strong
          value={`${formatPriceBRL(provider.pricePerHour)} / ${t(
            "book.summary.perHour",
          )}`}
        />
      </View>

      <Text style={styles.disclaimer}>{t("book.demo.disclaimer")}</Text>

      <Button
        disabled={selectedTime === null}
        label={t("book.confirm")}
        onPress={() => setConfirmed(true)}
      />
    </Screen>
  );
}

function ProviderSummary({ provider }: { provider: ProviderResponse }) {
  return (
    <View style={styles.card}>
      <Avatar
        name={provider.name}
        size={52}
        uri={provider.avatarUrl ?? undefined}
      />
      <View style={styles.providerBody}>
        <Text style={styles.providerName}>{provider.name}</Text>
        <Text style={styles.providerService}>{provider.service}</Text>
        <RatingStars
          rating={provider.rating}
          reviewCount={provider.reviewCount}
        />
      </View>
    </View>
  );
}

function PetChip({
  pet,
  selected,
  onPress,
}: {
  pet: PetResponse;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityLabel={`Pet ${pet.name}`}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      onPress={onPress}
      style={({ pressed }) => [
        styles.petChip,
        selected ? styles.petChipSelected : null,
        pressed ? styles.pressed : null,
      ]}
    >
      <Text style={[styles.petName, selected ? styles.petTextSelected : null]}>
        {pet.name}
      </Text>
      <Text style={[styles.petMeta, selected ? styles.petTextSelected : null]}>
        {formatPetSpecies(pet.species)}
      </Text>
    </Pressable>
  );
}

function RealBookingSuccess({
  booking,
  provider,
  pet,
  dateLabel,
  timeLabel,
  onNewBooking,
}: {
  booking: BookingResponse;
  provider: ProviderResponse;
  pet: PetResponse;
  dateLabel: string;
  timeLabel: string;
  onNewBooking: () => void;
}) {
  return (
    <Screen>
      <View style={styles.successWrap}>
        <View style={styles.successIcon}>
          <Ionicons color={colors.successText} name="checkmark" size={44} />
        </View>
        <Text style={styles.successTitle}>{t("book.success.title")}</Text>
        <Text style={styles.successBody}>
          {provider.name} {t("book.success.bodyPrefix")} {pet.name} on{" "}
          {dateLabel} at {timeLabel}. {t("book.success.status")}{" "}
          {formatBookingStatus(booking.status)}.
        </Text>
        <View style={styles.successActions}>
          <Button
            label={t("book.success.home")}
            onPress={() => router.push("/home")}
          />
          <Button
            label={t("book.success.newBooking")}
            onPress={onNewBooking}
            variant="secondary"
          />
        </View>
      </View>
    </Screen>
  );
}

function BookingListCard({
  booking,
  viewerIsProvider,
}: {
  booking: BookingResponse;
  viewerIsProvider: boolean;
}) {
  const { accessToken, session } = useAuth();
  const queryClient = useQueryClient();
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const bookingsQueryKey = useMemo(
    () => ["bookings", session?.user.id],
    [session?.user.id],
  );
  const statusMutation = useMutation({
    mutationFn: (status: BookingResponse["status"]) =>
      updateBooking(accessToken, booking.id, { status }),
    onError: () => {
      setStatusMessage("The booking status could not be updated.");
    },
    onSuccess: async () => {
      setStatusMessage("Booking updated.");
      await queryClient.invalidateQueries({ queryKey: bookingsQueryKey });
    },
  });
  const canConfirm = viewerIsProvider && booking.status === "requested";
  const canComplete = viewerIsProvider && booking.status === "confirmed";
  const canCancel =
    booking.status === "requested" || booking.status === "confirmed";

  return (
    <View style={styles.bookingCard}>
      <View style={styles.bookingTopRow}>
        <View style={styles.bookingTitleBlock}>
          <Text numberOfLines={2} style={styles.bookingService}>
            {booking.service}
          </Text>
          <Text style={styles.bookingWhen}>
            {formatBookingDate(booking.date)} at {booking.timeSlotId}
          </Text>
        </View>
        <View
          style={[
            styles.bookingStatusPill,
            booking.status === "cancelled" ? styles.bookingStatusMuted : null,
          ]}
        >
          <Text
            style={[
              styles.bookingStatusText,
              booking.status === "cancelled"
                ? styles.bookingStatusTextMuted
                : null,
            ]}
          >
            {formatBookingStatus(booking.status)}
          </Text>
        </View>
      </View>

      <View style={styles.bookingDetails}>
        <SummaryRow
          label="Provider ID"
          value={formatIdPrefix(booking.providerId)}
        />
        <SummaryRow label="Pet ID" value={formatIdPrefix(booking.petId)} />
        <SummaryRow label={t("book.bookingDate")} value={booking.date} />
        <SummaryRow label={t("book.bookingTime")} value={booking.timeSlotId} />
        <SummaryRow label="Status" value={booking.status} />
      </View>

      {statusMessage ? (
        <Text style={styles.noticeText}>{statusMessage}</Text>
      ) : null}

      {canConfirm || canComplete || canCancel ? (
        <View style={styles.bookingActions}>
          {canConfirm ? (
            <Button
              disabled={statusMutation.isPending}
              isLoading={
                statusMutation.isPending &&
                statusMutation.variables === "confirmed"
              }
              label="Confirm care"
              onPress={() => statusMutation.mutate("confirmed")}
            />
          ) : null}
          {canComplete ? (
            <Button
              disabled={statusMutation.isPending}
              isLoading={
                statusMutation.isPending &&
                statusMutation.variables === "completed"
              }
              label="Complete care"
              onPress={() => statusMutation.mutate("completed")}
            />
          ) : null}
          {canCancel ? (
            <Button
              disabled={statusMutation.isPending}
              isLoading={
                statusMutation.isPending &&
                statusMutation.variables === "cancelled"
              }
              label="Cancel request"
              onPress={() => statusMutation.mutate("cancelled")}
              variant="secondary"
            />
          ) : null}
        </View>
      ) : null}
    </View>
  );
}

function SummaryRow({
  label,
  value,
  strong = false,
}: {
  label: string;
  value: string;
  strong?: boolean;
}) {
  return (
    <View style={styles.summaryRow}>
      <Text style={styles.summaryLabel}>{label}</Text>
      <Text
        style={[styles.summaryValue, strong ? styles.summaryValueStrong : null]}
      >
        {value}
      </Text>
    </View>
  );
}

function useDateLabel(
  dates: ReturnType<typeof buildUpcomingDates>,
  selectedDate: string,
): string {
  return useMemo(() => {
    const found = dates.find((date) => date.id === selectedDate);
    return found ? `${found.weekday}, ${found.day}` : "—";
  }, [dates, selectedDate]);
}

function getBookingErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message === "BOOKING_INPUT_MISSING") {
    return t("book.error.inputMissing");
  }
  if (error instanceof Error && error.message === "PROVIDER_UNAVAILABLE") {
    return t("book.error.providerUnavailable");
  }

  if (error instanceof ApiClientError) {
    if (error.status === 409 || error.code === "CONFLICT") {
      return t("book.error.slotUnavailable");
    }
    if (error.status === 404) {
      return t("book.error.notFound");
    }
    if (error.status === 400) {
      return t("book.error.validation");
    }
  }

  return t("book.error.create");
}

function formatPetSpecies(species: PetResponse["species"]): string {
  if (species === "dog") return t("book.petSpecies.dog");
  if (species === "cat") return t("book.petSpecies.cat");
  return t("book.petSpecies.other");
}

function formatBookingStatus(status: BookingResponse["status"]): string {
  if (status === "requested") return t("book.status.requested");
  if (status === "confirmed") return t("book.status.confirmed");
  if (status === "cancelled") return t("book.status.cancelled");
  return t("book.status.completed");
}

function formatBookingDate(date: string): string {
  const [year, month, day] = date.split("-");
  if (!year || !month || !day) return date;
  return `${day}/${month}/${year}`;
}

function formatIdPrefix(value: string): string {
  return `${value.slice(0, 8)}...`;
}

const styles = StyleSheet.create({
  title: {
    color: colors.text,
    fontSize: typography.display,
    fontWeight: "800",
  },
  listHeader: {
    gap: spacing[3],
  },
  listTitleBlock: {
    gap: spacing[1],
  },
  listSubtitle: {
    color: colors.muted,
    fontSize: typography.body,
    lineHeight: 22,
  },
  bookingList: {
    gap: spacing[3],
  },
  bookingCard: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radius.lg,
    borderWidth: 1,
    gap: spacing[4],
    padding: spacing[4],
    ...shadow.sm,
  },
  bookingTopRow: {
    alignItems: "flex-start",
    flexDirection: "row",
    gap: spacing[3],
    justifyContent: "space-between",
  },
  bookingTitleBlock: {
    flex: 1,
    gap: spacing[1],
  },
  bookingService: {
    color: colors.text,
    fontSize: typography.section,
    fontWeight: "800",
    lineHeight: 26,
  },
  bookingWhen: {
    color: colors.muted,
    fontSize: typography.small,
    fontWeight: "600",
  },
  bookingStatusPill: {
    backgroundColor: colors.accentSoft,
    borderRadius: radius.pill,
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[1],
  },
  bookingStatusMuted: {
    backgroundColor: colors.surfaceMuted,
  },
  bookingStatusText: {
    color: colors.accent,
    fontSize: typography.caption,
    fontWeight: "800",
  },
  bookingStatusTextMuted: {
    color: colors.muted,
  },
  bookingDetails: {
    gap: spacing[3],
  },
  bookingActions: {
    gap: spacing[3],
  },
  card: {
    alignItems: "center",
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radius.lg,
    borderWidth: 1,
    flexDirection: "row",
    gap: spacing[3],
    padding: spacing[4],
    ...shadow.sm,
  },
  providerBody: {
    flex: 1,
    gap: 2,
  },
  providerName: {
    color: colors.text,
    fontSize: typography.body,
    fontWeight: "700",
  },
  providerService: {
    color: colors.muted,
    fontSize: typography.small,
  },
  petGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing[2],
  },
  petChip: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radius.md,
    borderWidth: 1,
    gap: 2,
    minWidth: 112,
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[3],
  },
  petChipSelected: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  petName: {
    color: colors.text,
    fontSize: typography.small,
    fontWeight: "800",
  },
  petMeta: {
    color: colors.muted,
    fontSize: typography.caption,
    fontWeight: "600",
  },
  petTextSelected: {
    color: colors.onAccent,
  },
  pressed: {
    opacity: 0.75,
  },
  timeGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing[2],
  },
  summary: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radius.lg,
    borderWidth: 1,
    gap: spacing[3],
    padding: spacing[4],
  },
  summaryTitle: {
    color: colors.text,
    fontSize: typography.section,
    fontWeight: "800",
  },
  summaryRow: {
    flexDirection: "row",
    gap: spacing[3],
    justifyContent: "space-between",
  },
  summaryLabel: {
    color: colors.muted,
    fontSize: typography.body,
  },
  summaryValue: {
    color: colors.text,
    flex: 1,
    fontSize: typography.body,
    fontWeight: "600",
    textAlign: "right",
  },
  summaryValueStrong: {
    color: colors.accent,
    fontWeight: "800",
  },
  divider: {
    backgroundColor: colors.border,
    height: 1,
  },
  disclaimer: {
    color: colors.muted,
    fontSize: typography.caption,
    lineHeight: 18,
  },
  errorText: {
    color: colors.danger,
    fontSize: typography.small,
    fontWeight: "700",
    lineHeight: 20,
  },
  noticeText: {
    color: colors.muted,
    fontSize: typography.small,
    fontWeight: "700",
    lineHeight: 20,
  },
  successWrap: {
    alignItems: "center",
    gap: spacing[3],
    paddingVertical: spacing[6],
  },
  successIcon: {
    alignItems: "center",
    backgroundColor: colors.successSurface,
    borderRadius: radius.pill,
    height: 88,
    justifyContent: "center",
    width: 88,
  },
  successTitle: {
    color: colors.text,
    fontSize: typography.display,
    fontWeight: "800",
  },
  successBody: {
    color: colors.muted,
    fontSize: typography.body,
    lineHeight: 24,
    textAlign: "center",
  },
  successActions: {
    alignSelf: "stretch",
    gap: spacing[3],
    marginTop: spacing[2],
  },
});
