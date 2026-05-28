"use client";

import { useState } from "react";
import type { CSSProperties, ReactNode } from "react";

interface ConfirmSubmitButtonProps {
  readonly children: ReactNode;
  readonly confirmMessage?: string;
  readonly disabled?: boolean;
  readonly name?: string;
  readonly style?: CSSProperties;
  readonly value?: string;
}

interface CopyButtonProps {
  readonly label?: string;
  readonly value: string;
}

export function ConfirmSubmitButton({
  children,
  confirmMessage,
  disabled = false,
  name,
  style,
  value,
}: ConfirmSubmitButtonProps) {
  return (
    <button
      disabled={disabled}
      name={name}
      onClick={(event) => {
        if (!confirmMessage) return;
        if (!window.confirm(confirmMessage)) {
          event.preventDefault();
        }
      }}
      style={{
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.55 : 1,
        ...style,
      }}
      type="submit"
      value={value}
    >
      {children}
    </button>
  );
}

export function CopyButton({ label = "Copy ID", value }: CopyButtonProps) {
  const [state, setState] = useState<"idle" | "copied" | "error">("idle");

  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setState("copied");
      window.setTimeout(() => setState("idle"), 1600);
    } catch {
      setState("error");
      window.setTimeout(() => setState("idle"), 2200);
    }
  }

  const text =
    state === "copied" ? "Copied" : state === "error" ? "Copy failed" : label;

  return (
    <button
      aria-label={`${label}: ${value}`}
      onClick={copy}
      style={{
        background: "var(--color-surface)",
        border: "1px solid var(--color-border)",
        borderRadius: "var(--radius-sm)",
        color:
          state === "error" ? "var(--color-warning-text)" : "var(--color-text)",
        cursor: "pointer",
        padding: "var(--space-2) var(--space-3)",
      }}
      type="button"
    >
      {text}
    </button>
  );
}
