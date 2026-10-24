import type { Category, Tool } from "./toolsData";

export interface ArticleSection {
  heading: string;
  paragraphs?: string[];
  list?: string[];
}

const CATEGORY_COPY: Record<Category, { why: string; tips: string[] }> = {
  "Skincare & Beauty": {
    why: "Great skin and a confident beauty routine start with good information. Product labels can be confusing, expiry dates are easy to forget, and shade or shape guides are often hidden behind sign-ups. Tools like this one turn complicated beauty knowledge into simple answers you can act on immediately, so you can protect your skin, your budget, and your time.",
    tips: [
      "Patch-test any new product on a small area before using it on your face.",
      "Introduce one new product at a time so you can see exactly what works for you.",
      "Sunscreen is the single most effective everyday step for healthy-looking skin.",
    ],
  },
  "Fashion & Style": {
    why: "Style is personal, but it helps to have a framework. Knowing your best colors, your correct sizes, and the pieces you actually wear makes getting dressed faster and shopping far more intentional. A good style tool removes the guesswork and lets your own taste take center stage, whether you are refreshing your closet or building it from scratch.",
    tips: [
      "Build outfits around a handful of colors that you love and that flatter you.",
      "Fit and quality matter more than chasing every passing trend.",
      "Review what you already own before buying something new.",
    ],
  },
  "Design & Social Media": {
    why: "A cohesive look is what makes a feed, a bio, or a phone screen feel curated instead of random. Planning your visuals ahead of time helps you spot what works before you post, saves hours of trial and error, and keeps your creative identity consistent. These tools give you a quick sandbox for ideas without any heavy design software.",
    tips: [
      "Pick a small palette of two to four colors for a cohesive look.",
      "Consistency in tone, spacing, and style makes any feed feel intentional.",
      "Save inspiration often, then edit ruthlessly to keep only the best.",
    ],
  },
  "Health & Wellness": {
    why: "Wellness is built from small habits repeated over time. Tracking things like water, sleep, mood, or your cycle builds awareness, and awareness is what makes healthy choices easier. A simple tracker takes the mental load off your shoulders so you can notice patterns, celebrate progress, and feel more in tune with your body and mind.",
    tips: [
      "Consistency beats intensity: small daily actions add up quickly.",
      "Listen to your body, and speak with a healthcare professional about any medical concerns.",
      "Attach a new habit to something you already do every day.",
    ],
  },
  "Life & Organization": {
    why: "A little organization goes a long way. Writing plans down, setting budgets, and breaking big tasks into simple lists frees up mental space for the things you actually enjoy. These everyday helpers are designed to be quick to open and easy to finish, so staying on top of life never feels like another chore.",
    tips: [
      "Plan ahead and write things down so your brain does not have to remember everything.",
      "Review your lists weekly to keep them short and realistic.",
      "Set a simple budget before you start shopping, not after.",
    ],
  },
};

export function buildArticle(tool: Tool): ArticleSection[] {
  const copy = CATEGORY_COPY[tool.category];
  const n = tool.name;

  return [
    {
      heading: `What is the ${n}?`,
      paragraphs: [
        `The ${n} is a free online tool from GlowHacks, designed to make everyday routines a little easier and a lot prettier. In short: ${tool.description} There is nothing to download, no account to create, and no payment details to enter. Open the page, use the tool, and get on with your day.`,
      ],
    },
    {
      heading: "Why it helps",
      paragraphs: [
        copy.why,
        `Instead of searching through long articles or juggling several apps, the ${n} gives you a focused, distraction-free space for one job. That focus saves time, reduces guesswork, and helps you make choices that feel confident rather than rushed.`,
      ],
    },
    {
      heading: "How to get the most out of it",
      list: [
        "Start with honest inputs. The more accurate the details you enter, the more useful the result will be.",
        "Treat the result as a starting point. Every person is different, so adjust suggestions to your own preferences, lifestyle, and comfort.",
        "Come back regularly. Small, consistent habits usually beat one-off efforts, and the tool is always here when you need it.",
        "Save or screenshot your favorite results so you can refer back to them later.",
      ],
    },
    {
      heading: "Private by design",
      paragraphs: [
        `Your privacy matters. The ${n} runs 100% in your browser, which means what you type stays on your device. GlowHacks has no server that processes your entries, and no personal information is sent anywhere. When a tool remembers your progress, it uses your browser's local storage, and you can erase that data at any time by clearing your site data or using the reset options inside the tool.`,
      ],
    },
    {
      heading: "Quick tips",
      list: copy.tips,
    },
    {
      heading: "Final thoughts",
      paragraphs: [
        `The ${n} is just one of thirty free tools in the GlowHacks collection, covering skincare, fashion, design, wellness, and everyday organization. Explore the rest of the toolkit, bookmark your favorites, and make your routines feel a little more glowing. New tools are being added all the time, so check back soon.`,
      ],
    },
  ];
}
