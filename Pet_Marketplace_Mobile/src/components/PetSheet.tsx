import { useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import type { PetResponse, PetSize, PetSpecies } from "../api/types";
import { colors, radius, spacing, typography } from "../design/tokens";
import { t } from "../i18n";
import { Button } from "./Button";
import { IconButton } from "./IconButton";
import { TextField } from "./TextField";

const NAME_LIMIT = 120;
const BREED_LIMIT = 120;
const AGE_RANGE_LIMIT = 60;
const NOTES_LIMIT = 2000;

const SPECIES_OPTIONS: PetSpecies[] = ["dog", "cat", "other"];
const SIZE_OPTIONS: PetSize[] = [
  "small",
  "medium",
  "large",
  "giant",
  "unknown",
];

/**
 * Sheet emission contract. Mirrors the backend allowlist (`name`, `species`,
 * `size`, `breed`, `ageRange`, `notes`) so the parent screen can translate
 * it 1:1 into the create / update HTTP body without re-shaping.
 *
 * `breed`, `ageRange` and `notes` are emitted as `null` when the input is
 * empty so the API can clear a previously-set value on update.
 */
export interface PetSheetSubmission {
  name: string;
  species: PetSpecies;
  size: PetSize;
  breed: string | null;
  ageRange: string | null;
  notes: string | null;
}

interface PetSheetProps {
  visible: boolean;
  mode: "create" | "edit";
  initialPet?: PetResponse;
  isSubmitting: boolean;
  /** Surfaced from the parent mutation; the sheet only renders it. */
  externalErrorMessage?: string | null;
  onClose: () => void;
  onSubmit: (submission: PetSheetSubmission) => void;
}

/**
 * Rich pet form. Replaces the old name-only inline editor with a sheet that
 * exposes the five extra fields the backend already accepts (`species`,
 * `breed`, `size`, `ageRange`, `notes`) but the screen never used.
 *
 * State is seeded from `initialPet` on mount — the parent is expected to
 * re-key the sheet (`<PetSheet key="create" />` vs `key={`edit:${id}`}`)
 * whenever it switches mode or target. Same pattern as `AddressSheet`.
 */
export function PetSheet({
  visible,
  mode,
  initialPet,
  isSubmitting,
  externalErrorMessage,
  onClose,
  onSubmit,
}: PetSheetProps) {
  const [name, setName] = useState(initialPet?.name ?? "");
  const [species, setSpecies] = useState<PetSpecies>(
    initialPet?.species ?? "other",
  );
  const [size, setSize] = useState<PetSize>(initialPet?.size ?? "unknown");
  const [breed, setBreed] = useState(initialPet?.breed ?? "");
  const [ageRange, setAgeRange] = useState(initialPet?.ageRange ?? "");
  const [notes, setNotes] = useState(initialPet?.notes ?? "");

  const trimmedName = name.trim();
  const isNameValid =
    trimmedName.length > 0 && trimmedName.length <= NAME_LIMIT;
  const canSubmit = isNameValid && !isSubmitting;

  function handleSubmit() {
    if (!canSubmit) return;
    onSubmit({
      name: trimmedName,
      species,
      size,
      breed: emptyToNull(breed, BREED_LIMIT),
      ageRange: emptyToNull(ageRange, AGE_RANGE_LIMIT),
      notes: emptyToNull(notes, NOTES_LIMIT),
    });
  }

  const headerTitle =
    mode === "edit"
      ? t("profile.pet.sheet.titleEdit")
      : t("profile.pet.sheet.title");
  const saveLabel =
    mode === "edit" ? t("profile.pet.update") : t("profile.pet.save");

  return (
    <Modal
      animationType="slide"
      onRequestClose={onClose}
      presentationStyle="pageSheet"
      transparent={false}
      visible={visible}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>{headerTitle}</Text>
          <IconButton
            accessibilityLabel={t("profile.pet.sheet.close")}
            icon="close"
            onPress={onClose}
            variant="soft"
          />
        </View>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={styles.flex}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.section}>
              <TextField
                autoCapitalize="words"
                autoCorrect={false}
                label={t("profile.petName")}
                maxLength={NAME_LIMIT}
                onChangeText={setName}
                placeholder={t("profile.petNamePlaceholder")}
                value={name}
              />
              {name.length > 0 && !isNameValid ? (
                <Text style={styles.errorMessage}>
                  {t("profile.petNameInvalid")}
                </Text>
              ) : null}
            </View>

            <SegmentField
              label={t("profile.pet.field.species")}
              options={SPECIES_OPTIONS}
              selected={species}
              onChange={setSpecies}
              renderLabel={(value) => t(`profile.petSpecies.${value}`)}
            />

            <SegmentField
              label={t("profile.pet.field.size")}
              options={SIZE_OPTIONS}
              selected={size}
              onChange={setSize}
              renderLabel={(value) => t(`profile.pet.size.${value}`)}
            />

            <View style={styles.section}>
              <TextField
                autoCapitalize="words"
                autoCorrect={false}
                label={t("profile.pet.field.breed")}
                maxLength={BREED_LIMIT}
                onChangeText={setBreed}
                placeholder={t("profile.pet.placeholder.breed")}
                value={breed}
              />
            </View>

            <View style={styles.section}>
              <TextField
                autoCapitalize="sentences"
                autoCorrect={false}
                label={t("profile.pet.field.ageRange")}
                maxLength={AGE_RANGE_LIMIT}
                onChangeText={setAgeRange}
                placeholder={t("profile.pet.placeholder.ageRange")}
                value={ageRange}
              />
            </View>

            <View style={styles.section}>
              <Text style={styles.fieldLabel}>
                {t("profile.pet.field.notes")}
              </Text>
              <TextInput
                accessibilityLabel={t("profile.pet.field.notes")}
                multiline
                numberOfLines={5}
                maxLength={NOTES_LIMIT}
                onChangeText={setNotes}
                placeholder={t("profile.pet.placeholder.notes")}
                placeholderTextColor={colors.muted}
                style={styles.notesInput}
                textAlignVertical="top"
                value={notes}
              />
              <Text style={styles.help}>{t("profile.pet.help.notes")}</Text>
            </View>

            {externalErrorMessage ? (
              <Text style={styles.errorMessage}>{externalErrorMessage}</Text>
            ) : null}
          </ScrollView>
        </KeyboardAvoidingView>
        <View style={styles.footer}>
          <View style={styles.footerActions}>
            <Button
              disabled={isSubmitting}
              label={t("common.cancel")}
              onPress={onClose}
              variant="secondary"
            />
            <Button
              disabled={!canSubmit}
              isLoading={isSubmitting}
              label={saveLabel}
              onPress={handleSubmit}
              variant="primary"
            />
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

interface SegmentFieldProps<T extends string> {
  label: string;
  options: readonly T[];
  selected: T;
  onChange: (value: T) => void;
  renderLabel: (value: T) => string;
}

function SegmentField<T extends string>({
  label,
  options,
  selected,
  onChange,
  renderLabel,
}: SegmentFieldProps<T>) {
  return (
    <View style={styles.section}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <View style={styles.segmentRow}>
        {options.map((option) => {
          const isSelected = option === selected;
          return (
            <Pressable
              accessibilityRole="button"
              accessibilityState={{ selected: isSelected }}
              key={option}
              onPress={() => onChange(option)}
              style={[
                styles.segment,
                isSelected ? styles.segmentSelected : null,
              ]}
            >
              <Text
                style={[
                  styles.segmentLabel,
                  isSelected ? styles.segmentSelectedLabel : null,
                ]}
              >
                {renderLabel(option)}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

function emptyToNull(value: string, limit: number): string | null {
  const trimmed = value.trim();
  if (!trimmed) return null;
  // Defensive truncation: maxLength on the input is the primary guard, but
  // we never want to ship a value the backend will reject for length.
  return trimmed.length > limit ? trimmed.slice(0, limit) : trimmed;
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: colors.background,
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  header: {
    alignItems: "center",
    borderBottomColor: colors.border,
    borderBottomWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: spacing[5],
    paddingVertical: spacing[3],
  },
  headerTitle: {
    color: colors.text,
    fontSize: typography.section,
    fontWeight: "800",
  },
  scrollContent: {
    gap: spacing[5],
    padding: spacing[5],
  },
  section: {
    gap: spacing[2],
  },
  fieldLabel: {
    color: colors.text,
    fontSize: typography.small,
    fontWeight: "700",
  },
  segmentRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing[2],
  },
  segment: {
    backgroundColor: colors.surfaceMuted,
    borderColor: colors.border,
    borderRadius: radius.sm,
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
  notesInput: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radius.sm,
    borderWidth: 1,
    color: colors.text,
    fontSize: typography.body,
    minHeight: 120,
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
  },
  help: {
    color: colors.muted,
    fontSize: typography.small,
    lineHeight: 20,
  },
  errorMessage: {
    color: colors.danger,
    fontSize: typography.small,
    fontWeight: "700",
  },
  footer: {
    backgroundColor: colors.surface,
    borderTopColor: colors.border,
    borderTopWidth: 1,
    paddingHorizontal: spacing[5],
    paddingVertical: spacing[3],
  },
  footerActions: {
    flexDirection: "row",
    gap: spacing[3],
    justifyContent: "flex-end",
  },
});
