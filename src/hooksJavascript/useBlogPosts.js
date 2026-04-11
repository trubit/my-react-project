import { useEffect, useMemo, useState } from "react";
import { listBlogs } from "../api/blogs.jsx";

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
  const blockedTitles = new Set(
    [
      "Arbitrage Bot: Never Miss a Risk-Free Spread Again",
      "TrusonXchanger Golden XBot: Powering Smarter Trades with 50+ Trading Pair Signals",
    ].map((title) => title.toLowerCase()),
  );
  const filtered = posts.filter(
    (post) =>
      post &&
      post.title &&
      post.title.trim() &&
      !blockedTitles.has(post.title.toLowerCase()) &&
      post.description &&
      post.description.trim()
  );

  return [...filtered].sort((a, b) => getSortValue(b) - getSortValue(a));
};

export const useBlogPosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const visiblePosts = useMemo(() => getVisiblePosts(posts), [posts]);

  const refresh = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await listBlogs({ limit: 50, sort: "-updatedAt" });
      setPosts(data?.posts || []);
    } catch (err) {
      setError(err.message || "Unable to load blog posts.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  return { posts, setPosts, visiblePosts, loading, error, refresh };
};
