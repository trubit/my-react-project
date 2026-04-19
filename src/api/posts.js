const API_BASE_URL =
  import.meta.env.VITE_TRUSON_API_URL ||
  import.meta.env.VITE_API_URL ||
  "";

const LOCAL_LIKES_KEY = "blogLikes";

const parseJson = async (response) => {
  try {
    return await response.json();
  } catch {
    return null;
  }
};

const buildUrl = (path) => `${API_BASE_URL}${path}`;

const isNotFoundPayload = (payload) => {
  const message = String(payload?.message || "").toLowerCase();
  return message.includes("route not found") || message.includes("not found");
};

const tryRequest = async (path, options = {}) => {
  const response = await fetch(buildUrl(path), {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  const payload = await parseJson(response);

  return {
    ok: response.ok,
    status: response.status,
    payload,
  };
};

const request = async (path, options = {}) => {
  const result = await tryRequest(path, options);

  if (!result.ok) {
    const message = result.payload?.message || "Request failed";
    throw new Error(message);
  }

  return result.payload;
};

const requestWithFallback = async (paths, options = {}) => {
  let lastError = null;

  for (const path of paths) {
    const result = await tryRequest(path, options);

    if (result.ok) {
      return result.payload;
    }

    const message = result.payload?.message || "Request failed";
    const canTryNext =
      result.status === 404 ||
      result.status === 405 ||
      isNotFoundPayload(result.payload);

    if (!canTryNext) {
      throw new Error(message);
    }

    lastError = new Error(message);
  }

  throw lastError || new Error("Request failed");
};

const safeParseLikes = () => {
  try {
    return JSON.parse(window.localStorage.getItem(LOCAL_LIKES_KEY) || "{}");
  } catch {
    return {};
  }
};

const getLocalLikes = (id) => {
  if (typeof window === "undefined") return 0;
  const likesById = safeParseLikes();
  const value = Number(likesById[id]);
  return Number.isFinite(value) && value > 0 ? value : 0;
};

const setLocalLikes = (id, likes) => {
  if (typeof window === "undefined") return;
  const likesById = safeParseLikes();
  likesById[id] = likes;
  window.localStorage.setItem(LOCAL_LIKES_KEY, JSON.stringify(likesById));
};

const withLikesFallback = (post) => {
  if (!post) return post;
  if (typeof post.likes === "number") return post;
  return {
    ...post,
    likes: getLocalLikes(post.id || post._id),
  };
};

const normalizePostsArray = (payload) => {
  if (!payload) return [];
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload.posts)) return payload.posts;
  if (Array.isArray(payload.related)) return payload.related;
  if (Array.isArray(payload.data)) return payload.data;
  return [];
};

const getPostKey = (post) => String(post?.id || post?._id || post?.slug || "");

const getSortTime = (post) => {
  const value = post?.updatedAt || post?.createdAt || post?.date;
  const parsed = Date.parse(value || "");
  return Number.isNaN(parsed) ? 0 : parsed;
};

export const getPost = async (id, options = {}) => {
  const payload = await requestWithFallback(
    [`/api/posts/${id}`, `/api/blogs/${id}`],
    { method: "GET", signal: options.signal },
  );

  if (payload?.post) {
    return { ...payload, post: withLikesFallback(payload.post) };
  }

  if (payload?.data) {
    return { ...payload, data: withLikesFallback(payload.data) };
  }

  if (payload?.id || payload?._id) {
    return withLikesFallback(payload);
  }

  return payload;
};

export const getRelatedPosts = async (id, options = {}) => {
  try {
    return await request(`/api/posts/${id}/related`, {
      method: "GET",
      signal: options.signal,
    });
  } catch {
    const [postPayload, blogsPayload] = await Promise.all([
      getPost(id, options),
      request("/api/blogs?limit=30&sort=-updatedAt", {
        method: "GET",
        signal: options.signal,
      }),
    ]);

    const current = postPayload?.post || postPayload?.data || postPayload;
    const allPosts = normalizePostsArray(blogsPayload).map(withLikesFallback);

    const currentId = String(current?.id || current?._id || id);
    const currentTag = String(current?.tag || "").toLowerCase();
    const seen = new Set();

    const related = allPosts
      .filter((item) => {
        const key = getPostKey(item);
        if (!key || key === currentId) return false;
        if (seen.has(key)) return false;
        seen.add(key);
        return Boolean(item?.title && item?.description);
      })
      .sort((a, b) => {
        const aTagMatch =
          String(a?.tag || "").toLowerCase() === currentTag ? 1 : 0;
        const bTagMatch =
          String(b?.tag || "").toLowerCase() === currentTag ? 1 : 0;
        if (bTagMatch !== aTagMatch) return bTagMatch - aTagMatch;
        return getSortTime(b) - getSortTime(a);
      })
      .slice(0, 5);

    return { posts: related };
  }
};

export const likePost = async (id, options = {}) => {
  try {
    const payload = await request(`/api/posts/${id}/like`, {
      method: "POST",
      signal: options.signal,
    });

    const likes =
      payload?.post?.likes ??
      payload?.data?.likes ??
      payload?.likes;

    if (typeof likes === "number") {
      setLocalLikes(id, likes);
    }

    return payload;
  } catch {
    const nextLikes = getLocalLikes(id) + 1;
    setLocalLikes(id, nextLikes);
    return { likes: nextLikes, post: { id, likes: nextLikes } };
  }
};
