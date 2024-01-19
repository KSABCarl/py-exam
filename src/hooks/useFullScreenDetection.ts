import { ReactElement, useState } from "react";
import { useCallback, useEffect } from "react";

type Props = {
  disabled?: boolean;
};

export type FullScreenStatus = "pending" | "on" | "off";

export const triggerFullscreen = (element: HTMLElement | null) => {
  if (element) {
    element.requestFullscreen({ navigationUI: "hide" })?.catch((err: any) => {
      console.error(err);
    });
    element.style.overflowY = "auto";
  }
};

export function useFullScreenDetection(
  { disabled }: Props = { disabled: false }
) {
  /**
   * `undefined` signifies that we have not determined if the browser is in fullscreen mode or not.
   * `true` means that the browser is in fullscreen mode.
   * `false` means that the browser is not in fullscreen mode.
   */
  const [fullScreenStatus, setFullScreenStatus] =
    useState<FullScreenStatus>("pending");

  const changeFullscreenStatus = useCallback(
    (ev: Event) => {
      setFullScreenStatus(document.fullscreenElement ? "on" : "off");
    },
    [disabled]
  );

  const listener = useCallback((e: KeyboardEvent) => {
    /**
     * This code is for preventing user from ENTERING full screen mode using keyboard.
     * Browsers don't allow us to prevent user from exiting full screen.
     * Because in that case, the `fullscreenchange` does not fire and our state becomes invalid. The browser becomes full screen but our `status` still says 'off'.
     * The `fullscreenchange` event only fires when we use JavaScript to trigger full screen.
     * https://stackoverflow.com/questions/21103478/fullscreenchange-event-not-firing-in-chrome#:~:text=There%20appears%20to%20be%20a%20security%20restriction%20that%20prevents%20JavaScript%20from%20monitoring%20if%20a%20user%20manually%20enables%20fullscreen%20mode%20via%20a%20hotkey.
     */
    if (["F11", "Escape"].includes(e.key)) {
      e.preventDefault();
    }
  }, []);

  useEffect(() => {
    if (disabled) {
      setFullScreenStatus("pending");
      return;
    }

    document.addEventListener("fullscreenchange", changeFullscreenStatus);

    window.addEventListener("keydown", listener);

    return () => {
      document.removeEventListener("fullscreenchange", changeFullscreenStatus);
      window.removeEventListener("keydown", listener);
    };
  }, [disabled]);

  return { fullScreenStatus, triggerFullscreen } as const;
}
