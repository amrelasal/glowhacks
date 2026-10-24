export type Category =
  | "Skincare & Beauty"
  | "Fashion & Style"
  | "Design & Social Media"
  | "Health & Wellness"
  | "Life & Organization";

export interface Tool {
  id: number;
  slug: string;
  name: string;
  description: string;
  category: Category;
  /** Key into the icon map in components/ToolIcon.tsx */
  icon: string;
  /** true = fully built, false = "Coming Soon" placeholder */
  ready: boolean;
}

export const categories: Category[] = [
  "Skincare & Beauty",
  "Fashion & Style",
  "Design & Social Media",
  "Health & Wellness",
  "Life & Organization",
];

/** Full Tailwind class strings (kept static so Tailwind can detect them). */
export const categoryStyles: Record<Category, { tag: string; iconBg: string }> = {
  "Skincare & Beauty": { tag: "bg-glow-pink/30 text-rose-700", iconBg: "bg-glow-pink/40" },
  "Fashion & Style": { tag: "bg-glow-peach text-orange-800", iconBg: "bg-glow-peach" },
  "Design & Social Media": { tag: "bg-glow-mint/60 text-teal-800", iconBg: "bg-glow-mint/70" },
  "Health & Wellness": { tag: "bg-sky-100 text-sky-800", iconBg: "bg-sky-100" },
  "Life & Organization": { tag: "bg-amber-100 text-amber-800", iconBg: "bg-amber-100" },
};

export const tools: Tool[] = [
  // Skincare & Beauty
  { id: 1, slug: "skincare-checker", name: "Skincare Checker", description: "Paste an ingredient list to detect harsh chemicals like drying alcohol and parabens.", category: "Skincare & Beauty", icon: "FlaskConical", ready: true },
  { id: 2, slug: "makeup-expiry-tracker", name: "Makeup Expiry Tracker", description: "Calculate expiration dates from the PAO (Period After Opening) symbol.", category: "Skincare & Beauty", icon: "CalendarClock", ready: true },
  { id: 3, slug: "foundation-matcher", name: "Foundation Matcher", description: "Get foundation shade suggestions based on your skin tone hex code.", category: "Skincare & Beauty", icon: "Pipette", ready: true },
  { id: 4, slug: "sunscreen-timer", name: "Sunscreen Timer", description: "A countdown timer that reminds you when to reapply your SPF.", category: "Skincare & Beauty", icon: "SunMedium", ready: true },
  { id: 5, slug: "face-shape-analyzer", name: "Face Shape Analyzer", description: "A guide to find your face shape and the haircuts that flatter it.", category: "Skincare & Beauty", icon: "ScanFace", ready: true },
  { id: 6, slug: "hair-porosity-quiz", name: "Hair Porosity Quiz", description: "Answer a few questions to learn your hair porosity and get routine ideas.", category: "Skincare & Beauty", icon: "Droplets", ready: true },

  // Fashion & Style
  { id: 7, slug: "seasonal-color-palette", name: "Seasonal Color Palette", description: "Find the clothing colors that suit your skin and hair tone.", category: "Fashion & Style", icon: "Palette", ready: true },
  { id: 8, slug: "size-converter", name: "Size Converter", description: "Convert clothing and shoe sizes between US, UK, and EU.", category: "Fashion & Style", icon: "ArrowLeftRight", ready: true },
  { id: 9, slug: "ring-size-measurer", name: "Ring Size Measurer", description: "An on-screen visual guide to finding your ring size.", category: "Fashion & Style", icon: "Ruler", ready: true },
  { id: 10, slug: "capsule-wardrobe-builder", name: "Capsule Wardrobe Builder", description: "A drag-and-drop planner for your essential clothing pieces.", category: "Fashion & Style", icon: "Shirt", ready: true },
  { id: 11, slug: "outfit-randomizer", name: "Outfit Randomizer", description: "Spin the wheel to get outfit ideas from your own wardrobe list.", category: "Fashion & Style", icon: "Shuffle", ready: true },
  { id: 12, slug: "color-blocking-guide", name: "Color Blocking Guide", description: "An interactive color wheel for bold fashion combinations.", category: "Fashion & Style", icon: "Layers", ready: true },

  // Design & Social Media
  { id: 13, slug: "moodboard-creator", name: "Moodboard Creator", description: "A simple canvas to arrange aesthetic images and colors.", category: "Design & Social Media", icon: "Images", ready: true },
  { id: 14, slug: "insta-grid-maker", name: "Insta Grid Maker", description: "Plan your Instagram feed with a virtual 9-square grid.", category: "Design & Social Media", icon: "LayoutGrid", ready: true },
  { id: 15, slug: "cute-fonts-generator", name: "Cute Fonts Generator", description: "Turn plain text into aesthetic Unicode fonts for your bio.", category: "Design & Social Media", icon: "Type", ready: true },
  { id: 16, slug: "photo-filters-guide", name: "Photo Filters Guide", description: "Preview CSS-based photo filters and learn how each one looks.", category: "Design & Social Media", icon: "SlidersHorizontal", ready: true },
  { id: 17, slug: "wallpaper-maker", name: "Wallpaper Maker", description: "Generate aesthetic pattern wallpapers from emojis and colors.", category: "Design & Social Media", icon: "Smartphone", ready: true },
  { id: 18, slug: "vision-board", name: "Vision Board", description: "A digital board for visual goal-setting.", category: "Design & Social Media", icon: "Target", ready: true },

  // Health & Wellness
  { id: 19, slug: "period-calculator", name: "Period Calculator", description: "Track your cycle and predict periods, saved privately on your device.", category: "Health & Wellness", icon: "CalendarHeart", ready: true },
  { id: 20, slug: "sleep-cycle-calculator", name: "Sleep Cycle Calculator", description: "Find the best wake-up times using 90-minute sleep cycles.", category: "Health & Wellness", icon: "Moon", ready: true },
  { id: 21, slug: "water-tracker", name: "Water Tracker", description: "Work out your daily hydration goal from your body weight and track every glass.", category: "Health & Wellness", icon: "GlassWater", ready: true },
  { id: 22, slug: "aesthetic-pomodoro", name: "Aesthetic Pomodoro", description: "A calming 25-minute focus timer for studying and working.", category: "Health & Wellness", icon: "Timer", ready: true },
  { id: 23, slug: "breathing-visualizer", name: "Breathing Visualizer", description: "An expanding and contracting animation for deep breathing.", category: "Health & Wellness", icon: "Wind", ready: true },
  { id: 24, slug: "mood-tracker", name: "Mood Tracker", description: "A pixel grid to log your daily moods over the year.", category: "Health & Wellness", icon: "Smile", ready: true },

  // Life & Organization
  { id: 25, slug: "smart-packing-list", name: "Smart Packing List", description: "Generate a travel checklist based on your destination and trip length.", category: "Life & Organization", icon: "Luggage", ready: true },
  { id: 26, slug: "daily-affirmations", name: "Daily Affirmations", description: "Random aesthetic quotes that are ready to share.", category: "Life & Organization", icon: "Quote", ready: true },
  { id: 27, slug: "expense-tracker", name: "Expense Tracker", description: "A quick calculator for shopping budgets and sale discounts.", category: "Life & Organization", icon: "Wallet", ready: true },
  { id: 28, slug: "grocery-organizer", name: "Grocery Organizer", description: "Sort your shopping list by supermarket aisle.", category: "Life & Organization", icon: "ShoppingBasket", ready: true },
  { id: 29, slug: "gift-ideas-generator", name: "Gift Ideas Generator", description: "Get gift suggestions based on budget and interests.", category: "Life & Organization", icon: "Gift", ready: true },
  { id: 30, slug: "habit-streaks", name: "Habit Streaks", description: "A simple visual grid to track your daily habits.", category: "Life & Organization", icon: "Flame", ready: true },
];

export const getToolBySlug = (slug: string) => tools.find((t) => t.slug === slug);

export const getRelatedTools = (tool: Tool, count = 3) =>
  tools.filter((t) => t.category === tool.category && t.slug !== tool.slug).slice(0, count);
