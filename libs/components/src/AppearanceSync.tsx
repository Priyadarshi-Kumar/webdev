import { useEffect } from "react";
import { applyAppearance, useAppearanceStore } from "@webdev/store";

export function AppearanceSync() {
  useEffect(() => {
    const apply = () => applyAppearance(useAppearanceStore.getState());
    const unsubStore = useAppearanceStore.subscribe(apply);
    const unsubHydrate = useAppearanceStore.persist.onFinishHydration(apply);
    if (useAppearanceStore.persist.hasHydrated()) apply();
    return () => {
      unsubStore();
      unsubHydrate();
    };
  }, []);

  return null;
}
