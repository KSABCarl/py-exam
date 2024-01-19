import { useState, useCallback, useEffect, useRef } from "react";

type Props = {
  disabled?: boolean;
};

export function useTabFocusDetection(
  { disabled }: Props = { disabled: false }
) {
  const [tabFocusStatus, setTabFocusStatus] = useState(false);

  const handleChange = useCallback(
    (ev: Event) => {
      console.log(ev.type);
      if (ev && ev.type) {
        if (ev.type === "visibilitychange") {
          setTabFocusStatus(!document.hidden);
        } else {
          setTabFocusStatus(ev.type === "focus" || ev.type === "mouseenter");
        }
      }
    },
    [disabled]
  );

  useEffect(() => {
    if (disabled) return;

    document.addEventListener("visibilitychange", handleChange, false);

    // extra event listeners for better behaviour
    document.addEventListener("focus", handleChange, false);
    document.addEventListener("blur", handleChange, false);
    window.addEventListener("focus", handleChange, false);
    window.addEventListener("blur", handleChange, false);

    document.addEventListener("mouseleave", handleChange, false);
    document.addEventListener("mouseenter", handleChange, false);

    return () => {
      document.removeEventListener("visibilitychange", handleChange);
      document.removeEventListener("focus", handleChange);
      document.removeEventListener("blur", handleChange);
      window.removeEventListener("focus", handleChange);
      window.removeEventListener("blur", handleChange);
      document.removeEventListener("mouseleave", handleChange);
      document.removeEventListener("mouseenter", handleChange);
    };
  }, [disabled]);

  return { tabFocusStatus };
}
