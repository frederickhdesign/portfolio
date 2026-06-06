"use client";

export type PortfolioFilter =
  | "ALL"
  | "Graphic Design"
  | "UI Design"
  | "Branding"
  | "Editorial"
  | "Web Design"
  | "Game Design"
  | "Typography";


export type PortfolioEntry = {
  id: number;
  title: string;
  cover: string;
  tags: PortfolioFilter[];
  description: string;
  images: string[];
  video?: string;
};

export const portfolioFilters: PortfolioFilter[] = [
  "ALL",
  "Graphic Design",
  "UI Design",
  "Branding",
  "Editorial",
  "Web Design",
  "Game Design",
  "Typography",
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

Hardened MMA is built up of 2 main lines. Fightwear, being the standard Hardened MMA, and streetwear, being Hardened Division. I've not made much work on the fightwear yet, however I've made many hoodies and shirts for streetwear, including selling to friends and family.

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
  {
    id: 2,
    title: "Original Magazine - Digital Consciousness",
    cover: "/foliowork/PROFCOVER.webp",
    tags: ["Graphic Design", "UI Design"],
    description: `
In my second year of university, we had a Design Profession module, where I was placed in a team with my 2 classmates, Harry and Cara.

Our client for this module was a magazine called Original Magazine, and our brief was "Maschine". The brief was, well... brief, we basically got told to make something about machines/AI in any format.

Our team chose to create a projection installation, consisting of a typeface, projection visual and an editorial.

MY TASK

I was in charge of creating the primary visual for this projection. I built the visual around the theme of an AI mind, analysing different sets of footage and gathering data. This was because we chose to make our installation about presenting AI in an ominous manner, bringing light to the danger and self awareness AI actually has these days, and the dangers that poses.

The visual was made of 3 main, square screens. Unfortunately we didn't get a chance to put this installation together physically before the end of the semester, but I worked too hard on the visual to not include it here.

WHAT DID I LEARN

This module really pushed me to learn new things. In particular, Adobe After Effects. I had been dreading trying out After Effects before this module, I had never tried it much before and I had a lot of self doubt toward whether I'd be able to put together something good enough for the final project. Fortunately I was,  and in the process I learnt a lot about motion design and After Effects.
`,
    images: [
      "/foliowork/MIDSCRN.webp",
      "/foliowork/LEFTSCRN.webp",
      "/foliowork/RIGHTSCRN.webp"
    ],
    video: "https://www.youtube.com/embed/zdSEodcigww",
  },
  {
    id: 3,
    title: "Glixels - Typeface",
    cover: "/foliowork/GLIXCOVER.webp",
    tags: ["Graphic Design", "Branding", "Typography"],
    description: `
 When creating this portfolio I wanted to create an entirely bespoke visual, from style and ideas to the very letters you read when scanning through.

 As this portfolio is personal to me, I figured the most fitting style not only visually but narratively was a pixel typeface, designed by myself as I started my own design journey through the magic of pixel art.

 Through this, I came to my very own typeface, Glixels. Constructed in aseprite, with only one weight (currently), I feel it's a strong pixel typeface, balancing being aesthetically pleasing with being legible.
`,
    images: [
      "/foliowork/GLIXCOVER.webp", 
      "/foliowork/GLIXLETTERS.webp", 
    ],
  },
  {
    id: 4,
    title: "Old Dirty - Typeface",
    cover: "/foliowork/ODCOVER.webp",
    tags: ["Graphic Design", "Branding", "Typography"],
    description: `
I don't take on client projects too often, however I'm working on expanding my presence and gaining more clients within the near future. 

For my first proper client work, I was put in contact with the brand Old Dirty, oldirtyyy on Instagram. 

They wanted me to construct a typeface inspired by that of the typography seen on an old flyer from in the 1970's. This fitted their brand image and we worked together closely to bring the typeface to life exactly as envisioned.

The final result was a unique, bespoke typeface curated specifically for the brand of Old Dirty.
`,
    images: [
      "/foliowork/ODCOVER.webp",
      "/foliowork/ODLETTERS.webp",
    ],
  },
];