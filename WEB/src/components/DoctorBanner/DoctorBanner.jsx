import { doctorBanner } from "../../data/content.js";
import useInView from "../../hooks/useInView.js";
import "./DoctorBanner.css";

export default function DoctorBanner() {
  const [ref, inView] = useInView();

  return (
    <section
      ref={ref}
      className={`brand-banner reveal${inView ? " in-view" : ""}`}
      style={{ backgroundImage: `url('${doctorBanner.background}')` }}
    >
      <div className="brand-banner-overlay"></div>
      <div className="brand-banner-inner glass-panel">
        <img
          src={doctorBanner.logo}
          alt="Zafoor Clinic logo"
          width="160"
          height="160"
          loading="lazy"
          className="full-logo"
        />
        <img
          src={doctorBanner.photo}
          alt={doctorBanner.name}
          width="320"
          height="320"
          loading="lazy"
          className="doc-photo"
        />
        <div className="doc-block">
          <p className="eyebrow">{doctorBanner.eyebrow}</p>
          <h2 className="doc-name">{doctorBanner.name}</h2>
          <p className="doc-cred">{doctorBanner.credentials}</p>
          <span className="doc-role-pill">{doctorBanner.role}</span>
        </div>
      </div>
    </section>
  );
}
