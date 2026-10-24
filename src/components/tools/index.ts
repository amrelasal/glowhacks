import type { ComponentType } from "react";
import SkincareChecker from "./SkincareChecker";
import WaterTracker from "./WaterTracker";
import PeriodCalculator from "./PeriodCalculator";

/**
 * Register finished tools here: slug -> component.
 * Any slug missing from this map automatically gets the "Coming Soon" card.
 */
export const toolComponents: Record<string, ComponentType> = {
  "skincare-checker": SkincareChecker,
  "water-tracker": WaterTracker,
  "period-calculator": PeriodCalculator,
};
