import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useVisualViewportHeight } from "../../hooks/useVisualViewportHeight";

export function BottomSheet({
  isOpen,
  title,
  children,
  primaryLabel,
  secondaryLabel,
  onPrimary,
  onSecondary,
  onClose,
}) {
  const sheetRef = useRef(null);
  useVisualViewportHeight(isOpen);

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    document.body.classList.add("sheet-open");

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.classList.remove("sheet-open");
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  return createPortal(
    <div className="bottom-sheet-root" role="presentation">
      <button
        type="button"
        className="bottom-sheet-backdrop"
        aria-label="Close"
        onClick={onClose}
      />
      <div
        ref={sheetRef}
        className="bottom-sheet"
        role="dialog"
        aria-modal="true"
        aria-labelledby="bottom-sheet-title"
      >
        <div className="bottom-sheet-header">
          <h3 id="bottom-sheet-title">{title}</h3>
        </div>
        <div className="bottom-sheet-body">{children}</div>
        <div className="bottom-sheet-actions">
          {secondaryLabel && (
            <button type="button" className="secondary" onClick={onSecondary || onClose}>
              {secondaryLabel}
            </button>
          )}
          {primaryLabel && (
            <button type="button" onClick={onPrimary}>
              {primaryLabel}
            </button>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}
