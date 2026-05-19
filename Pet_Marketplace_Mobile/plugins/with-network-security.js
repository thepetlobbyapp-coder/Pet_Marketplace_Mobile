/**
 * Config plugin local (sem nova dependência — @expo/config-plugins já vem
 * com `expo`). Endurece o transporte no nível do SO Android (S2):
 *
 *  - base-config: cleartext PROIBIDO por padrão (release = só HTTPS).
 *  - domain-config: cleartext permitido SOMENTE para loopback/emulador
 *    (localhost, 127.0.0.1, 10.0.2.2) → dev local contra
 *    http://localhost:3000 continua funcionando.
 *
 * Complementa (não substitui) o guard JS em src/config/env.ts.
 */
const {
  withAndroidManifest,
  withDangerousMod,
} = require('@expo/config-plugins');
const fs = require('fs');
const path = require('path');

const NETWORK_SECURITY_XML = `<?xml version="1.0" encoding="utf-8"?>
<network-security-config>
  <base-config cleartextTrafficPermitted="false">
    <trust-anchors>
      <certificates src="system" />
    </trust-anchors>
  </base-config>
  <domain-config cleartextTrafficPermitted="true">
    <domain includeSubdomains="true">localhost</domain>
    <domain includeSubdomains="true">127.0.0.1</domain>
    <domain includeSubdomains="true">10.0.2.2</domain>
  </domain-config>
</network-security-config>
`;

const withNetworkSecurity = (config) => {
  config = withAndroidManifest(config, (cfg) => {
    const application = cfg.modResults.manifest.application?.[0];
    if (application && application.$) {
      application.$['android:networkSecurityConfig'] =
        '@xml/network_security_config';
      application.$['android:usesCleartextTraffic'] = 'false';
    }
    return cfg;
  });

  config = withDangerousMod(config, [
    'android',
    async (cfg) => {
      const xmlDir = path.join(
        cfg.modRequest.platformProjectRoot,
        'app/src/main/res/xml',
      );
      fs.mkdirSync(xmlDir, { recursive: true });
      fs.writeFileSync(
        path.join(xmlDir, 'network_security_config.xml'),
        NETWORK_SECURITY_XML,
      );
      return cfg;
    },
  ]);

  return config;
};

module.exports = withNetworkSecurity;
