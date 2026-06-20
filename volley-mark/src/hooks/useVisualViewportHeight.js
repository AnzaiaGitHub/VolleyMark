import { useEffect } from "react";

/**
 * Keeps a CSS variable in sync with the visual viewport height
 * so bottom sheets stay above the mobile keyboard.
 */
export function useVisualViewportHeight(enabled = true) {
  useEffect(() => {
    if (!enabled || typeof window === "undefined" || !window.visualViewport) {
      return undefined;
    }

    const updateHeight = () => {
      const height = window.visualViewport.height;
      document.documentElement.style.setProperty("--sheet-max-height", `${Math.floor(height * 0.85)}px`);
      document.documentElement.style.setProperty("--visual-viewport-height", `${Math.floor(height)}px`);
    };

    updateHeight();
    window.visualViewport.addEventListener("resize", updateHeight);
    window.visualViewport.addEventListener("scroll", updateHeight);

    return () => {
      window.visualViewport.removeEventListener("resize", updateHeight);
      window.visualViewport.removeEventListener("scroll", updateHeight);
      document.documentElement.style.removeProperty("--sheet-max-height");
      document.documentElement.style.removeProperty("--visual-viewport-height");
    };
  }, [enabled]);
}
