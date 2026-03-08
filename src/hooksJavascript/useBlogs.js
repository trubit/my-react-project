import { useEffect, useState } from "react";

const DEFAULT_INTERVAL_MS = 6000;

export const useBlogs = (posts, options = {}) => {
  const { intervalMs = DEFAULT_INTERVAL_MS } = options;
  const list = Array.isArray(posts) ? posts : [];
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (list.length > 0) {
      setActiveIndex(0);
    }
  }, [list.length]);

  useEffect(() => {
    if (activeIndex >= list.length) {
      setActiveIndex(0);
    }
  }, [activeIndex, list.length]);

  useEffect(() => {
    if (list.length <= 1) {
      return;
    }

    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % list.length);
    }, intervalMs);

    return () => clearInterval(interval);
  }, [intervalMs, list.length]);

  return { activeIndex, setActiveIndex };
};
