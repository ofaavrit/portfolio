// ─────────────────────────────────────────────────────────────────────────────
// AAVRIT — initial content, imported from the owner's PDF ("A.pdf").
// Voice preserved; only obvious spelling/grammar fixed. Unclear sentences are
// kept close to the original and listed on the unpublished "Editorial notes"
// page so they can be reworded later from the admin panel.
// ─────────────────────────────────────────────────────────────────────────────
import type { BlockType, BlockStyle } from "./types";
import { defaultBlockStyle } from "./types";

type BlockSeed = { type: BlockType; content: unknown; style?: Partial<BlockStyle> };

const st = (over: Partial<BlockStyle> = {}): BlockStyle => ({ ...defaultBlockStyle, ...over });

export const EDITORIAL_NOTES = [
  "Interests page — “I like to share, but only with those.” The PDF sentence stops here. Kept as-is; reword when Aavrit confirms the ending.",
  "Achievements — the PDF lists a card “Since this year” next to “Shared with friends”. Its full meaning is unclear, so it was left out. Add it back with the missing text.",
  "PDF page 5 says “I don'y have much complains with it” — corrected to “I don't have many complaints with it.”",
  "PDF page 9 says “To learn more about ut” — likely “about it”. Not shown publicly; nothing depended on it.",
  "Website URLs for eSyllabus, Logic365, Question Paper Generator, Y2Cheat and Friend or Trend? are not in the PDF — add real links from the admin Projects section when ready.",
];

export const seedPages: {
  slug: string;
  title: string;
  kind: "SYSTEM" | "STORY";
  position: number;
  accent: string;
  published: boolean;
  seoTitle?: string;
  seoDescription?: string;
  blocks: BlockSeed[];
}[] = [
  // ── HOME ──────────────────────────────────────────────────────────────────
  {
    slug: "",
    title: "Home",
    kind: "SYSTEM",
    position: 0,
    accent: "pink",
    published: true,
    seoTitle: "AAVRIT — Aavrit Gupta, an interactive autobiography",
    seoDescription:
      "The story of Aavrit Gupta: a grade-10 CBSE student who builds websites with AI. Interests, hobbies, the digital journey, six websites and the ARCT dream project.",
    blocks: [
      {
        type: "hero",
        content: {
          kicker: "AN INTERACTIVE AUTOBIOGRAPHY",
          titleLines: ["AAVRIT"],
          subtitle:
            "The story of Aavrit Gupta — a grade-10 CBSE student from Nepal who collects interests, hobbies, websites and captured thoughts.",
          meta: "GRADE 10 · CBSE · NEPAL · EST. ONLINE 2023",
          note: "the story is told in color",
        },
      },
      {
        type: "marquee",
        content: {
          items: [
            "AAVRIT",
            "GRADE 10 · CBSE",
            "NEPAL",
            "MANY WEBSITES LIVE",
            "BE SOCIALLY UNIQ",
            "ARCT",
            "NOT VIA BOOKS",
          ],
          tone: "ink",
          speed: "normal",
        },
      },
      {
        type: "cta",
        content: {
          title: "Nine chapters, one story.",
          body: "Start at the beginning — or jump straight to the websites.",
          actionLabel: "Start the story",
          actionHref: "/about",
          secondaryLabel: "See the websites",
          secondaryHref: "/websites",
          tone: "pink",
        },
      },
    ],
  },
  // ── ABOUT / EDUCATION ─────────────────────────────────────────────────────
  {
    slug: "about",
    title: "About",
    kind: "STORY",
    position: 1,
    accent: "lilac",
    published: true,
    seoTitle: "About & education — AAVRIT",
    seoDescription:
      "Aavrit Gupta is a grade-10 CBSE student: strong in Maths, Computer and Hindi, honest about the rest.",
    blocks: [
      {
        type: "text",
        content: {
          title: "About Me",
          lead: "Currently in grade 10, in the CBSE curriculum. An average student — with no complaints about it.",
          body: "The favourite subjects and the difficult ones — the honest scoreboard of grade 10.",
          note: "an average student, no complaints with it",
        },
        style: st({ bgTheme: "paper" }),
      },
      {
        type: "stats",
        content: {
          title: "Favourite subjects",
          items: [
            { value: "MATHS", label: "favourite subject", accent: "yellow" },
            { value: "COMPUTER", label: "favourite subject", accent: "cyan" },
            { value: "HINDI", label: "favourite subject", accent: "lime" },
          ],
        },
      },
      {
        type: "text",
        content: {
          title: "…and the honest part",
          lead: "Science (Chemistry & Biology) and English are where I struggle the most.",
          body: "Just the truth. Every colorful page on this site is built by a perfectly average student.",
        },
        style: st({ bgTheme: "ink", padding: "md" }),
      },
      {
        type: "marquee",
        content: {
          items: ["LEARN", "MAKE MISTAKES", "LEARN AGAIN", "SLEEP PEACEFULLY"],
          tone: "yellow",
          speed: "slow",
        },
      },
      {
        type: "richText",
        content: {
          title: "ABOUT ME — THE HONEST PART",
          html: "<p>My name is Aavrit Gupta. As a student, and as a human, I have made many mistakes — I make mistakes very often, but I also learn from them. I regret my actions, and I have to explain to myself that it was fine, to sleep peacefully.</p><p>I have also missed many things, and sometimes I do feel jealous of the life of other beings. I have faced many problems, and I have a fear of losing people. I think I am not very social, nor very interesting for some.</p><p>I try to love myself, and live peacefully.</p>",
        },
        style: st({ bgTheme: "navy", padding: "lg", animation: "subtle" }),
      },
      {
        type: "cta",
        content: {
          title: "Next: what I actually care about.",
          actionLabel: "Interests →",
          actionHref: "/interests",
          tone: "lilac",
        },
      },
    ],
  },
  // ── INTERESTS ─────────────────────────────────────────────────────────────
  {
    slug: "interests",
    title: "Interests",
    kind: "STORY",
    position: 2,
    accent: "pink",
    published: true,
    seoTitle: "Interests — AAVRIT",
    seoDescription:
      "Outdoor games with equality, fun together, sharing with the right people — Aavrit's interests in big colorful type.",
    blocks: [
      {
        type: "text",
        content: {
          title: "Interests",
          lead: "The three things that matter most to me.",
          body: "Some things matter more than subjects. These are mine.",
          scrapbook: true,
        },
      },
      {
        type: "quote",
        content: {
          text: "I love playing outdoor games — but only with equality.",
        },
        style: st({ bgTheme: "lime" }),
      },
      {
        type: "quote",
        content: {
          text: "I love having fun together.",
        },
        style: st({ bgTheme: "cyan", align: "center" }),
      },
      {
        type: "quote",
        content: {
          text: "I like to share — but only with those.",
        },
        style: st({ bgTheme: "yellow" }),
      },
      {
        type: "marquee",
        content: { items: ["EQUALITY", "FUN", "TOGETHER", "SHARING"], tone: "pink", speed: "fast" },
      },
      {
        type: "cta",
        content: {
          title: "Next: how the free time disappears.",
          actionLabel: "Hobbies →",
          actionHref: "/hobbies",
          tone: "orange",
        },
      },
    ],
  },
  // ── HOBBIES ───────────────────────────────────────────────────────────────
  {
    slug: "hobbies",
    title: "Hobbies",
    kind: "STORY",
    position: 3,
    accent: "orange",
    published: true,
    seoTitle: "Hobbies — AAVRIT",
    seoDescription:
      "Exploring the internet, TV shows and videos, learning outside books, and music (which may be dangerous).",
    blocks: [
      {
        type: "text",
        content: {
          title: "Hobbies",
          lead: "High energy, low budget, maximum curiosity.",
          body: "Four things that eat my free time — and one that might be dangerous.",
          scrapbook: true,
        },
        style: st({ bgTheme: "cream" }),
      },
      {
        type: "stats",
        content: {
          items: [
            {
              value: "EXPLORE",
              label: "the internet — my default place",
              note: "during my time",
              accent: "orange",
            },
            {
              value: "WATCH",
              label: "TV shows and videos",
              note: "also during my time",
              accent: "cyan",
            },
            {
              value: "LEARN",
              label: "spending time on learning — but not via books",
              accent: "lime",
            },
            {
              value: "LISTEN",
              label: "music… but maybe it's dangerous",
              accent: "pink",
            },
          ],
        },
      },
      {
        type: "quote",
        content: {
          text: "I do like to spend my time on learning — but not via books.",
        },
        style: st({ bgTheme: "ink", align: "center" }),
      },
      {
        type: "coloredSection",
        content: { tone: "yellow", word: "FUN!!", doodle: "spark" },
        style: st({ padding: "sm" }),
      },
      {
        type: "cta",
        content: {
          title: "Next: how the internet found me.",
          actionLabel: "The digital world →",
          actionHref: "/digital-world",
          tone: "cyan",
        },
      },
    ],
  },
  // ── DIGITAL WORLD ─────────────────────────────────────────────────────────
  {
    slug: "digital-world",
    title: "Digital World",
    kind: "STORY",
    position: 4,
    accent: "cyan",
    published: true,
    seoTitle: "Introduction to the digital world — AAVRIT",
    seoDescription:
      "Class 8: first social account, first laptop, video editing, YouTube. Class 9 & 10: building websites with AI on free hosting.",
    blocks: [
      {
        type: "text",
        content: {
          title: "Introduction to the digital world",
          lead: "Two eras: the account, and the AI.",
          body: "From the first social account to websites live on free hosting.",
        },
      },
      {
        type: "timeline",
        content: {
          intro: "Two eras of one journey",
          eras: [
            {
              label: "CLASS 8",
              title: "The first account & the first laptop",
              accent: "cyan",
              items: [
                "I created my social media account when I reached 13.",
                "This was the time I got a laptop.",
                "I was interested in video editing — but couldn't become a professional one.",
                "I did post videos on YouTube, but it was just my friends who got up some views.",
              ],
            },
            {
              label: "CLASS 9 & 10",
              title: "Websites, built with AI",
              accent: "pink",
              items: [
                "I started creating web pages using AI. The more I prompted, the more I learned.",
                "Soon I had many websites live on free hosting.",
                "I still create using AI — the main problem is a lack of resources.",
                "But I don't have many complaints with it. Maybe I could learn a lot because of less resources — and I will continue to.",
              ],
            },
          ],
        },
      },
      {
        type: "richText",
        content: {
          title: "THE CLASS 9 & 10 COLUMN, TYPED OUT",
          html: "<p>I started creating web pages using AI. The more I prompted, the more I learned. Soon I had many websites live with free hosting.</p><p>I still create using AI, but the main problem is lack of resources. I don't have many complaints with it — maybe I could learn a lot because of less resources, and I will continue to.</p>",
          typewriter: true,
          voice: "typewriter",
        },
        style: st({ bgTheme: "cream", animation: "subtle" }),
      },
      {
        type: "quote",
        content: { text: "The more I prompted, the more I learned." },
        style: st({ bgTheme: "accent", align: "center" }),
      },
      {
        type: "cta",
        content: {
          title: "Next: the websites themselves.",
          actionLabel: "Find my websites →",
          actionHref: "/websites",
          tone: "pink",
        },
      },
    ],
  },
  // ── WEBSITES ──────────────────────────────────────────────────────────────
  {
    slug: "websites",
    title: "Websites",
    kind: "STORY",
    position: 5,
    accent: "lime",
    published: true,
    seoTitle: "Websites — AAVRIT",
    seoDescription:
      "eSyllabus, Logic365, Question Paper Generator, Y2Cheat, Friend or Trend? — websites built with AI by Aavrit Gupta.",
    blocks: [
      {
        type: "text",
        content: {
          title: "Find my websites",
          lead: "Let me share the names.",
          body: "Every site below was built by prompting AI, learning, and free hosting. Tap a card for the story behind it.",
          note: "and many more…",
          scrapbook: true,
        },
      },
      {
        type: "projectGrid",
        content: { filter: "all" },
      },
      {
        type: "cta",
        content: {
          title: "One of these is a dream, not just a site.",
          actionLabel: "Meet ARCT →",
          actionHref: "/projects/arct",
          tone: "lilac",
        },
      },
    ],
  },
  // ── ACHIEVEMENTS ──────────────────────────────────────────────────────────
  {
    slug: "achievements",
    title: "Achievements",
    kind: "STORY",
    position: 6,
    accent: "yellow",
    published: true,
    seoTitle: "What I've done — AAVRIT",
    seoDescription:
      "More than 3 years of online experience, 100+ AI chats, websites shipped on free hosting — the honest scoreboard.",
    blocks: [
      {
        type: "text",
        content: {
          title: "What I've done",
          lead: "The honest scoreboard — and it keeps growing.",
          body: "What I have actually done online so far.",
        },
      },
      {
        type: "stats",
        content: {
          items: [
            {
              value: "3+ YEARS",
              label: "of online experience",
              accent: "cyan",
            },
            {
              value: "100+",
              label: "AI chats that taught me something",
              accent: "pink",
            },
            {
              value: "MANY",
              label: "websites live on free hosting",
              accent: "lime",
            },
            {
              value: "SHARED",
              label: "my work with online friends",
              accent: "yellow",
            },
          ],
        },
      },
      {
        type: "quote",
        content: {
          text: "Maybe I could learn a lot because of less resources — and I will continue to.",
          attribution: "Aavrit, on free hosting",
        },
        style: st({ bgTheme: "navy" }),
      },
      {
        type: "cta",
        content: {
          title: "This ends the story — your turn.",
          actionLabel: "Contact →",
          actionHref: "/contact",
          tone: "accent",
        },
      },
    ],
  },
  // ── CONTACT (final page of the story) ─────────────────────────────────────
  {
    slug: "contact",
    title: "Contact",
    kind: "SYSTEM",
    position: 7,
    accent: "accent",
    published: true,
    seoTitle: "Contact — AAVRIT",
    seoDescription: "Say hi to Aavrit Gupta — messages land straight in the private admin inbox.",
    blocks: [
      {
        type: "contact",
        content: {
          title: "Say hi.",
          body: "This is the last page of the story — but it can be the start of a conversation. Tell me what you think of the sites, share an idea, or just say hello. Messages land directly in my private inbox.",
          showSocials: true,
        },
      },
    ],
  },
];

export interface ProjectSeed {
  slug: string;
  title: string;
  shortDescription: string;
  longDescription: string | null;
  url: string | null;
  category: string;
  status: "DRAFT" | "PUBLISHED";
  featured: boolean;
  year: string | null;
  role: string | null;
  tools: string[];
  accent: string;
  thumbnailKey: string; // filename key of a seeded MediaAsset
  position: number;
  blocks: BlockSeed[];
}

export const seedProjects: ProjectSeed[] = [
  {
    slug: "esyllabus",
    title: "eSyllabus",
    shortDescription: "One of Aavrit’s websites, live on free hosting.",
    longDescription:
      "One of my websites — built by prompting AI, learned by doing, shipped on free hosting.",
    url: null,
    category: "Study tool",
    status: "PUBLISHED",
    featured: false,
    year: "Class 9–10",
    role: "Creator",
    tools: ["AI prompting", "Free hosting"],
    accent: "cyan",
    thumbnailKey: "thumb-esyllabus.jpg",
    position: 1,
    blocks: [
      {
        type: "text",
        content: {
          title: "The story",
          lead: "The full story is coming soon.",
          body: "What it does, who it's for, and what happened after launch — the full case study is on its way.",
        },
      },
      {
        type: "stats",
        content: {
          items: [
            { value: "PROMPTED", label: "into existence, chat by chat", accent: "cyan" },
            { value: "FREE", label: "hosted, like everything I ship", accent: "lime" },
          ],
        },
      },
    ],
  },
  {
    slug: "logic365",
    title: "Logic365",
    shortDescription: "One of Aavrit’s websites, live on free hosting.",
    longDescription:
      "One of my websites — built by prompting AI, learned by doing, shipped on free hosting.",
    url: null,
    category: "Study tool",
    status: "PUBLISHED",
    featured: false,
    year: "Class 9–10",
    role: "Creator",
    tools: ["AI prompting", "Free hosting"],
    accent: "lilac",
    thumbnailKey: "thumb-logic365.jpg",
    position: 2,
    blocks: [
      {
        type: "text",
        content: {
          title: "The story",
          lead: "The full story is coming soon.",
          body: "I built this one by prompting AI and learning as I went. The full case study is on its way.",
        },
      },
    ],
  },
  {
    slug: "question-paper-generator",
    title: "Question Paper Generator",
    shortDescription: "One of Aavrit’s websites, live on free hosting.",
    longDescription:
      "One of my websites — built by prompting AI, learned by doing, shipped on free hosting.",
    url: null,
    category: "Study tool",
    status: "PUBLISHED",
    featured: false,
    year: "Class 9–10",
    role: "Creator",
    tools: ["AI prompting", "Free hosting"],
    accent: "yellow",
    thumbnailKey: "thumb-qpg.jpg",
    position: 3,
    blocks: [
      {
        type: "text",
        content: {
          title: "The story",
          lead: "The full story is coming soon.",
          body: "I built this one by prompting AI and learning as I went. The full case study is on its way.",
        },
      },
    ],
  },
  {
    slug: "y2cheat",
    title: "Y2Cheat",
    shortDescription: "One of Aavrit’s websites, live on free hosting.",
    longDescription:
      "One of my websites — built by prompting AI, learned by doing, shipped on free hosting.",
    url: null,
    category: "Study tool",
    status: "PUBLISHED",
    featured: false,
    year: "Class 9–10",
    role: "Creator",
    tools: ["AI prompting", "Free hosting"],
    accent: "orange",
    thumbnailKey: "thumb-y2cheat.jpg",
    position: 4,
    blocks: [
      {
        type: "text",
        content: {
          title: "The story",
          lead: "The full story is coming soon.",
          body: "I built this one by prompting AI and learning as I went. The full case study is on its way.",
        },
      },
    ],
  },
  {
    slug: "friend-or-trend",
    title: "Friend or Trend?",
    shortDescription: "A web experiment by Aavrit.",
    longDescription:
      "Made for fun, shared with friends — one of the websites I shipped while learning.",
    url: null,
    category: "Experiment",
    status: "PUBLISHED",
    featured: false,
    year: "Class 9–10",
    role: "Creator",
    tools: ["AI prompting", "Free hosting"],
    accent: "pink",
    thumbnailKey: "thumb-friendortrend.jpg",
    position: 5,
    blocks: [
      {
        type: "text",
        content: {
          title: "The story",
          lead: "Made for fun, shared with friends.",
          body: "Built for my friends, used by my friends. The full case study is on its way.",
        },
      },
    ],
  },
  {
    slug: "arct",
    title: "ARCT",
    shortDescription: "Reflection Captured Thoughts — be socially uniq.",
    longDescription:
      "ARCT — Reflection Captured Thoughts. The brand identity I planned myself, and one of the dream projects: a place for captured thoughts and reflections, about being socially unique instead of socially optimized.",
    url: null,
    category: "Dream project · Brand",
    status: "PUBLISHED",
    featured: true,
    year: "Class 10",
    role: "Brand & concept",
    tools: ["Brand thinking", "AI prompting", "Design experiments"],
    accent: "accent",
    thumbnailKey: "thumb-arct.jpg",
    position: 6,
    blocks: [
      {
        type: "richText",
        content: {
          title: "MY BRAND IDENTITY — THE ONE I PLANNED",
          html: "<p><strong>ARCT — Reflection Captured Thoughts.</strong></p><p>A brand identity I planned myself: bright geometric shapes on a cream base, a phone-shaped window for captured thoughts, and reflections that look good enough to keep.</p><p>It is not an app yet. It is a plan, a look, and a feeling — one of the dream projects.</p>",
        },
        style: st({ bgTheme: "cream" }),
      },
      {
        type: "image",
        content: {
          externalUrl: null,
          mediaId: null,
          alt: "Abstract glowing ring in pink and cyan on deep navy — the ARCT mark",
          caption: "The ARCT mark — thoughts captured in a loop.",
          ratio: "wide",
          rounded: true,
        },
        style: st({ bgTheme: "navy", animation: "full" }),
      },
      {
        type: "coloredSection",
        content: {
          tone: "navy",
          word: "BE SOCIALLY UNIQ",
          title: "one of the dream projects",
          body: "A quiet loop of light for a loud idea: be socially unique.",
          doodle: "ring",
        },
        style: st({ bgTheme: "navy", animation: "full", align: "center", padding: "lg" }),
      },
      {
        type: "quote",
        content: { text: "Reflection. Captured. Thoughts." },
        style: st({ bgTheme: "ink", align: "center" }),
      },
      {
        type: "cta",
        content: {
          title: "Want to see ARCT become real?",
          body: "Ideas, feedback or help — the inbox is open.",
          actionLabel: "Say hi →",
          actionHref: "/contact",
          tone: "accent",
        },
      },
    ],
  },
];

export const seedMedia = [
  { key: "thumb-esyllabus.jpg", url: "/art/thumb-esyllabus.jpg", alt: "Colorful abstract composition of books and grid shapes in cyan and navy" },
  { key: "thumb-logic365.jpg", url: "/art/thumb-logic365.jpg", alt: "Colorful abstract composition of puzzle shapes in lilac and cream" },
  { key: "thumb-qpg.jpg", url: "/art/thumb-qpg.jpg", alt: "Colorful abstract composition of papers and question marks in yellow and navy" },
  { key: "thumb-y2cheat.jpg", url: "/art/thumb-y2cheat.jpg", alt: "Colorful abstract composition of lightning shapes in orange and pink" },
  { key: "thumb-friendortrend.jpg", url: "/art/thumb-friendortrend.jpg", alt: "Colorful abstract composition of speech bubbles in pink and cyan" },
  { key: "thumb-arct.jpg", url: "/art/thumb-arct.jpg", alt: "Colorful abstract composition of a glowing ring on deep navy" },
  { key: "arct-ring.jpg", url: "/art/arct-ring.jpg", alt: "A glowing neon ring floating over deep navy — the ARCT dream-project mark" },
];
