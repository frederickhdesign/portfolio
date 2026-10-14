
export type CollegeWorkEntry = {
  title: string;
  description: string;
  images: string[];
  pdf: string;
};

export const collegeWork: CollegeWorkEntry = {
  title: "FEAR",

  description: `
  I only did one big project throughout college, this was my end result. I've accumulated my favourite pages for this little preview however this was a very deep 200+ page exploration on Horror and video games, great to look through and marks the start of my design journey, do feel free to download and have a look!
  `,

  images: [
    "/collegework/Page 1.png",
    "/collegework/Page 2.png",
    "/collegework/Page 3.png",
    "/collegework/Page 4.png",
    "/collegework/Page 5.png",
    "/collegework/Page 6.png",
    "/collegework/Page 7.png",
    "/collegework/Page 8.png",
  ],

  pdf: "/collegework/FEARFULL.pdf",
};
