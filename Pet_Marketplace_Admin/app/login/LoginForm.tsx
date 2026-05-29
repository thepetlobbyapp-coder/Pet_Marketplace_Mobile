"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { getSupabaseBrowserClient } from "../../src/lib/supabaseBrowserClient";

type SubmitState =
  | { readonly status: "idle" }
  | { readonly status: "submitting" }
  | { readonly status: "error"; readonly message: string };

const GENERIC_ERROR =
  "Could not sign in. Check your credentials and try again.";

/**
 * Login admin client-side. Fluxo:
 *   1) signInWithPassword no Supabase Auth (anon key).
 *   2) POST /api/auth/login com o access_token. Route handler valida via
 *      GET /me, confirma role admin e seta cookie HttpOnly.
 *   3) router.replace("/admin/reports") quando o passo 2 retorna 200.
 *
 * Sem persistir token em localStorage — fonte da verdade é o cookie.
 * Mensagens de erro são genéricas (nunca incluem token ou payload bruto).
 */
export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitState, setSubmitState] = useState<SubmitState>({
    status: "idle",
  });

  const isSubmitting = submitState.status === "submitting";

  async function handleSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    if (isSubmitting) return;

    setSubmitState({ status: "submitting" });

    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      setSubmitState({
        message:
          "Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.",
        status: "error",
      });
      return;
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    if (error || !data.session?.access_token) {
      setSubmitState({ message: GENERIC_ERROR, status: "error" });
      return;
    }

    let cookieResponse: Response;
    try {
      cookieResponse = await fetch("/api/auth/login", {
        body: JSON.stringify({ accessToken: data.session.access_token }),
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        method: "POST",
      });
    } catch {
      setSubmitState({ message: GENERIC_ERROR, status: "error" });
      return;
    }

    if (!cookieResponse.ok) {
      setSubmitState({
        message:
          cookieResponse.status === 403
            ? "This account does not have admin access."
            : GENERIC_ERROR,
        status: "error",
      });
      // Mata sessão local do Supabase: cookie não foi emitido, queremos
      // que o usuário faça novo signIn explícito.
      await supabase.auth
        .signOut({ scope: "local" })
        .catch(() => undefined);
      return;
    }

    // Em sucesso, sai do Supabase client-side (não queremos sessão paralela
    // em memória / IndexedDB). Cookie HttpOnly é a sessão real.
    // Do not call supabase.auth.signOut() here: global logout invalidates the
    // same access token stored in the HttpOnly admin cookie.
    router.replace("/admin/reports");
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <label
        style={{
          display: "block",
          fontSize: 13,
          marginBottom: "var(--space-1)",
        }}
      >
        Email
        <input
          autoComplete="email"
          disabled={isSubmitting}
          onChange={(event) => setEmail(event.target.value)}
          required
          style={inputStyle}
          type="email"
          value={email}
        />
      </label>

      <label
        style={{
          display: "block",
          fontSize: 13,
          marginTop: "var(--space-3)",
          marginBottom: "var(--space-1)",
        }}
      >
        Password
        <input
          autoComplete="current-password"
          disabled={isSubmitting}
          onChange={(event) => setPassword(event.target.value)}
          required
          style={inputStyle}
          type="password"
          value={password}
        />
      </label>

      {submitState.status === "error" ? (
        <p
          role="alert"
          style={{
            color: "var(--color-danger)",
            fontSize: 13,
            margin: 0,
            marginTop: "var(--space-3)",
          }}
        >
          {submitState.message}
        </p>
      ) : null}

      <button
        disabled={isSubmitting}
        style={{
          background: "var(--color-accent)",
          border: "none",
          borderRadius: "var(--radius-sm)",
          color: "var(--color-accent-text)",
          cursor: isSubmitting ? "wait" : "pointer",
          marginTop: "var(--space-5)",
          padding: "var(--space-3) var(--space-4)",
          width: "100%",
        }}
        type="submit"
      >
        {isSubmitting ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}

const inputStyle: React.CSSProperties = {
  border: "1px solid var(--color-border)",
  borderRadius: "var(--radius-sm)",
  display: "block",
  fontSize: 14,
  marginTop: "var(--space-1)",
  padding: "var(--space-2) var(--space-3)",
  width: "100%",
};
