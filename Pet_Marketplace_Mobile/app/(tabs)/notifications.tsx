import { EmptyState } from '../../src/components/EmptyState';
import { Screen } from '../../src/components/Screen';

/**
 * Stub for the in-app notifications inbox (Mobile02 header bell, Mobile01
 * "Notifications"). Push delivery and persisted history are out of MVP scope
 * until the backend ships a notifications surface; this route exists so
 * the bell icon in the home header has a safe target and the route is
 * documented for Play Store data-safety drafting.
 *
 * Registered as `href: null` in `(tabs)/_layout.tsx` so it doesn't appear
 * in the bottom tab bar; reach it via `router.push('/notifications')`.
 */
export default function NotificationsScreen() {
  return (
    <Screen>
      <EmptyState
        message="You're all caught up. Booking updates and chat alerts will land here once notifications go live."
        title="No notifications yet"
      />
    </Screen>
  );
}
