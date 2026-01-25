export interface AuthFooterProps {
  variant: "sign-in" | "sign-up";
  // maybe other props
}

export default function AuthFooter({ variant }: AuthFooterProps) {
  return (
    <footer className="text-sm text-[var(--color-text-secondary)]">
      {variant === "sign-in" ? (
        <p>
          Don’t have an account? <a href="/sign-up">Sign up</a>
        </p>
      ) : (
        <p>
          Already have an account? <a href="/sign-in">Sign in</a>
        </p>
      )}
    </footer>
  );
}
