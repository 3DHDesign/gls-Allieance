import { useEffect, useState } from "react";
import { FiArrowRight, FiMenu, FiX } from "react-icons/fi";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const nav = [
  { label: "About GLS", href: "/about" },
  { label: "Benefits", href: "/benefits" },
  { label: "Directory", href: "/find-forwarder" },
  { label: "Resources", href: "/resources" },
  { label: "Events", href: "/events" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const closeMenu = () => setOpen(false);

  const onLogout = async () => {
    await logout();
    closeMenu();
    navigate("/login");
  };

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    [
      "relative py-2 text-[13px] font-medium tracking-wide transition-colors",
      isActive
        ? "text-[var(--color-accent)]"
        : "text-slate-600 hover:text-[var(--color-accent)]",
      "after:absolute after:inset-x-0 after:-bottom-0.5 after:h-0.5 after:origin-left after:rounded-full after:bg-[var(--color-accent)] after:transition-transform",
      isActive ? "after:scale-x-100" : "after:scale-x-0 hover:after:scale-x-100",
    ].join(" ");

  return (
    <header
      className={[
        "fixed inset-x-0 top-0 z-50 border-b transition-all duration-300",
        scrolled
          ? "border-slate-200/80 bg-white/95 shadow-[0_8px_30px_rgba(1,30,79,0.08)] backdrop-blur-xl"
          : "border-transparent bg-white",
      ].join(" ")}
    >
      <div className="container flex h-[78px] items-center justify-between gap-6">
        <Link
          to="/"
          className="group flex shrink-0 items-center gap-3"
          onClick={closeMenu}
          aria-label="GLS Alliance home"
        >
          <img
            src="/images/logo.png"
            alt="GLS Alliance"
            className="h-[66px] w-[142px] object-contain transition-transform group-hover:scale-[1.03] sm:w-[178px]"
          />
        </Link>

        <nav className="hidden items-center gap-7 lg:flex" aria-label="Primary navigation">
          {nav.map((item) => (
            <NavLink key={item.href} to={item.href} className={linkClass}>
              {item.label}
            </NavLink>
          ))}
          <NavLink
            to="/contact"
            className="flex items-center gap-1 py-2 text-[13px] font-medium tracking-wide text-slate-600 transition-colors hover:text-[var(--color-accent)]"
          >
            Contact Us
          </NavLink>
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          {!isAuthenticated ? (
            <>
              <Link
                to="/login"
                className="rounded-full px-4 py-2.5 text-[13px] font-semibold text-slate-600 transition-colors hover:text-[var(--color-accent)]"
              >
                Sign in
              </Link>
              <Link
                to="/member-registration"
                className="group flex items-center gap-2 rounded-full bg-[var(--color-accent)] px-5 py-3 text-[13px] font-semibold text-white shadow-[0_7px_18px_rgba(1,30,79,0.18)] transition-all hover:-translate-y-0.5 hover:bg-[var(--color-accent-mid)]"
              >
                Become a member
                <FiArrowRight className="transition-transform group-hover:translate-x-0.5" />
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/dashboard"
                className="rounded-full bg-[var(--color-accent)] px-5 py-3 text-[13px] font-semibold text-white shadow-[0_7px_18px_rgba(1,30,79,0.18)] transition-all hover:-translate-y-0.5 hover:bg-[var(--color-accent-mid)]"
              >
                Dashboard
              </Link>
              <button
                type="button"
                onClick={onLogout}
                className="px-2 py-2 text-[13px] font-semibold text-slate-500 transition-colors hover:text-red-600"
              >
                Sign out
              </button>
            </>
          )}
        </div>

        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          className="grid h-11 w-11 place-items-center rounded-xl border border-slate-200 text-xl text-[var(--color-accent)] transition-colors hover:bg-slate-50 lg:hidden"
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <FiX /> : <FiMenu />}
        </button>
      </div>

      <div
        className={[
          "overflow-hidden border-t border-slate-100 bg-white transition-[max-height,opacity] duration-300 lg:hidden",
          open ? "max-h-[620px] opacity-100" : "max-h-0 opacity-0",
        ].join(" ")}
      >
        <nav className="container py-5" aria-label="Mobile navigation">
          <div className="grid gap-1">
            {nav.map((item) => (
              <NavLink
                key={item.href}
                to={item.href}
                className={({ isActive }) =>
                  `rounded-xl px-4 py-3 text-sm font-medium ${
                    isActive
                      ? "bg-blue-50 text-[var(--color-accent)]"
                      : "text-slate-600 hover:bg-slate-50"
                  }`
                }
                onClick={closeMenu}
              >
                {item.label}
              </NavLink>
            ))}
            <NavLink
              to="/contact"
              className={({ isActive }) =>
                `rounded-xl px-4 py-3 text-sm font-medium ${
                  isActive
                    ? "bg-blue-50 text-[var(--color-accent)]"
                    : "text-slate-600 hover:bg-slate-50"
                }`
              }
              onClick={closeMenu}
            >
              Contact
            </NavLink>
          </div>

          <div className="mt-5 grid gap-2 border-t border-slate-100 pt-5">
            {!isAuthenticated ? (
              <>
                <Link
                  to="/login"
                  onClick={closeMenu}
                  className="rounded-xl px-4 py-3 text-center text-sm font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Sign in
                </Link>
                <Link
                  to="/member-registration"
                  onClick={closeMenu}
                  className="rounded-xl bg-[var(--color-accent)] px-4 py-3 text-center text-sm font-semibold text-white"
                >
                  Become a member
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/dashboard"
                  onClick={closeMenu}
                  className="rounded-xl bg-[var(--color-accent)] px-4 py-3 text-center text-sm font-semibold text-white"
                >
                  Go to dashboard
                </Link>
                <button
                  type="button"
                  onClick={onLogout}
                  className="rounded-xl px-4 py-3 text-center text-sm font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Sign out
                </button>
              </>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
