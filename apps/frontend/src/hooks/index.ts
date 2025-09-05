import { useEffect, useState } from "react";

import t3Env from "~/integrations/t3-env";

export * from "./form";

const MOBILE_BREAKPOINT = 768;

export function useIsMobile() {
  const [isMobile, setIsMobile] = useState<boolean | undefined>(undefined);

  useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };
    mql.addEventListener("change", onChange);
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return !!isMobile;
}

export function useAvatarPreview(fileName?: string | null) {
  return useState<string | undefined>(
    fileName
      ? `${t3Env.client.VITE_APP_BASE_URL}/uploads/${fileName}`
      : undefined,
  );
}
