import { ComingNextScreen } from '../../src/screens/ComingNextScreen';
import { t } from '../../src/i18n';

export default function SignUpScreen() {
  return (
    <ComingNextScreen
      body={t('auth.signUp.body')}
      title={t('auth.signUp.title')}
    />
  );
}
