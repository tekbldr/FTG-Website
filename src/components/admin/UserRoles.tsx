"use client";

import { useState, useTransition } from "react";
import { grantRole, revokeRole } from "@/lib/actions/people";
import { ALL_ROLES, ROLE_LABELS, type ModuleRole } from "@/lib/roles";

export function UserRoles({ userId, initial }: { userId: string; initial: ModuleRole[] }) {
  const [roles, setRoles] = useState<ModuleRole[]>(initial);
  const [pending, start] = useTransition();

  function add(role: ModuleRole) {
    if (!role || roles.includes(role)) return;
    setRoles((r) => [...r, role]);
    start(() => {
      void grantRole(userId, role);
    });
  }
  function remove(role: ModuleRole) {
    setRoles((r) => r.filter((x) => x !== role));
    start(() => {
      void revokeRole(userId, role);
    });
  }

  const available = ALL_ROLES.filter((r) => !roles.includes(r));

  return (
    <div className="flex flex-wrap items-center gap-2">
      {roles.length === 0 && <span className="text-[12px] text-[var(--muted-2)]">No roles</span>}
      {roles.map((r) => (
        <span
          key={r}
          className="inline-flex items-center gap-1 rounded-[2px] border border-[rgba(255,94,44,.4)] px-2 py-[4px] font-mono text-[10.5px] uppercase tracking-[.1em] text-spark"
        >
          {ROLE_LABELS[r]}
          <button
            type="button"
            onClick={() => remove(r)}
            disabled={pending}
            aria-label={`Remove ${ROLE_LABELS[r]}`}
            className="ml-1 leading-none hover:text-paper disabled:opacity-50"
          >
            ✕
          </button>
        </span>
      ))}
      {available.length > 0 && (
        <select
          value=""
          onChange={(e) => add(e.target.value as ModuleRole)}
          disabled={pending}
          aria-label="Add role"
          className="rounded-[2px] border border-[var(--line-2)] bg-ink px-2 py-[5px] font-mono text-[10.5px] uppercase tracking-[.1em] text-[var(--muted)] focus:border-spark focus:outline-none"
        >
          <option value="">+ Add role</option>
          {available.map((r) => (
            <option key={r} value={r}>
              {ROLE_LABELS[r]}
            </option>
          ))}
        </select>
      )}
    </div>
  );
}
