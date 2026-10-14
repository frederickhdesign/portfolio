
export type UniversityWorkImage = {
  src: string;
  text?: string;
};

export type UniversityWorkEntry = {
  id: number;
  title: string;
  cover: string;
  description: string;
  images: Array<string | UniversityWorkImage>;
};

export const universityWorkEntries: UniversityWorkEntry[] = [
  {
    id: 1,
    title: "Design System",
    cover: "/universitywork/DS1.webp",
    description: `
For Design System, we created typefaces focused on Delia Derbyshire, the music producer our own art building was named after. We had to come up with designs that reflected her style of music. 

I came up with a typeface constructed out of classic volume meters, my final poster shown below is unique too, mixing the line from an oscilloscope with the typeface itself in the background. The background lines is the words "delia derbyshire" flattened out from my typeface, super cool addition!
`,
    images: [
      "/universitywork/DS1.webp",
    ],
  },

  {
    id: 2,
    title: "Fight Hydrated",
    cover: "/universitywork/FH1.webp",
    description: `
Design Activism was interesting branding project, I was able to finally able to make a project in uni about MMA, so that was certainly a plus.

These 3 posters mainly capture the branding I had in mind, the brand was called Fight Hydrated and was all about raising awareness for brain injury in MMA and other sports too, largely focusing on the side effects of dehydrating for weight cutting.
`,
    images: [
      "/universitywork/FH1.webp",
      "/universitywork/FH2.webp",
      "/universitywork/FH3.webp",
    ],
  },

  {
    id: 3,
    title: "Edible Campus",
    cover: "/universitywork/EC1.webp",
    description: `
This was my first ever Uni Project. We were tasked with creating posters to market Coventry Universitys Edible Campus, a small garden outside the Hub. This was a super open brief, allowing us to choose our style and all, I came up with these 3 posters that can be placed together vertically.
`,
    images: [
      "/universitywork/EC1.webp",
      "/universitywork/EC2.webp",
      "/universitywork/EC3.webp",
    ],
  },

  {
    id: 4,
    title: "Design Narrative",
    cover: "/universitywork/DNPHO1.webp",
    description: `
Design Narrative was a really interesting project, probably my favourite from my second year at uni. I took the text "The Carrier Bag Theory Of Fiction" and was tasked with creating a unique publication for it, you can see what I ended up with below.

We also created websites for this, however I am sadly once again unable to find mine :( it was made in Figma similar to Design Interaction.
`,
    images: [
      "/universitywork/DNBT1.webp",
      "/universitywork/DNBT2.webp",
      "/universitywork/DNBT3.webp",
      "/universitywork/DNBT4.webp",
      "/universitywork/DNBT5.webp",
      "/universitywork/DNBT6.webp",
      "/universitywork/DNBT7.webp",
      "/universitywork/DNBT8.webp",
      "/universitywork/DNOC.webp",
      "/universitywork/DNPHO1.webp",
      "/universitywork/DNPHO2.webp",
      "/universitywork/DNPHO3.webp",
      "/universitywork/DNPQ1.webp",
      "/universitywork/DNPQ2.webp",
      "/universitywork/DNPQ3.webp",
      "/universitywork/DNPQ4.webp",
      "/universitywork/DNPQ5.webp",
      "/universitywork/DNPQ6.webp",
      "/universitywork/DNPQ7.webp",
      "/universitywork/DNPQ9.webp",
    ],
  },

  {
    id: 5,
    title: "Culture Connector",
    cover: "/universitywork/DI1.webp",
    description: `
This was my first ever UI Project, It was an app for finding events in your local area. Whilst it of course wasn't super elaborate given the short project time frame we get, this was all about useability.

You can see most of what I did in the images, however the settings menus I can't find pictures of nor the dark mode version of the app I made. The main inspiration for this app was Eventbrite and other similar apps.

This project was also mostly made in Figma.
`,
    images: [
      "/universitywork/DI1.webp",
      "/universitywork/DI2.webp",
      "/universitywork/DI3.webp",
      "/universitywork/DI4.webp",
      "/universitywork/DI5.webp",
      "/universitywork/DI6.webp",
      "/universitywork/DI7.webp",
      "/universitywork/DI8.webp",
      "/universitywork/DI9.webp",
      "/universitywork/DI10.webp",
      "/universitywork/DI11.webp",
      "/universitywork/DI12.webp",
      "/universitywork/DI13.webp",
    ],
  },

  {
    id: 6,
    title: "Orbit",
    cover: "/universitywork/ORBIT1.webp",
    description: `
This project was largely about learning how to make unique Infographics. We used space travel and trash from satellites and more found in our atmosphere as the topic, as well as the flip side of the work being about the moon landing.

I don't have too much to say about this project in full honesty, it was a while ago and my memory is a little foggy here...
`,
    images: [
      "/universitywork/ORBIT1.webp",
      "/universitywork/ORBIT2.webp",
    ],
  },
];
