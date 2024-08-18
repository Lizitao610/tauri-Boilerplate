import { useEffect } from "react";

export const usePreventContextmenu = () => {
  useEffect(() => {
    if (import.meta.env.MODE === "production") {
      document.addEventListener("contextmenu", (event) => {
        event.preventDefault();
      });
    }
  }, []);
};

export const isInViewport = (element: HTMLElement) => {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <=
      (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
};

export const emitFakeResize = () => {
  const resizeEvent = new Event("resize");
  window.dispatchEvent(resizeEvent);
};
