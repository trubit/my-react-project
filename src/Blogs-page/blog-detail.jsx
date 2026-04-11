import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { Container, Row, Col, Alert, Spinner, Button } from "react-bootstrap";
import MiniHeader from "../header-navigation/mini-header";
import MainPost from "../Components/MainPost.jsx";
import Sidebar from "../Components/Sidebar.jsx";
import { getBlog, listBlogs } from "../api/blogs.jsx";

import "../styles/blog-detail.css";
import "bootstrap-icons/font/bootstrap-icons.css";

const BlogDetail = () => {
  const { id } = useParams();
  const blockedTitles = useMemo(
    () =>
      new Set(
        [
          "Arbitrage Bot: Never Miss a Risk-Free Spread Again",
          "TrusonXchanger Golden XBot: Powering Smarter Trades with 50+ Trading Pair Signals",
        ].map((title) => title.toLowerCase()),
      ),
    [],
  );
  const [posts, setPosts] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [displayPost, setDisplayPost] = useState(null);
  const [isFading, setIsFading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const fadeTimer = useRef(null);
  const [likesById, setLikesById] = useState({});
  const API_ORIGIN =
    import.meta.env.VITE_TRUSON_API_URL || import.meta.env.VITE_API_URL || "";

  const resolveImageUrl = (value) => {
    if (!value) return "";
    if (/^(https?:)?\/\//i.test(value)) return value;
    if (value.startsWith("data:") || value.startsWith("blob:")) return value;
    if (!API_ORIGIN) return value;
    if (value.startsWith("/")) return `${API_ORIGIN}${value}`;
    return `${API_ORIGIN}/${value}`;
  };

  const stripHtml = (value) =>
    (value || "").replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();

  const makeExcerpt = (value, limit = 120) => {
    const plain = stripHtml(value);
    if (!plain) return "";
    if (plain.length <= limit) return plain;
    return `${plain.slice(0, limit).trim()}...`;
  };

  const normalizePost = (post) => {
    if (!post) return post;
    return {
      ...post,
      imageUrl: resolveImageUrl(post.image),
      excerpt: post.excerpt || makeExcerpt(post.description),
    };
  };

  const filterPosts = (items) =>
    (items || []).filter(
      (post) => post?.title && !blockedTitles.has(post.title.toLowerCase()),
    );

  const sortedPosts = useMemo(() => {
    return [...posts].sort((a, b) => {
      if (!a.date || !b.date) return 0;
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
  }, [posts]);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError("");

    const listPromise = listBlogs({ limit: 6, sort: "-updatedAt" });
    const detailPromise = id ? getBlog(id) : Promise.resolve(null);

    Promise.allSettled([listPromise, detailPromise])
      .then(([listResult, detailResult]) => {
        if (!isMounted) return;

        const listData =
          listResult.status === "fulfilled" ? listResult.value : null;
        const items = Array.isArray(listData)
          ? listData
          : listData?.posts || [];
        const normalized = filterPosts(items).map(normalizePost);
        setPosts(normalized);

        const detailData =
          detailResult?.status === "fulfilled" ? detailResult.value : null;
        const detailPost = normalizePost(detailData?.post);

        const fallback =
          normalized.find((post) => String(post.id) === String(id)) ||
          normalized[0];
        const initial = detailPost || fallback;

        setActiveId(initial?.id ?? null);
        setDisplayPost(initial ?? null);
      })
      .catch((err) => {
        if (!isMounted) return;
        setError(err?.message || "Unable to load blog posts.");
      })
      .finally(() => {
        if (!isMounted) return;
        setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [id]);

  useEffect(() => {
    return () => {
      if (fadeTimer.current) clearTimeout(fadeTimer.current);
    };
  }, []);

  useEffect(() => {
    try {
      const cached = JSON.parse(localStorage.getItem("blogLikes") || "{}");
      setLikesById(cached);
    } catch {
      setLikesById({});
    }
  }, []);

  const updateLikes = (postId) => {
    if (!postId) return;
    setLikesById((prev) => {
      const next = { ...prev, [postId]: (prev[postId] || 0) + 1 };
      localStorage.setItem("blogLikes", JSON.stringify(next));
      return next;
    });
  };

  const shareTarget =
    displayPost?.slug || displayPost?.id
      ? `${window.location.origin}/blogs/${displayPost.slug || displayPost.id}`
      : window.location.href;
  const encodedShare = encodeURIComponent(shareTarget);

  const handleSelect = (post) => {
    if (!post || post.id === activeId) return;
    setIsFading(true);
    if (fadeTimer.current) clearTimeout(fadeTimer.current);
    fadeTimer.current = setTimeout(() => {
      setDisplayPost(normalizePost(post));
      setActiveId(post.id);
      setIsFading(false);
    }, 200);
  };

  return (
    <>
      <MiniHeader />
      <section className="blog-detail-page">
        <Container fluid="xl">
          {loading && (
            <Alert variant="info" className="blog-alert">
              <Spinner
                as="span"
                animation="border"
                size="sm"
                className="me-2"
              />
              Loading blog posts...
            </Alert>
          )}
          {error && <Alert variant="danger">{error}</Alert>}

          {!loading && !error && (
            <Row className="g-4">
              <Col lg={8}>
                <MainPost post={displayPost} isFading={isFading} />
              </Col>
              <Col lg={4}>
                <div className="blog-sidebar-top">
                  <div className="like-pill">
                    <Button
                      variant="outline-light"
                      className="like-button"
                      onClick={() => updateLikes(displayPost?.id)}
                      aria-label="Like this post"
                    >
                      <i className="bi bi-hand-thumbs-up" />
                    </Button>
                    <span className="like-count">
                      {likesById[displayPost?.id] || 0}
                    </span>
                  </div>
                  <div className="share-block">
                    <p className="share-title">Share Posts</p>
                    <div className="share-icons">
                      <a
                        href={`https://twitter.com/intent/tweet?url=${encodedShare}`}
                        target="_blank"
                        rel="noreferrer"
                        aria-label="Share on X"
                      >
                        <i className="bi bi-twitter-x" />
                      </a>
                      <a
                        href={`https://facebook.com/sharer/sharer.php?u=${encodedShare}`}
                        target="_blank"
                        rel="noreferrer"
                        aria-label="Share on Facebook"
                      >
                        <i className="bi bi-facebook" />
                      </a>
                      <a
                        href={`https://t.me/share/url?url=${encodedShare}`}
                        target="_blank"
                        rel="noreferrer"
                        aria-label="Share on Telegram"
                      >
                        <i className="bi bi-telegram" />
                      </a>
                    </div>
                  </div>
                </div>
                <Sidebar
                  posts={sortedPosts}
                  activeId={activeId}
                  onSelect={handleSelect}
                />
              </Col>
            </Row>
          )}
        </Container>
      </section>
    </>
  );
};

export default BlogDetail;
