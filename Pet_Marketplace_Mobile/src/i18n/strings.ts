/**
 * Strings en-GB. ÚNICA fonte de texto visível (gate: zero hardcode, zero pt-BR).
 * Documentação interna pode ser pt-BR; texto de UI nunca.
 */
export const enGB = {
  'common.retry': 'Try again',
  'common.signIn': 'Sign in',
  'common.signOut': 'Sign out',
  'common.loading': 'Loading…',

  'session.loading': 'Starting up…',

  'signIn.title': 'Welcome to Pet Marketplace',
  'signIn.body':
    'Sign in to find trusted pet care near you. No payment is processed in the app at this stage.',
  'signIn.devContinue': 'Continue (development session)',

  'auth.signedOutTitle': 'You are signed out',
  'auth.signedOutBody': 'Please sign in to continue.',

  'auth.blockedTitle': 'Account unavailable',
  'auth.blockedBody':
    'This account cannot access the app right now. Contact support if you think this is a mistake.',

  'error.offlineTitle': 'No connection',
  'error.offlineBody': 'Check your network and try again.',
  'error.timeoutBody': 'The request took too long. Please try again.',
  'error.unknownBody': 'Something went wrong. Please try again.',

  'profile.title': 'Your account',
  'profile.email': 'Email',
  'profile.noEmail': 'Not provided',
  'profile.status': 'Status',
  'profile.roles': 'Roles',
  'profile.experience': 'Primary experience',
} as const;

export type StringKey = keyof typeof enGB;
