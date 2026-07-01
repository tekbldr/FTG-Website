"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const KEY = "ftg-consent";

// Apply the stored choice: mirrored into a cookie so the server could read it,
// and exposed on <html data-consent> so any future (consent-gated) analytics
// can check it before loading. Today the site sets essential cookies only.
function persist(value: "all" | "essential") {
  try {
    localStorage.setItem(KEY, value);
  } catch {
    /* storage unavailable — cookie below still records the choice */
  }
  document.cookie = `ftg_consent=${value};path=/;max-age=31536000;SameSite=Lax`;
  document.documentElement.dataset.consent = value;
}

export function CookieConsent() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let stored: string | null = null;
    try {
      stored = localStorage.getItem(KEY);
    } catch {
      /* ignore */
    }
    if (stored === "all" || stored === "essential") {
      document.documentElement.dataset.consent = stored;
    } else {
      setOpen(true);
    }
  }, []);

  if (!open) return null;

  const choose = (v: "all" | "essential") => {
    persist(v);
    setOpen(false);
  };

  return (
    <div className="cookie-banner" role="region" aria-label="Cookie consent">
      <div className="wrap cookie-inner">
        <p className="cookie-text">
          This site uses <strong>essential cookies only</strong> — sign-in sessions and this preference. No advertising,
          no third-party analytics. Details in the <Link href="/legal/cookies">Cookie Notice</Link>.
        </p>
        <div className="cookie-actions">
          <button type="button" className="btn" onClick={() => choose("essential")}>
            Essential only
          </button>
          <button type="button" className="btn solid" onClick={() => choose("all")}>
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
