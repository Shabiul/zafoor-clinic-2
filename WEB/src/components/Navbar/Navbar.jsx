import { useState } from "react";
import { nav } from "../../data/content.js";
import "./Navbar.css";

export default function Navbar({ isSubpage = false }) {
  const [open, setOpen] = useState(false);

  const resolveHref = (href) => {
    if (!isSubpage) return href;
    if (href.startsWith("#")) return `/${href}`;
    return href;
  };

  return (
    <header className="site-header">
      <div className="navwrap">
        <a href={isSubpage ? "/" : "#home"} className="brand">
          <span className="name">
            {nav.brand.name} <span>{nav.brand.accent}</span>
          </span>
        </a>
        <nav className="site-nav">
          <ul className={open ? "open" : ""}>
            {nav.links.map((link) => (
              <li key={link.href}>
                <a href={resolveHref(link.href)} onClick={() => setOpen(false)}>
                  {link.label}
                </a>
              </li>
            ))}
            <li className="nav-cta-item">
              <a href={resolveHref(nav.cta.href)} className="nav-cta" onClick={() => setOpen(false)}>
                {nav.cta.label}
              </a>
            </li>
          </ul>
        </nav>
        <button
          className="nav-toggle"
          aria-label="Menu"
          onClick={() => setOpen((v) => !v)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </header>
  );
}
