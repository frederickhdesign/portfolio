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
    title: "Neon Interface Concept",
    cover: "/foliowork/neon-interface-cover.webp",
    tags: ["UI Design", "Web Design"],
    description:
      "A mock portfolio project entry used as a template. Replace this with your real project description whenever you add your own work.",
    images: [
      "/public/foliowork/neon-interface-1.webp",
      "/public/foliowork/neon-interface-2.webp",
      "/public/foliowork/neon-interface-3.webp",
      "/public/foliowork/neon-interface-4.webp",
    ],
  },
];