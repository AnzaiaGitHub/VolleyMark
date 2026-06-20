import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { getLabel } from "../../Utils/Labels";
import { BottomSheet } from "./BottomSheet";

const InputSheetContext = createContext(null);

export function useInputSheet() {
  const context = useContext(InputSheetContext);
  if (!context) {
    throw new Error("useInputSheet must be used within InputSheetProvider");
  }
  return context;
}

export function InputSheetProvider({ children }) {
  const [sheetState, setSheetState] = useState(null);
  const [value, setValue] = useState("");
  const triggerRef = useRef(null);
  const inputRef = useRef(null);

  const closeSheet = useCallback((restoreFocus = true) => {
    setSheetState(null);
    if (restoreFocus && triggerRef.current) {
      triggerRef.current.focus();
    }
  }, []);

  const openTextSheet = useCallback(({ title, value: initialValue, onSave, triggerElement }) => {
    triggerRef.current = triggerElement || document.activeElement;
    setValue(initialValue ?? "");
    setSheetState({
      type: "text",
      title,
      onSave,
    });
  }, []);

  const openNumberSheet = useCallback(({ title, value: initialValue, min, max, onSave, triggerElement }) => {
    triggerRef.current = triggerElement || document.activeElement;
    setValue(String(initialValue ?? ""));
    setSheetState({
      type: "number",
      title,
      min,
      max,
      onSave,
    });
  }, []);

  const handlePrimary = useCallback(() => {
    if (!sheetState) {
      return;
    }

    if (sheetState.type === "number") {
      const parsed = parseInt(value, 10);
      if (Number.isNaN(parsed)) {
        return;
      }
      const clamped = Math.min(
        sheetState.max ?? parsed,
        Math.max(sheetState.min ?? parsed, parsed)
      );
      sheetState.onSave(clamped);
    } else {
      sheetState.onSave(value);
    }

    closeSheet(true);
  }, [sheetState, value, closeSheet]);

  useEffect(() => {
    if (!sheetState) {
      return undefined;
    }
    const timer = setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
        if (sheetState.type === "text") {
          inputRef.current.select();
        }
      }
    }, 100);
    return () => clearTimeout(timer);
  }, [sheetState]);

  return (
    <InputSheetContext.Provider value={{ openTextSheet, openNumberSheet, closeSheet }}>
      {children}
      <BottomSheet
        isOpen={Boolean(sheetState)}
        title={sheetState?.title || ""}
        primaryLabel={getLabel("save") || "Save"}
        secondaryLabel={getLabel("cancel") || "Cancel"}
        onPrimary={handlePrimary}
        onSecondary={() => closeSheet(true)}
        onClose={() => closeSheet(true)}
      >
        <div className="bottom-sheet-input-wrap">
          {sheetState?.type === "number" ? (
            <input
              ref={inputRef}
              type="number"
              inputMode="numeric"
              min={sheetState.min}
              max={sheetState.max}
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />
          ) : (
            <input
              ref={inputRef}
              type="text"
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />
          )}
        </div>
      </BottomSheet>
    </InputSheetContext.Provider>
  );
}
