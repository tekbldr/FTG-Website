import * as React from "react";

function cx(...c: (string | false | undefined)[]) {
  return c.filter(Boolean).join(" ");
}

/* ---------- Button ---------- */
export function Button({
  variant = "ghost",
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "spark" | "ghost" }) {
  return (
    <button
      className={cx(
        "inline-flex items-center gap-2 font-mono text-[12.5px] uppercase tracking-[.12em] px-[18px] py-[11px] rounded-[2px] transition disabled:opacity-50",
        variant === "spark"
          ? "bg-spark text-[#1a0a04] font-medium hover:brightness-110"
          : "border border-[var(--line-2)] text-paper hover:border-paper",
        className
      )}
      {...props}
    />
  );
}

/* ---------- Link button ---------- */
export function LinkButton({
  variant = "ghost",
  className,
  ...props
}: React.AnchorHTMLAttributes<HTMLAnchorElement> & { variant?: "spark" | "ghost" }) {
  return (
    <a
      className={cx(
        "inline-flex items-center gap-2 font-mono text-[12.5px] uppercase tracking-[.12em] px-[18px] py-[11px] rounded-[2px] transition",
        variant === "spark"
          ? "bg-spark text-[#1a0a04] font-medium hover:brightness-110"
          : "border border-[var(--line-2)] text-paper hover:border-paper",
        className
      )}
      {...props}
    />
  );
}

/* ---------- Form atoms ---------- */
export function Label(props: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      {...props}
      className={cx(
        "block font-mono text-[11px] uppercase tracking-[.16em] text-[var(--muted)] mb-2",
        props.className
      )}
    />
  );
}

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  function Input({ className, ...props }, ref) {
    return (
      <input
        ref={ref}
        className={cx(
          "w-full bg-[var(--ink-2)] border border-[var(--line-2)] rounded-[2px] px-[14px] py-[12px] text-[15px] text-paper placeholder:text-[var(--muted-2)] focus:border-spark focus:outline-none",
          className
        )}
        {...props}
      />
    );
  }
);

export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(function Textarea({ className, ...props }, ref) {
  return (
    <textarea
      ref={ref}
      className={cx(
        "w-full bg-[var(--ink-2)] border border-[var(--line-2)] rounded-[2px] px-[14px] py-[12px] text-[15px] text-paper placeholder:text-[var(--muted-2)] focus:border-spark focus:outline-none resize-y",
        className
      )}
      {...props}
    />
  );
});

export const Select = React.forwardRef<
  HTMLSelectElement,
  React.SelectHTMLAttributes<HTMLSelectElement>
>(function Select({ className, ...props }, ref) {
  return (
    <select
      ref={ref}
      className={cx(
        "w-full bg-[var(--ink-2)] border border-[var(--line-2)] rounded-[2px] px-[14px] py-[12px] text-[15px] text-paper focus:border-spark focus:outline-none",
        className
      )}
      {...props}
    />
  );
});

export function Field({
  label,
  htmlFor,
  required,
  hint,
  error,
  children,
}: {
  label: string;
  htmlFor?: string;
  required?: boolean;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <Label htmlFor={htmlFor}>
        {label} {required ? <span className="text-spark">*</span> : <span className="text-[var(--muted-2)]">(optional)</span>}
      </Label>
      {children}
      {hint && !error && <p className="mt-1.5 text-[12px] text-[var(--muted-2)]">{hint}</p>}
      {error && (
        <p className="mt-1.5 text-[12px] text-spark" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

/* ---------- Badge / status pill ---------- */
export function Badge({ children, tone = "muted" }: { children: React.ReactNode; tone?: "muted" | "spark" | "ok" }) {
  return (
    <span
      className={cx(
        "inline-block font-mono text-[10.5px] uppercase tracking-[.1em] border rounded-[2px] px-2 py-[5px]",
        tone === "spark" && "border-spark text-spark",
        tone === "ok" && "border-[rgba(120,220,150,.4)] text-[#7fdca0]",
        tone === "muted" && "border-[var(--line-2)] text-[var(--muted)]"
      )}
    >
      {children}
    </span>
  );
}

/* ---------- Stepper (multi-step wizard) ---------- */
export function Stepper({ steps, current }: { steps: string[]; current: number }) {
  return (
    <ol className="flex flex-wrap gap-x-6 gap-y-2 mb-8" aria-label="Progress">
      {steps.map((s, i) => (
        <li
          key={s}
          aria-current={i === current ? "step" : undefined}
          className={cx(
            "font-mono text-[11px] uppercase tracking-[.16em] flex items-center gap-2",
            i === current ? "text-paper" : i < current ? "text-[var(--muted)]" : "text-[var(--muted-2)]"
          )}
        >
          <span className={cx("inline-block w-5 text-center", i <= current ? "text-spark" : "text-[var(--muted-2)]")}>
            {i < current ? "✓" : String(i + 1).padStart(2, "0")}
          </span>
          {s}
        </li>
      ))}
    </ol>
  );
}

/* ---------- Section scaffold ---------- */
export function Eyebrow({ children }: { children: React.ReactNode }) {
  return <div className="eyebrow">{children}</div>;
}
