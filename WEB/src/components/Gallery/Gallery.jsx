import { useState } from "react";
import { gallerySection } from "../../data/content.js";
import Lightbox from "./Lightbox.jsx";
import useInView from "../../hooks/useInView.js";
import "./Gallery.css";

export default function Gallery() {
  const [activeTab, setActiveTab] = useState(gallerySection.tabs[0].id);
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [ref, inView] = useInView();

  const items = activeTab === "ba" ? gallerySection.beforeAfter : gallerySection.clinic;

  return (
    <section ref={ref} className={`section section-alt reveal${inView ? " in-view" : ""}`} id="gallery">
      <div className="container center">
        <p className="eyebrow">{gallerySection.eyebrow}</p>
        <h2>{gallerySection.heading}</h2>
        <div className="divider"></div>
        <div className="lang-toggle">
          {gallerySection.tabs.map((tab) => (
            <button
              key={tab.id}
              className={`lang-opt${activeTab === tab.id ? " active" : ""}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <p className="muted">{gallerySection.note}</p>
      </div>
      <div className="container gallery-body">
        <div className="gallery-grid">
          {items.map((item, i) => (
            <div
              className={`gallery-item stagger-item${inView ? " in-view" : ""}`}
              style={{ transitionDelay: inView ? `${(i % 8) * 60}ms` : "0ms" }}
              key={item.src + i}
              onClick={() => setLightboxIndex(i)}
            >
              <img src={item.src} alt={item.alt} width="600" height="600" loading="lazy" decoding="async" />
            </div>
          ))}
        </div>
      </div>

      <Lightbox
        items={items}
        index={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onNavigate={setLightboxIndex}
      />
    </section>
  );
}
