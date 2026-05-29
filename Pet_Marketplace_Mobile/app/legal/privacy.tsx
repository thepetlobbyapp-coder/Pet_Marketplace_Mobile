import { LegalScreen } from "../../src/screens/LegalScreen";
import { t } from "../../src/i18n";

export default function PrivacyScreen() {
  return (
    <LegalScreen
      body={t("legal.privacy.body")}
      title={t("legal.privacy.title")}
    />
  );
}
