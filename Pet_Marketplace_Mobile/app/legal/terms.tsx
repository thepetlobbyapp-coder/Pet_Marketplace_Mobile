import { LegalScreen } from '../../src/screens/LegalScreen';
import { t } from '../../src/i18n';

export default function TermsScreen() {
  return (
    <LegalScreen body={t('legal.terms.body')} title={t('legal.terms.title')} />
  );
}
