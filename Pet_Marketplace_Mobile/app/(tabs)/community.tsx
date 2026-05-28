import { EmptyState } from "../../src/components/EmptyState";
import { Screen } from "../../src/components/Screen";

/**
 * Stub for the community feed (Mobile01 §"Comunidade", design.md §7). The
 * feature is documented and out of MVP scope until the backend exposes
 * community posts; until then the route exists so future navigation
 * (e.g. a deep link from the home banner) lands somewhere safe and the
 * marketing/Play Store screenshots can be drafted against this shell.
 *
 * The route is registered as `href: null` in `(tabs)/_layout.tsx` so it
 * doesn't appear in the bottom tab bar; it can be reached programmatically
 * via `router.push('/community')` once linked from the home screen.
 */
export default function CommunityScreen() {
  return (
    <Screen>
      <EmptyState
        message="A community feed for your condominium is on the way. You'll be able to share alerts, recommendations and tips with your neighbours here."
        title="Community is coming soon"
      />
    </Screen>
  );
}
