import { useState } from "react";

// Renders a service's photo inside a fixed-size media wrapper (so it always
// fills its slot via object-fit: cover, independent of the card's padding);
// falls back to a quiet placeholder tile if the image file hasn't been
// dropped into /public/images/services/ yet.
export default function ServiceImage({ src, alt, className, wrapperClassName }) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div className={`${wrapperClassName} service-img-placeholder`} aria-hidden="true">
        <span>Image coming soon</span>
      </div>
    );
  }

  return (
    <div className={wrapperClassName}>
      <img
        src={src}
        alt={alt}
        className={className}
        width="400"
        height="300"
        loading="lazy"
        decoding="async"
        onError={() => setFailed(true)}
      />
    </div>
  );
}
