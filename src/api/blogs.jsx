const API_BASE_URL =
  import.meta.env.VITE_TRUSON_API_URL ||
  import.meta.env.VITE_API_URL ||
  "";

const parseJson = async (response) => {
  try {
    return await response.json();
  } catch {
    return null;
  }
};

const request = async (path, options = {}) => {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });
  const payload = await parseJson(response);
  if (!response.ok) {
    const message = payload?.message || "Request failed";
    throw new Error(message);
  }
  return payload;
};

export const listBlogs = (params = {}) => {
  const search = new URLSearchParams();
  if (params.limit) search.set("limit", params.limit);
  if (params.sort) search.set("sort", params.sort);
  const suffix = search.toString() ? `?${search.toString()}` : "";
  return request(`/api/blogs${suffix}`, { method: "GET" });
};

export const getBlog = (id) => request(`/api/blogs/${id}`, { method: "GET" });

export const createBlog = (payload) =>
  request("/api/blogs", {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const updateBlog = (id, payload) =>
  request(`/api/blogs/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });

export const deleteBlog = (id) =>
  request(`/api/blogs/${id}`, { method: "DELETE" });
