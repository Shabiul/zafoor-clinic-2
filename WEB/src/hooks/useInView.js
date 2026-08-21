import { useEffect, useRef, useState } from "react";

/**
 * Lightweight scroll-reveal hook backed by IntersectionObserver — no
 * animation library required. Returns a ref to attach to the element and
 * a boolean that flips to true once the element first enters the viewport
 * (and stays true — reveals don't replay on scroll-back-up).
 */
export default function useInView({ threshold = 0.01, rootMargin = "50px 0px 0px 0px" } = {}) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  return [ref, inView];
}
