import {
  ArrowLeftRight, CalendarClock, CalendarHeart, Droplets, FlaskConical, Flame, Gift,
  GlassWater, Images, Layers, LayoutGrid, Luggage, Moon, Palette, Pipette, Quote,
  Ruler, ScanFace, Shirt, Shuffle, SlidersHorizontal, Smartphone, Smile, Sparkles,
  SunMedium, Target, Timer, Type, Wallet, Wind, ShoppingBasket,
  type LucideIcon,
} from "lucide-react";

const icons: Record<string, LucideIcon> = {
  ArrowLeftRight, CalendarClock, CalendarHeart, Droplets, FlaskConical, Flame, Gift,
  GlassWater, Images, Layers, LayoutGrid, Luggage, Moon, Palette, Pipette, Quote,
  Ruler, ScanFace, Shirt, Shuffle, SlidersHorizontal, Smartphone, Smile, Sparkles,
  SunMedium, Target, Timer, Type, Wallet, Wind, ShoppingBasket,
};

export default function ToolIcon({ name, className }: { name: string; className?: string }) {
  const Icon = icons[name] ?? Sparkles;
  return <Icon className={className} aria-hidden />;
}
