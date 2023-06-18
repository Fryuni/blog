import type { Site, SocialObjects } from "./types";

export const SITE: Site = {
  website: "https://fryuni-blog.netlify.com/",
  author: "Luiz Ferraz",
  desc: "",
  title: "DitD",
  ogImage: "astropaper-og.jpg",
  lightAndDarkMode: true,
  postPerPage: 4,
};

export const LOCALE = ["en-EN"]; // set to [] to use the environment default

export const LOGO_IMAGE = {
  enable: false,
  svg: true,
  width: 216,
  height: 46,
};

export const SOCIALS: SocialObjects = [
  {
    name: "GitLab",
    href: "https://gitlab.com/Fryuni",
    linkTitle: "Me on GitLab",
    active: true,
  },
  {
    name: "GitHub",
    href: "https://github.com/Fryuni",
    linkTitle: "Me on GitHub",
    active: true,
  },
  {
    name: "LinkedIn",
    href: "https://github.com/satnaing/astro-paper",
    linkTitle: `${SITE.title} on LinkedIn`,
    active: false,
  },
  {
    name: "Discord",
    // Which URL should be here?!?!
    href: "https://discordapp.com/users/fryuni",
    linkTitle: `${SITE.title} on Discord`,
    active: false,
  },
  {
    name: "Reddit",
    href: "https://reddit.com/u/fryuni",
    linkTitle: `${SITE.title} on Reddit`,
    active: true,
  },
  {
    name: "Twitter",
    href: "https://twitter.com/fryuni_",
    linkTitle: `${SITE.title} on Twitter`,
    active: false,
  },
  {
    name: "Mail",
    href: "mailto:luiz@lferraz.com",
    linkTitle: "Send me an email",
    active: true,
  },
];
