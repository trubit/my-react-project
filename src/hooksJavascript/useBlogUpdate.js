import { useEffect, useMemo, useState } from "react";
import { createIdFromTitle, getVisiblePosts } from "./useBlogPosts";

const emptyForm = {
  title: "",
  description: "",
  date: "",
  link: "",
  image: "",
  imageAlt: "",
  tag: "",
};

export const MAX_IMAGE_SIZE_MB = 3;

export const useBlogUpdateForm = ({
  posts,
  setPosts,
  visiblePosts,
  activePost,
  onActivatePost,
}) => {
  const [editingId, setEditingId] = useState("new");
  const [formData, setFormData] = useState(emptyForm);
  const [uploadError, setUploadError] = useState("");

  useEffect(() => {
    if (editingId === "new") {
      return;
    }

    const exists = posts.some((post) => post.id === editingId);
    if (!exists) {
      setEditingId("new");
      setFormData(emptyForm);
    }
  }, [editingId, posts]);

  const imageUrlValue = useMemo(
    () =>
      formData.image && formData.image.startsWith("data:")
        ? ""
        : formData.image,
    [formData.image]
  );

  const handleSelectChange = (event) => {
    const value = event.target.value;
    setEditingId(value);
    setUploadError("");

    if (value === "new") {
      setFormData(emptyForm);
      return;
    }

    const selected = posts.find((post) => post.id === value);
    if (!selected) {
      setFormData(emptyForm);
      return;
    }

    const visibleIndex = visiblePosts.findIndex((post) => post.id === value);
    if (visibleIndex >= 0) {
      onActivatePost?.(visibleIndex);
    }

    setFormData({
      title: selected.title ?? "",
      description: selected.description ?? "",
      date: selected.date ?? "",
      link: selected.link ?? "",
      image: selected.image ?? "",
      imageAlt: selected.imageAlt ?? "",
      tag: selected.tag ?? "",
    });
  };

  const handleFieldChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      setUploadError("Please select an image file.");
      return;
    }

    const sizeInMb = file.size / (1024 * 1024);
    if (sizeInMb > MAX_IMAGE_SIZE_MB) {
      setUploadError(
        `Image is too large. Max size is ${MAX_IMAGE_SIZE_MB} MB.`
      );
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setFormData((prev) => ({
        ...prev,
        image: reader.result,
        imageAlt: prev.imageAlt || file.name,
      }));
      setUploadError("");
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setFormData((prev) => ({ ...prev, image: "" }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const payload = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      date: formData.date.trim(),
      link: formData.link.trim(),
      image: formData.image.trim(),
      imageAlt: formData.imageAlt.trim(),
      tag: formData.tag.trim(),
    };

    if (!payload.title || !payload.description || !payload.link) {
      return;
    }

    const timestamp = Date.now();
    let nextPosts = posts;
    let targetId = editingId;

    if (editingId === "new") {
      const newPost = {
        id: createIdFromTitle(payload.title),
        updatedAt: timestamp,
        ...payload,
      };
      targetId = newPost.id;
      nextPosts = [newPost, ...posts];
      setEditingId("new");
      setFormData(emptyForm);
      setUploadError("");
    } else {
      nextPosts = posts.map((post) =>
        post.id === editingId
          ? {
              ...post,
              ...payload,
              id: editingId,
              updatedAt: timestamp,
            }
          : post
      );
    }

    setPosts(nextPosts);
    setUploadError("");

    const nextVisible = getVisiblePosts(nextPosts);
    const nextIndex = nextVisible.findIndex((post) => post.id === targetId);
    if (nextIndex >= 0) {
      onActivatePost?.(nextIndex);
    }
  };

  const useLatestPost = () => {
    if (!activePost) {
      return;
    }

    setEditingId(activePost.id);
    setUploadError("");
    setFormData({
      title: activePost.title ?? "",
      description: activePost.description ?? "",
      date: activePost.date ?? "",
      link: activePost.link ?? "",
      image: activePost.image ?? "",
      imageAlt: activePost.imageAlt ?? "",
      tag: activePost.tag ?? "",
    });
  };

  return {
    editingId,
    formData,
    uploadError,
    imageUrlValue,
    handleSelectChange,
    handleFieldChange,
    handleImageUpload,
    handleRemoveImage,
    handleSubmit,
    useLatestPost,
  };
};
