import { useEffect, useState } from "react";
import { hero } from "../../data/content.js";
import "./Hero.css";

export default function Hero() {
  const [activeSlide, setActiveSlide] = useState(0);
  // clamp at render time, not just inside the interval tick — if
  // hero.slides ever shrinks (e.g. during a hot-reload) while
  // activeSlide is holding an index that no longer exists, every
  // slide's `i === safeActiveSlide` check would fail at once and none
  // would get the .active class, producing a blank frame. Modulo-ing
  // here guarantees a valid index on every render regardless.
  const safeActiveSlide = activeSlide % hero.slides.length;

  useEffect(() => {
    const id = setInterval(() => {
      setActiveSlide((i) => (i + 1) % hero.slides.length);
    }, 5500);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="hero" id="home">
      <div className="hero-ambient" aria-hidden="true">
        {hero.slides.map((slide, i) => (
          <div
            key={slide.src}
            className={`hero-ambient-layer${i === safeActiveSlide ? " active" : ""}`}
            style={{ backgroundImage: `url('${slide.src}')` }}
          />
        ))}
      </div>

      <div className="hero-stage">
        {hero.slides.map((slide, i) => (
          <img
            key={slide.src}
            src={slide.src}
            alt={slide.alt}
            width="1920"
            height="1080"
            fetchPriority={i === 0 ? "high" : "low"}
            decoding="async"
            className={`hero-stage-img${i === safeActiveSlide ? " active" : ""}`}
          />
        ))}
      </div>

      <div className="hero-scrim" aria-hidden="true"></div>
      <div className="hero-frame-border" aria-hidden="true"></div>

      <div className="hero-copy">
        <h1>
          {hero.headingLines[0]}
          <br />
          {hero.headingLines[1]}
        </h1>
        <p className="lead">{hero.lead}</p>
        <a href="#contact" className="btn btn-solid">
          Book Appointment
        </a>
      </div>

      <div className="hero-dots">
        {hero.slides.map((_, i) => (
          <span
            key={i}
            className={`hero-dot${i === safeActiveSlide ? " active" : ""}`}
            onClick={() => setActiveSlide(i)}
          />
        ))}
      </div>
    </section>
  );
}
