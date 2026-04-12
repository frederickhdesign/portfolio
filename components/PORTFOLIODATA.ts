"use client";

export type PortfolioFilter =
  | "ALL"
  | "Graphic Design"
  | "UI Design"
  | "Branding"
  | "Editorial"
  | "Web Design"
  | "Game Design";

export type PortfolioEntry = {
  id: number;
  title: string;
  cover: string;
  tags: PortfolioFilter[];
  description: string;
  images: string[];
};

export const portfolioFilters: PortfolioFilter[] = [
  "ALL",
  "Graphic Design",
  "UI Design",
  "Branding",
  "Editorial",
  "Web Design",
  "Game Design",
];

export const portfolioEntries: PortfolioEntry[] = [
  {
    id: 1,
    title: "Hardened MMA",
    cover: "/foliowork/HMMALOGO.webp",
    tags: ["Branding", "Graphic Design"],
    description: `
There's 2 things I love in this world, Design and Mixed Martial Arts.

HARDENED MMA

Hardened MMA one of my recent projects, still in it's early days. I have hopes of it being something I continue to work with over the years, even if its just for passion on the side.

I've always felt theres a bit less choice in the fight game when it comes to attire, it's plagued me since I started. How can i show up to the gym, and know I've outdressed everyone else there? Priorities right...

So far, I've built the core brand identity with logos, clothing concepts/prints, typography, colour schemes, styles and more. Watching HMMA grow step by step was extremely rewarding, especially when I got to recieve my first proper clothing samples.

WHAT HAVE I LEARNT

Building Hardened MMA forced me to ask a lot of new questions, not just about design, but about business, purpose and identity. How do you build something true to your vision that someone would actually want? How do i balance creative freedom with commercial reality? Profit and authenticity? And so on.

The process has been short however eye opening to me, it has helped me learn about an area of being a designer that I had never considered before this project. I look forward to developing the brand further, especially working on the website with my new UI Design direction.
`,
    images: [
      "/foliowork/HMMACOLOURS.webp",
      "/foliowork/HMMALOGO.webp",
      "/foliowork/HMMATYPELOGO.webp",
      "/foliowork/HMMADIVLOGO.webp",
      "/foliowork/MENTALITYPF.webp",
      "/foliowork/HMMA Prints.webp",
    ],
  },
];