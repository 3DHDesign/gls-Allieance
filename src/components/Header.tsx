// src/components/Header.tsx
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const { isAuthenticated, logout } = useAuth();
  const navTo = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const nav = [
    { label: "About GLS", href: "/about" },
    { label: "Contact", href: "/contact" },
    { label: "Resources", href: "/resources" },
    { label: "Benefits", href: "/benefits" },
    { label: "Membership", href: "/member-registration" },
    { label: "Directory", href: "/find-forwarder" },
    { label: "Events", href: "/events" },
  ];

  const headerBg = scrolled
    ? "bg-white/95 backdrop-blur shadow-sm"
    : "bg-black/30 backdrop-blur-sm";

  const brandColor = scrolled
    ? "text-[var(--color-muted)]"
    : "text-[var(--color-primary)]";

  const linkColor = scrolled
    ? "text-[var(--color-muted)] hover:text-[var(--color-accent)]"
    : "text-[var(--color-primary)] hover:text-[var(--color-accent)]";

  const burgerBar = scrolled
    ? "bg-[var(--color-muted)]"
    : "bg-[var(--color-primary)]";

  const onLogout = async () => {
    await logout();
    navTo("/login");
  };

  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition ${headerBg}`}>
      <div className="container flex items-center justify-between py-4">
        <a
          href="/"
          className={`${brandColor} text-2xl font-semibold tracking-wide transition-colors`}
        >
          GLS <span className="font-bold">Alliance</span>
        </a>

        <button
          aria-label="Toggle menu"
          className="md:hidden relative h-8 w-9"
          onClick={() => setOpen((s) => !s)}
        >
          <span
            className={`absolute left-0 top-2 block h-[2px] w-full ${burgerBar} transition ${
              open ? "translate-y-2 rotate-45" : ""
            }`}
          />
          <span
            className={`absolute left-0 top-4 block h-[2px] w-full ${burgerBar} transition ${
              open ? "opacity-0" : ""
            }`}
          />
          <span
            className={`absolute left-0 top-6 block h-[2px] w-full ${burgerBar} transition ${
              open ? "-translate-y-2 -rotate-45" : ""
            }`}
          />
        </button>

        <nav className="hidden md:flex items-center gap-8">
          {nav.map((n) => (
            <a key={n.label} href={n.href} className={`${linkColor} transition-colors`}>
              {n.label}
            </a>
          ))}

          {!isAuthenticated ? (
            <div className="flex items-center gap-3">
              <a
                href="/login"
                className={`inline-block rounded-full px-5 py-2 font-medium transition ${
                  scrolled
                    ? "bg-gray-200 text-[var(--color-muted)] hover:bg-gray-300"
                    : "bg-white/70 text-[var(--color-muted)]"
                }`}
              >
                Login
              </a>

              <a
                href="/member-registration"
                className={`inline-block rounded-full px-5 py-2 font-medium transition ${
                  scrolled
                    ? "bg-[var(--color-accent)] text-white hover:opacity-90"
                    : "bg-primary/90 text-[var(--color-muted)]"
                }`}
              >
                Become a Member
              </a>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <a
                href="/dashboard"
                className={`inline-block rounded-full px-5 py-2 font-medium transition ${
                  scrolled
                    ? "bg-[var(--color-accent)] text-white hover:opacity-90"
                    : "bg-primary/90 text-[var(--color-muted)]"
                }`}
              >
                Dashboard
              </a>

              <button
                type="button"
                onClick={onLogout}
                className={`inline-block rounded-full px-5 py-2 font-medium transition ${
                  scrolled
                    ? "bg-gray-200 text-[var(--color-muted)] hover:bg-gray-300"
                    : "bg-white/70 text-[var(--color-muted)]"
                }`}
              >
                Logout
              </button>
            </div>
          )}
        </nav>
      </div>

      <div
        className={`md:hidden bg-[#030b29]/95 backdrop-blur-sm transition-[max-height] overflow-hidden ${
          open ? "max-h-96" : "max-h-0"
        }`}
      >
        <div className="container-xxl py-3">
          <ul className="flex flex-col gap-3">
            {nav.map((n) => (
              <li key={n.label}>
                <a
                  href={n.href}
                  className="block py-2 text-[var(--color-primary)] hover:text-[var(--color-accent)] transition-colors"
                  onClick={() => setOpen(false)}
                >
                  {n.label}
                </a>
              </li>
            ))}

            {!isAuthenticated ? (
              <>
                <li>
                  <a
                    href="/login"
                    className="block rounded-full bg-white/70 text-center text-[var(--color-muted)] px-4 py-3 font-medium"
                    onClick={() => setOpen(false)}
                  >
                    Login
                  </a>
                </li>
                <li>
                  <a
                    href="/member-registration"
                    className="block rounded-full bg-primary/90 text-center text-[var(--color-muted)] px-4 py-3 font-medium"
                    onClick={() => setOpen(false)}
                  >
                    Become a Member
                  </a>
                </li>
              </>
            ) : (
              <>
                <li>
                  <a
                    href="/dashboard"
                    className="block rounded-full bg-primary/90 text-center text-[var(--color-muted)] px-4 py-3 font-medium"
                    onClick={() => setOpen(false)}
                  >
                    Dashboard
                  </a>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={async () => {
                      await onLogout();
                      setOpen(false);
                    }}
                    className="w-full rounded-full bg-white/70 text-center text-[var(--color-muted)] px-4 py-3 font-medium"
                  >
                    Logout
                  </button>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </header>
  );
}
