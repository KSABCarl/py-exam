// import { useCamDetection } from "./useCamDetection";
// import { useDevToolDetection } from "./useDevToolDetection";
import {
  FullScreenStatus,
  triggerFullscreen,
  useFullScreenDetection,
} from "./useFullScreenDetection";
import { useTabFocusDetection } from "./useTabFocusDetection";
import { useCopyDisable } from "./useCopyDisable";
import { useDisableContextMenu } from "./useDisableContextMenu";

type Props = {
  element?: HTMLElement | null;
  preventContextMenu?: boolean;
  preventCopy?: boolean;
  forceFullScreen?: boolean;
  preventTabSwitch?: boolean;
};

export type ProctoringData = {
  fullScreen: { status: FullScreenStatus; trigger: VoidFunction };
  tabFocus: { status: boolean };
};

export function useProctoring({
  element = document.body,
  preventTabSwitch = false,
  forceFullScreen = false,
  preventContextMenu = false,
  preventCopy = false,
}: Props) {
  useDisableContextMenu({ disabled: preventContextMenu === false });

  useCopyDisable({ disabled: preventCopy === false });

  const { tabFocusStatus } = useTabFocusDetection({
    disabled: preventTabSwitch === false,
  });

  const { fullScreenStatus } = useFullScreenDetection({
    disabled: forceFullScreen === false,
  });

  return {
    fullScreen: {
      status: fullScreenStatus,
      trigger: () => triggerFullscreen(element),
    },
    tabFocus: { status: tabFocusStatus },
  } as const;
}
