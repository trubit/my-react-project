import { Badge } from "react-bootstrap";

const hasHtml = (value) => /<\/?[a-z][\s\S]*>/i.test(value || "");

const formatDate = (value) => {
  if (!value) return "";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "";
  return parsed.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const MainPost = ({ post, isFading }) => {
  if (!post) return null;
  const displayDate = post.date || formatDate(post.updatedAt || post.createdAt);

  return (
    <article className={`main-post post-fade ${isFading ? "fade-out" : ""}`}>
      <header className="post-header">
        <h1 className="post-title">{post.title}</h1>
        <div className="post-meta">
          {displayDate ? (
            <span className="post-date">{displayDate}</span>
          ) : null}
          {post.tag ? (
            <Badge bg="success" className="post-category">
              {post.tag}
            </Badge>
          ) : null}
        </div>
      </header>

      {post.imageUrl || post.image ? (
        <div className="post-hero">
          <img
            src={post.imageUrl || post.image}
            alt={post.imageAlt || post.title}
          />
        </div>
      ) : null}

      <div className="post-content">
        {hasHtml(post.description) ? (
          <div
            dangerouslySetInnerHTML={{
              __html: post.description.replace(
                /<(h[2-6])([^>]*)>(.*?)<\/\1>/gis,
                (match, tag, attrs, content) => {
                  return `<${tag}${attrs}>${content.toUpperCase()}</${tag}>`;
                },
              ),
            }}
          />
        ) : (
          (post.description || "")
            .split(/\n{2,}/g)
            .filter((block) => block.trim())
            .map((block, index) => <p key={index}>{block}</p>)
        )}
      </div>
    </article>
  );
};

export default MainPost;
