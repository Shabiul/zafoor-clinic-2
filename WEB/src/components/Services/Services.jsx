import { useState } from "react";
import { servicesSection } from "../../data/content.js";
import TreatmentModal from "./TreatmentModal.jsx";
import ServiceImage from "./ServiceImage.jsx";
import useInView from "../../hooks/useInView.js";
import "./Services.css";

export default function Services() {
  const [activeDept, setActiveDept] = useState(servicesSection.departments[0].id);
  const [lang, setLang] = useState("en");
  const [openTreatment, setOpenTreatment] = useState(null);
  const [ref, inView] = useInView();

  const activeDeptData = servicesSection.departments.find((d) => d.id === activeDept);

  return (
    <section ref={ref} className={`section section-alt reveal${inView ? " in-view" : ""}`} id="services">
      <div className="container">
        <div className="section-head">
          <p className="eyebrow">{servicesSection.eyebrow}</p>
          <h2>{servicesSection.heading}</h2>
          <div className="divider"></div>
        </div>

        <div className="services-controls">
          <div className="lang-toggle">
            {servicesSection.languages.map((l) => (
              <button
                key={l.code}
                className={`lang-opt${lang === l.code ? " active" : ""}`}
                onClick={() => setLang(l.code)}
              >
                {l.label}
              </button>
            ))}
          </div>

          <div className="dept-tabs">
            {servicesSection.departments.map((dept) => (
              <button
                key={dept.id}
                className={`dept-tab-btn${activeDept === dept.id ? " active" : ""}`}
                onClick={() => setActiveDept(dept.id)}
              >
                {dept.tabLabel}
              </button>
            ))}
          </div>
        </div>

        <div className="dept-panel active">
          <div className="service-grid">
            {activeDeptData.cards.map((card, i) => {
              const title = lang === "ta" ? card.taTitle : card.enTitle;
              const desc = lang === "ta" ? card.taDesc : card.enDesc;
              return (
                <div
                  key={card.enTitle}
                  className={`service-card glass-panel stagger-item${inView ? " in-view" : ""}`}
                  style={{ transitionDelay: inView ? `${(i % 6) * 70}ms` : "0ms" }}
                  onClick={() => setOpenTreatment(card)}
                >
                  <ServiceImage src={card.image} alt={title} className="service-card-img" wrapperClassName="service-card-media" />
                  <div className="service-card-body">
                    <h4>{title}</h4>
                    <p>{desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <TreatmentModal treatment={openTreatment} onClose={() => setOpenTreatment(null)} />
    </section>
  );
}
