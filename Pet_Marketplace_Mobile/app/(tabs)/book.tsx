import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Avatar } from '../../src/components/Avatar';
import { Button } from '../../src/components/Button';
import { buildUpcomingDates, DateStrip } from '../../src/components/DateStrip';
import { RatingStars } from '../../src/components/RatingStars';
import { Screen } from '../../src/components/Screen';
import { SectionHeader } from '../../src/components/SectionHeader';
import { TimeChip } from '../../src/components/TimeChip';
import { demoProviders, demoTimeSlots } from '../../src/data/demoFixtures';
import { colors, radius, shadow, spacing, typography } from '../../src/design/tokens';
import { formatPriceBRL } from '../../src/lib/format';

// DEMO SEED: scheduling uses local fixtures and a local-only confirmation.
// No real booking is created — the booking backend does not exist yet.
// See src/data/demoFixtures.ts.
export default function BookScreen() {
  // The provider is selected upstream (Provider Detail / Search / Home) and
  // passed as a route param. Falls back to the first provider when absent so
  // the Book tab is always renderable on its own.
  const { providerId } = useLocalSearchParams<{ providerId?: string }>();
  const provider =
    demoProviders.find((item) => item.id === providerId) ?? demoProviders[0]!;
  const dates = useMemo(() => buildUpcomingDates(10), []);

  const [selectedDate, setSelectedDate] = useState(dates[0]!.id);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState(false);

  const dateLabel = useMemo(() => {
    const found = dates.find((date) => date.id === selectedDate);
    return found ? `${found.weekday}, ${found.day}` : '—';
  }, [dates, selectedDate]);

  const timeLabel =
    demoTimeSlots.find((slot) => slot.id === selectedTime)?.label ?? null;

  if (confirmed) {
    return (
      <Screen>
        <View style={styles.successWrap}>
          <View style={styles.successIcon}>
            <Ionicons color={colors.successText} name="checkmark" size={44} />
          </View>
          <Text style={styles.successTitle}>Serviço agendado!</Text>
          <Text style={styles.successBody}>
            {provider.name} recebeu o seu pedido de {provider.service.toLowerCase()}{' '}
            para {dateLabel} às {timeLabel}. Você pode acompanhar o status no
            chat.
          </Text>
          <View style={styles.successActions}>
            <Button label="Ir para o chat" onPress={() => router.push('/chat')} />
            <Button
              label="Voltar ao início"
              onPress={() => router.push('/home')}
              variant="secondary"
            />
          </View>
        </View>
      </Screen>
    );
  }

  return (
    <Screen variant="top">
      <Text style={styles.title}>Agendar serviço</Text>

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

      <SectionHeader title="Escolha a data" />
      <DateStrip
        dates={dates}
        onSelect={setSelectedDate}
        selectedId={selectedDate}
      />

      <SectionHeader title="Horários disponíveis" />
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
        <Text style={styles.summaryTitle}>Resumo</Text>
        <SummaryRow label="Serviço" value={provider.service} />
        <SummaryRow label="Data" value={dateLabel} />
        <SummaryRow label="Horário" value={timeLabel ?? 'Selecione um horário'} />
        <View style={styles.divider} />
        <SummaryRow
          label="Valor estimado"
          strong
          value={`${formatPriceBRL(provider.pricePerHour)} / hora`}
        />
      </View>

      <Text style={styles.disclaimer}>
        A reserva é confirmada com o prestador pelo chat. Nenhum pagamento é
        processado neste app.
      </Text>

      <Button
        disabled={selectedTime === null}
        label="Confirmar reserva"
        onPress={() => setConfirmed(true)}
      />
    </Screen>
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
      <Text style={[styles.summaryValue, strong ? styles.summaryValueStrong : null]}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    color: colors.text,
    fontSize: typography.display,
    fontWeight: '800',
  },
  card: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radius.lg,
    borderWidth: 1,
    flexDirection: 'row',
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
    fontWeight: '700',
  },
  providerService: {
    color: colors.muted,
    fontSize: typography.small,
  },
  timeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
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
    fontWeight: '800',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summaryLabel: {
    color: colors.muted,
    fontSize: typography.body,
  },
  summaryValue: {
    color: colors.text,
    fontSize: typography.body,
    fontWeight: '600',
  },
  summaryValueStrong: {
    color: colors.accent,
    fontWeight: '800',
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
  successWrap: {
    alignItems: 'center',
    gap: spacing[3],
    paddingVertical: spacing[6],
  },
  successIcon: {
    alignItems: 'center',
    backgroundColor: '#E3F6EC',
    borderRadius: radius.pill,
    height: 88,
    justifyContent: 'center',
    width: 88,
  },
  successTitle: {
    color: colors.text,
    fontSize: typography.display,
    fontWeight: '800',
  },
  successBody: {
    color: colors.muted,
    fontSize: typography.body,
    lineHeight: 24,
    textAlign: 'center',
  },
  successActions: {
    alignSelf: 'stretch',
    gap: spacing[3],
    marginTop: spacing[2],
  },
});
