import { Card } from "react-bootstrap";

const Sidebar = ({ posts, activeId, onSelect }) => {
  return (
    <aside className="blog-sidebar">
      <div className="sidebar-sticky">
        <h4 className="sidebar-heading">Related Posts</h4>
        <div className="sidebar-list sidebar-images">
          {posts.map((post) => (
            <Card
              key={post.id}
              className={`sidebar-card image-only ${
                activeId === post.id ? "is-active" : ""
              }`}
              onClick={() => onSelect(post)}
              role="button"
              tabIndex={0}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  onSelect(post);
                }
              }}
            >
              <div className="sidebar-card-body image-only">
                {post.imageUrl || post.image ? (
                  <div className="sidebar-image-wrap">
                    {post.tag ? (
                      <span className="sidebar-tag">{post.tag}</span>
                    ) : null}
                    <img
                      className="sidebar-thumb image-only"
                      src={post.imageUrl || post.image}
                      alt={post.title}
                    />
                  </div>
                ) : (
                  <div className="sidebar-thumb placeholder image-only" />
                )}
              </div>
              <div className="sidebar-caption">
                <p className="sidebar-caption-title">{post.title}</p>
                <p className="sidebar-caption-desc">
                  {post.excerpt ||
                    post.summary ||
                    post.description ||
                    "Read the full story."}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
