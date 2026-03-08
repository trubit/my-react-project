import { useEffect, useMemo, useState } from "react";
import TrusonXBot from "../assets/truson-x-bot.png";
import TrusonFinCen from "../assets/truson-fin-cen.png";
import TrusonPackage from "../assets/truson-package.png";
import TrusonBuySell from "../assets/truson-Buy-Sell.png";

const STORAGE_KEY = "trusonxchanger.blogPosts";
const HAS_WINDOW = typeof window !== "undefined";

const initialBlogPosts = [
  {
    id: "bot-wallet",
    tag: "Introducing",
    image: TrusonXBot,
    imageAlt: "TrusonXchanger bot wallet",
    link: "/Xgolden",
    title: "Introducing the Bot Wallet: Simpler, Smarter, and Built for You",
    description:
      "Discover the new TrusonXchanger Bot Wallet - a faster, safer way to buy packages, reinvest profits, and support your team directly from one secure wallet.",
    date: "12 Nov 2025 3:17 pm",
  },
  {
    id: "fin-cen",
    tag: "Announcing",
    image: TrusonFinCen,
    imageAlt: "Truson FinCen",
    link: "/FinCen",
    title: "FinCen Compliance: Clearer, Stronger, and Ready for Growth",
    description:
      "Stay ahead with our updated compliance flow designed to keep your funds protected and your operations seamless.",
    date: "02 Dec 2025 10:45 am",
  },
  {
    id: "free-package",
    tag: "Introducing",
    image: TrusonPackage,
    imageAlt: "Truson free package",
    link: "/FreePackage",
    title: "Start Faster with the Free Package: Simple, Secure, and Smooth",
    description:
      "Kickstart your journey with an easy onboarding flow, built-in guidance, and trusted security from day one.",
    date: "18 Jan 2026 8:00 am",
  },
  {
    id: "golden-buy-sell",
    tag: "Introducing",
    image: TrusonBuySell,
    imageAlt: "Truson buy and sell",
    link: "/GoldenBuySell",
    title: "Golden Buy & Sell: Faster Trades with Smarter Controls",
    description:
      "Trade confidently with improved pricing, instant fills, and a cleaner experience tailored for serious traders.",
    date: "05 Feb 2026 6:30 pm",
  },
];

export const createIdFromTitle = (title) => {
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
  return `${slug || "post"}-${Date.now()}`;
};

const mergePosts = (storedPosts) => {
  const merged = new Map();

  initialBlogPosts.forEach((post) => {
    merged.set(post.id, post);
  });

  if (Array.isArray(storedPosts)) {
    storedPosts.forEach((post) => {
      if (!post) {
        return;
      }

      const id = post.id || createIdFromTitle(post.title || "post");
      merged.set(id, { ...post, id });
    });
  }

  return Array.from(merged.values());
};

const getTimestamp = (value) => {
  if (!value) {
    return 0;
  }

  const parsed = Date.parse(value);
  return Number.isNaN(parsed) ? 0 : parsed;
};

const getSortValue = (post) => {
  if (typeof post.updatedAt === "number") {
    return post.updatedAt;
  }

  return getTimestamp(post.date);
};

export const getVisiblePosts = (posts) => {
  const filtered = posts.filter(
    (post) =>
      post &&
      post.title &&
      post.title.trim() &&
      post.description &&
      post.description.trim() &&
      post.link &&
      post.link.trim()
  );

  return [...filtered].sort((a, b) => getSortValue(b) - getSortValue(a));
};

const readStoredPosts = () => {
  if (!HAS_WINDOW) {
    return initialBlogPosts;
  }

  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    return initialBlogPosts;
  }

  try {
    const parsed = JSON.parse(stored);
    return mergePosts(parsed);
  } catch {
    return initialBlogPosts;
  }
};

export const useBlogPosts = () => {
  const [posts, setPosts] = useState(() => readStoredPosts());
  const visiblePosts = useMemo(() => getVisiblePosts(posts), [posts]);

  useEffect(() => {
    if (!HAS_WINDOW) {
      return;
    }

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
  }, [posts]);

  useEffect(() => {
    if (!HAS_WINDOW) {
      return;
    }

    const handleStorage = (event) => {
      if (event.key !== STORAGE_KEY) {
        return;
      }

      if (!event.newValue) {
        setPosts(initialBlogPosts);
        return;
      }

      try {
        const parsed = JSON.parse(event.newValue);
        setPosts(mergePosts(parsed));
      } catch {
        setPosts(initialBlogPosts);
      }
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  return { posts, setPosts, visiblePosts };
};
