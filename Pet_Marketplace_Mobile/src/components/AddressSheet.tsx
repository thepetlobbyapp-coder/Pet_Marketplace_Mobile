import { Ionicons } from '@expo/vector-icons';
import { useMemo, useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {
  lookupPostcode,
  normalisePostcode,
  PostcodeLookupError,
  type PostcodeLookupErrorCode,
  type PostcodeLookupResult,
} from '../api/postcodes';
import type { AddressResponse } from '../api/types';
import { colors, radius, shadow, spacing, typography } from '../design/tokens';
import { t } from '../i18n';
import { Button } from './Button';
import { IconButton } from './IconButton';
import { TextField } from './TextField';

const ADDRESS_LABEL_LIMIT = 60;
const ADDRESS_PUBLIC_AREA_LIMIT = 160;
const ADDRESS_POSTCODE_LIMIT = 16;

/**
 * Submission emitted by the sheet when the user presses Save. We keep the
 * shape provider-agnostic and let `profile.tsx` translate it into the
 * concrete `CreateAddressRequest` / `UpdateAddressRequest` payloads — the
 * sheet has no opinion about HTTP.
 *
 * For CREATE mode, `latitude` / `longitude` are always present because the
 * Save button stays disabled until a postcode lookup succeeds. For EDIT
 * mode they are present only when the user re-ran the lookup; the caller
 * uses absence to mean "don't move the geo point".
 */
export interface AddressSheetSubmission {
  postcode: string;
  /** Best-effort city derived from postcodes.io (admin district → region). */
  city: string | null;
  latitude: number | null;
  longitude: number | null;
  label: string | null;
  publicAreaLabel: string | null;
  setAsDefault: boolean;
}

type LookupState =
  | { kind: 'idle' }
  | { kind: 'searching' }
  | { kind: 'found'; result: PostcodeLookupResult }
  | { kind: 'error'; code: PostcodeLookupErrorCode };

interface AddressSheetProps {
  visible: boolean;
  mode: 'create' | 'edit';
  initialAddress?: AddressResponse;
  /** True when the authenticated user has a tutor profile (controls the
   *  "Set as default address" toggle). */
  showDefaultControl: boolean;
  /** Locked from the outside when the address is already the default — the
   *  backend rejects "unset default" updates and the UI should reflect that. */
  defaultLocked?: boolean;
  isSubmitting: boolean;
  /** Server-side / mutation error surfaced from the parent. The sheet only
   *  renders it; it does not classify HTTP statuses. */
  externalErrorMessage?: string | null;
  onClose: () => void;
  onSubmit: (submission: AddressSheetSubmission) => void;
}

/**
 * Bottom-sheet style modal that turns the four-field UK address form into
 * a guided "postcode → preview → save" flow. Mirrors the data we already
 * persist in `addresses` so the backend contract is unchanged.
 *
 * The sheet never logs the postcode value — it is PII (UK GDPR).
 */
export function AddressSheet({
  visible,
  mode,
  initialAddress,
  showDefaultControl,
  defaultLocked = false,
  isSubmitting,
  externalErrorMessage,
  onClose,
  onSubmit,
}: AddressSheetProps) {
  const initialPostcode = initialAddress?.postcode ?? '';
  const initialLabel = initialAddress?.label ?? '';
  const initialPublicArea = initialAddress?.publicAreaLabel ?? '';
  const initialDefault = initialAddress?.isDefaultTutorAddress ?? false;

  // State is seeded from `initial*` on mount only. The parent is expected to
  // remount the sheet (via React `key`) whenever it switches between create
  // and edit modes — that's what flushes any previous draft. Doing the reset
  // with a key instead of `useEffect(setState)` keeps render passes minimal
  // and avoids react-hooks/set-state-in-effect.
  const [postcodeInput, setPostcodeInput] = useState(initialPostcode);
  const [lookupState, setLookupState] = useState<LookupState>({ kind: 'idle' });
  const [label, setLabel] = useState(initialLabel);
  const [addressLine, setAddressLine] = useState(initialPublicArea);
  const [setAsDefault, setSetAsDefault] = useState(initialDefault);

  const canonical = useMemo(
    () => normalisePostcode(postcodeInput),
    [postcodeInput],
  );
  const isPostcodeFormatValid = canonical !== null;

  // CREATE requires a successful lookup so we always send valid UK
  // coordinates to the backend. EDIT only requires either a fresh lookup OR
  // an unchanged postcode (because nothing else in the diff needs lat/long).
  const isReadyToSubmit = useMemo(() => {
    if (lookupState.kind === 'found') return true;
    if (mode === 'edit') {
      return (
        isPostcodeFormatValid &&
        canonical === normalisePostcode(initialPostcode)
      );
    }
    return false;
  }, [lookupState.kind, mode, isPostcodeFormatValid, canonical, initialPostcode]);

  async function runLookup() {
    if (!canonical) {
      setLookupState({ kind: 'error', code: 'INVALID_FORMAT' });
      return;
    }
    setLookupState({ kind: 'searching' });
    try {
      const result = await lookupPostcode(canonical);
      setLookupState({ kind: 'found', result });
    } catch (error) {
      const code =
        error instanceof PostcodeLookupError ? error.code : 'NETWORK';
      setLookupState({ kind: 'error', code });
    }
  }

  function clearLookup() {
    setLookupState({ kind: 'idle' });
  }

  function handleSubmit() {
    if (!isReadyToSubmit) return;
    const trimmedLabel = label.trim();
    const trimmedLine = addressLine.trim();
    const found = lookupState.kind === 'found' ? lookupState.result : null;
    onSubmit({
      postcode: found?.postcode ?? canonical ?? initialPostcode,
      city: found
        ? (found.adminDistrict ?? found.region ?? null)
        : (initialAddress?.city ?? null),
      latitude: found?.latitude ?? null,
      longitude: found?.longitude ?? null,
      label: trimmedLabel.length > 0 ? trimmedLabel : null,
      publicAreaLabel: trimmedLine.length > 0 ? trimmedLine : null,
      setAsDefault,
    });
  }

  const lookupMessage = lookupErrorMessage(lookupState);
  const saveLabel =
    mode === 'edit' ? t('profile.address.update') : t('profile.address.save');
  const headerTitle =
    mode === 'edit'
      ? t('profile.address.sheet.titleEdit')
      : t('profile.address.sheet.title');

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
            accessibilityLabel={t('profile.address.sheet.close')}
            icon="close"
            onPress={onClose}
            variant="soft"
          />
        </View>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.flex}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.section}>
              <TextField
                accessibilityLabel={t('profile.addressPostcode')}
                autoCapitalize="characters"
                autoCorrect={false}
                label={t('profile.addressPostcode')}
                maxLength={ADDRESS_POSTCODE_LIMIT}
                onChangeText={(value) => {
                  setPostcodeInput(value);
                  if (lookupState.kind !== 'idle') {
                    setLookupState({ kind: 'idle' });
                  }
                }}
                placeholder={t('profile.address.lookup.placeholder')}
                value={postcodeInput}
              />
              <Button
                disabled={!isPostcodeFormatValid || lookupState.kind === 'searching'}
                isLoading={lookupState.kind === 'searching'}
                label={t('profile.address.lookup.cta')}
                onPress={() => {
                  void runLookup();
                }}
                variant="primary"
              />
              {lookupMessage ? (
                <Text style={styles.errorMessage}>{lookupMessage}</Text>
              ) : null}
              {lookupState.kind === 'found' ? (
                <View style={styles.preview}>
                  <View style={styles.previewHeader}>
                    <Ionicons
                      color={colors.successText}
                      name="checkmark-circle"
                      size={20}
                    />
                    <Text style={styles.previewTitle}>
                      {t('profile.address.previewTitle')}
                    </Text>
                  </View>
                  <PreviewRow
                    label={t('profile.addressPostcode')}
                    value={lookupState.result.postcode}
                  />
                  {lookupState.result.adminDistrict ? (
                    <PreviewRow
                      label={t('profile.address.previewDistrict')}
                      value={lookupState.result.adminDistrict}
                    />
                  ) : null}
                  {lookupState.result.region ? (
                    <PreviewRow
                      label={t('profile.address.previewRegion')}
                      value={lookupState.result.region}
                    />
                  ) : null}
                  {lookupState.result.country ? (
                    <PreviewRow
                      label={t('profile.address.previewCountry')}
                      value={lookupState.result.country}
                    />
                  ) : null}
                  <Pressable
                    accessibilityRole="button"
                    hitSlop={8}
                    onPress={clearLookup}
                    style={styles.changeLink}
                  >
                    <Ionicons color={colors.accent} name="create" size={16} />
                    <Text style={styles.changeLinkText}>
                      {t('profile.address.lookup.changePostcode')}
                    </Text>
                  </Pressable>
                </View>
              ) : null}
              <Text style={styles.help}>
                {t('profile.address.privacyHint')}
              </Text>
            </View>

            <View style={styles.section}>
              <TextField
                autoCapitalize="words"
                autoCorrect={false}
                label={t('profile.addressLabel')}
                maxLength={ADDRESS_LABEL_LIMIT}
                onChangeText={setLabel}
                placeholder={t('profile.addressLabelPlaceholder')}
                value={label}
              />
              <Text style={styles.help}>
                {t('profile.address.labelHint')}
              </Text>
              <TextField
                autoCapitalize="words"
                autoCorrect={false}
                label={t('profile.address.lineOptional')}
                maxLength={ADDRESS_PUBLIC_AREA_LIMIT}
                onChangeText={setAddressLine}
                placeholder={t('profile.address.linePlaceholder')}
                value={addressLine}
              />
            </View>

            {showDefaultControl ? (
              <Pressable
                accessibilityRole="checkbox"
                accessibilityState={{
                  checked: setAsDefault,
                  disabled: defaultLocked,
                }}
                disabled={defaultLocked}
                onPress={() => setSetAsDefault((prev) => !prev)}
                style={[
                  styles.toggleRow,
                  setAsDefault ? styles.toggleRowActive : null,
                  defaultLocked ? styles.toggleRowLocked : null,
                ]}
              >
                <Ionicons
                  color={setAsDefault ? colors.accent : colors.muted}
                  name={setAsDefault ? 'checkbox' : 'square-outline'}
                  size={22}
                />
                <Text style={styles.toggleLabel}>
                  {defaultLocked
                    ? t('profile.addressDefaultActive')
                    : t('profile.addressSetDefault')}
                </Text>
              </Pressable>
            ) : null}

            {externalErrorMessage ? (
              <Text style={styles.errorMessage}>{externalErrorMessage}</Text>
            ) : null}
          </ScrollView>
        </KeyboardAvoidingView>
        <View style={styles.footer}>
          <View style={styles.footerActions}>
            <Button
              disabled={isSubmitting}
              label={t('common.cancel')}
              onPress={onClose}
              variant="secondary"
            />
            <Button
              disabled={!isReadyToSubmit || isSubmitting}
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

function PreviewRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.previewRow}>
      <Text style={styles.previewLabel}>{label}</Text>
      <Text style={styles.previewValue}>{value}</Text>
    </View>
  );
}

function lookupErrorMessage(state: LookupState): string | null {
  if (state.kind !== 'error') return null;
  switch (state.code) {
    case 'INVALID_FORMAT':
      return t('profile.address.lookup.invalid');
    case 'NOT_FOUND':
      return t('profile.address.lookup.notFound');
    case 'TIMEOUT':
      return t('profile.address.lookup.timeout');
    case 'SERVER':
      return t('profile.address.lookup.server');
    case 'NETWORK':
    default:
      return t('profile.address.lookup.network');
  }
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
    alignItems: 'center',
    borderBottomColor: colors.border,
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing[5],
    paddingVertical: spacing[3],
  },
  headerTitle: {
    color: colors.text,
    fontSize: typography.section,
    fontWeight: '800',
  },
  scrollContent: {
    gap: spacing[5],
    padding: spacing[5],
  },
  section: {
    gap: spacing[3],
  },
  preview: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radius.md,
    borderWidth: 1,
    gap: spacing[2],
    padding: spacing[4],
    ...shadow.sm,
  },
  previewHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing[2],
    marginBottom: spacing[1],
  },
  previewTitle: {
    color: colors.text,
    fontSize: typography.body,
    fontWeight: '800',
  },
  previewRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing[3],
  },
  previewLabel: {
    color: colors.muted,
    fontSize: typography.small,
    fontWeight: '700',
  },
  previewValue: {
    color: colors.text,
    flexShrink: 1,
    fontSize: typography.small,
    fontWeight: '700',
    textAlign: 'right',
  },
  changeLink: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    flexDirection: 'row',
    gap: spacing[1],
    marginTop: spacing[2],
  },
  changeLinkText: {
    color: colors.accent,
    fontSize: typography.small,
    fontWeight: '700',
  },
  toggleRow: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radius.md,
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing[3],
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
  },
  toggleRowActive: {
    backgroundColor: colors.accentSoft,
    borderColor: colors.accent,
  },
  toggleRowLocked: {
    opacity: 0.7,
  },
  toggleLabel: {
    color: colors.text,
    fontSize: typography.small,
    fontWeight: '700',
  },
  help: {
    color: colors.muted,
    fontSize: typography.small,
    lineHeight: 20,
  },
  errorMessage: {
    color: colors.danger,
    fontSize: typography.small,
    fontWeight: '700',
  },
  footer: {
    backgroundColor: colors.surface,
    borderTopColor: colors.border,
    borderTopWidth: 1,
    paddingHorizontal: spacing[5],
    paddingVertical: spacing[3],
  },
  footerActions: {
    flexDirection: 'row',
    gap: spacing[3],
    justifyContent: 'flex-end',
  },
});
