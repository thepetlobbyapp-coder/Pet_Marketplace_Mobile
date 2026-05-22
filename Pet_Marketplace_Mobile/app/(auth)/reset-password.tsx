import { ComingNextScreen } from '../../src/screens/ComingNextScreen';
import { t } from '../../src/i18n';

export default function ResetPasswordScreen() {
  return (
    <ComingNextScreen
      body={t('auth.reset.body')}
      title={t('auth.reset.title')}
    />
  );
}
