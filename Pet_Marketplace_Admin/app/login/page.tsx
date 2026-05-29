import LoginForm from "./LoginForm";

/**
 * Server Component shell para o login. Toda lógica interativa fica em
 * <LoginForm/> ("use client") — assim mantemos a página estática e
 * facilitamos cache de SSR.
 */
export default function LoginPage() {
  return (
    <main
      style={{
        alignItems: "center",
        display: "flex",
        justifyContent: "center",
        minHeight: "100vh",
        padding: "var(--space-5)",
      }}
    >
      <section
        style={{
          background: "var(--color-surface)",
          border: "1px solid var(--color-border)",
          borderRadius: "var(--radius-md)",
          maxWidth: 400,
          padding: "var(--space-6)",
          width: "100%",
        }}
      >
        <h1 style={{ margin: 0, marginBottom: "var(--space-2)" }}>
          Sign in
        </h1>
        <p
          style={{
            color: "var(--color-muted)",
            marginTop: 0,
            marginBottom: "var(--space-5)",
          }}
        >
          Use your admin email and password.
        </p>
        <LoginForm />
      </section>
    </main>
  );
}
