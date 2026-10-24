import type { ComponentType } from "react";
import SkincareChecker from "./SkincareChecker";
import WaterTracker from "./WaterTracker";
import PeriodCalculator from "./PeriodCalculator";
import SleepCycleCalculator from "./SleepCycleCalculator";
import AestheticPomodoro from "./AestheticPomodoro";
import BreathingVisualizer from "./BreathingVisualizer";
import CuteFontsGenerator from "./CuteFontsGenerator";
import MakeupExpiryTracker from "./MakeupExpiryTracker";
import FoundationMatcher from "./FoundationMatcher";
import SunscreenTimer from "./SunscreenTimer";
import FaceShapeAnalyzer from "./FaceShapeAnalyzer";
import HairPorosityQuiz from "./HairPorosityQuiz";
import SeasonalColorPalette from "./SeasonalColorPalette";
import SizeConverter from "./SizeConverter";
import RingSizeMeasurer from "./RingSizeMeasurer";
import CapsuleWardrobeBuilder from "./CapsuleWardrobeBuilder";
import OutfitRandomizer from "./OutfitRandomizer";
import ColorBlockingGuide from "./ColorBlockingGuide";
import MoodboardCreator from "./MoodboardCreator";
import InstaGridMaker from "./InstaGridMaker";
import PhotoFiltersGuide from "./PhotoFiltersGuide";
import WallpaperMaker from "./WallpaperMaker";
import VisionBoard from "./VisionBoard";
import MoodTracker from "./MoodTracker";
import SmartPackingList from "./SmartPackingList";
import DailyAffirmations from "./DailyAffirmations";
import ExpenseTracker from "./ExpenseTracker";
import GroceryOrganizer from "./GroceryOrganizer";
import GiftIdeasGenerator from "./GiftIdeasGenerator";
import HabitStreaks from "./HabitStreaks";

/**
 * Register finished tools here: slug -> component.
 * Any slug missing from this map automatically gets the "Coming Soon" card.
 */
export const toolComponents: Record<string, ComponentType> = {
  "skincare-checker": SkincareChecker,
  "water-tracker": WaterTracker,
  "period-calculator": PeriodCalculator,
  "sleep-cycle-calculator": SleepCycleCalculator,
  "aesthetic-pomodoro": AestheticPomodoro,
  "breathing-visualizer": BreathingVisualizer,
  "cute-fonts-generator": CuteFontsGenerator,
  "makeup-expiry-tracker": MakeupExpiryTracker,
  "foundation-matcher": FoundationMatcher,
  "sunscreen-timer": SunscreenTimer,
  "face-shape-analyzer": FaceShapeAnalyzer,
  "hair-porosity-quiz": HairPorosityQuiz,
  "seasonal-color-palette": SeasonalColorPalette,
  "size-converter": SizeConverter,
  "ring-size-measurer": RingSizeMeasurer,
  "capsule-wardrobe-builder": CapsuleWardrobeBuilder,
  "outfit-randomizer": OutfitRandomizer,
  "color-blocking-guide": ColorBlockingGuide,
  "moodboard-creator": MoodboardCreator,
  "insta-grid-maker": InstaGridMaker,
  "photo-filters-guide": PhotoFiltersGuide,
  "wallpaper-maker": WallpaperMaker,
  "vision-board": VisionBoard,
  "mood-tracker": MoodTracker,
  "smart-packing-list": SmartPackingList,
  "daily-affirmations": DailyAffirmations,
  "expense-tracker": ExpenseTracker,
  "grocery-organizer": GroceryOrganizer,
  "gift-ideas-generator": GiftIdeasGenerator,
  "habit-streaks": HabitStreaks,
};
