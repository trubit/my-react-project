import mongoose from "mongoose";
import Blog from "../models/Blog.js";

// Parse query limit (no default limit when omitted).
const parseLimit = (value) => {
  if (value === undefined || value === null || value === "") {
    return null;
  }
  const parsed = Number.parseInt(value, 10);
  if (Number.isNaN(parsed) || parsed <= 0) {
    return null;
  }
  return parsed;
};

// Allow limited sort fields to avoid abuse.
const parseSort = (value) => {
  if (!value) {
    return { updatedAt: -1 };
  }

  const isDesc = value.startsWith("-");
  const field = isDesc ? value.slice(1) : value;
  const allowed = new Set(["updatedAt", "createdAt", "title"]);

  if (!allowed.has(field)) {
    return { updatedAt: -1 };
  }

  return { [field]: isDesc ? -1 : 1 };
};

const slugify = (value) =>
  (value || "")
    .toString()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "") || "post";

const ensureUniqueSlug = async (baseSlug, excludeId = null) => {
  let slug = baseSlug;
  let counter = 0;

  while (counter < 50) {
    const query = { slug };
    if (excludeId) {
      query._id = { $ne: excludeId };
    }

    const exists = await Blog.exists(query);
    if (!exists) {
      return slug;
    }

    counter += 1;
    slug = `${baseSlug}-${counter + 1}`;
  }

  return `${baseSlug}-${Date.now()}`;
};

// Normalize user input into a safe blog payload.
const toPayload = (body) => ({
  title: body.title?.trim() ?? "",
  description: body.description?.trim() ?? "",
  link: body.link?.trim() ?? "",
  image: body.image?.trim() ?? "",
  imageAlt: body.imageAlt?.trim() ?? "",
  tag: body.tag?.trim() ?? "",
  date: body.date?.trim() ?? "",
});

// GET /blogs: list recent blog posts.
export const listBlogs = async (req, res) => {
  const limit = parseLimit(req.query.limit);
  const sort = parseSort(req.query.sort);
  const query = Blog.find().sort(sort);
  if (limit) {
    query.limit(limit);
  }
  const posts = await query;
  res.json({ posts });
};

// GET /blogs/:id: fetch a single post.
export const getBlog = async (req, res) => {
  const key = req.params.id;
  let post = null;

  if (mongoose.Types.ObjectId.isValid(key)) {
    post = await Blog.findById(key);
  }

  if (!post) {
    post = await Blog.findOne({ slug: key });
  }

  if (!post) {
    return res.status(404).json({ message: "Post not found." });
  }
  return res.json({ post });
};

// POST /blogs: create a blog post.
export const createBlog = async (req, res) => {
  const payload = toPayload(req.body);
  if (!payload.title || !payload.description) {
    return res.status(400).json({
      message: "Title and description are required.",
    });
  }
  payload.slug = await ensureUniqueSlug(slugify(payload.title));
  const post = await Blog.create(payload);
  return res.status(201).json({ post });
};

// PATCH /blogs/:id: update a blog post.
export const updateBlog = async (req, res) => {
  const payload = toPayload(req.body);
  if (!payload.title || !payload.description) {
    return res.status(400).json({
      message: "Title and description are required.",
    });
  }
  payload.slug = await ensureUniqueSlug(
    slugify(payload.title),
    req.params.id,
  );

  const post = await Blog.findByIdAndUpdate(req.params.id, payload, {
    new: true,
    runValidators: true,
  });
  if (!post) {
    return res.status(404).json({ message: "Post not found." });
  }
  return res.json({ post });
};

// DELETE /blogs/:id: remove a blog post.
export const deleteBlog = async (req, res) => {
  const post = await Blog.findByIdAndDelete(req.params.id);
  if (!post) {
    return res.status(404).json({ message: "Post not found." });
  }
  return res.json({ ok: true });
}; 

