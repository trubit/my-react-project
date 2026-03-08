import { NavLink } from "react-router-dom";

export const BlogCarousel = ({ posts, activeIndex, onSelectIndex }) => {
  if (!posts.length) {
    return <div className="blogs-admin-note">No blog posts yet.</div>;
  }

  return (
    <div className="blogs-carousel">
      <div
        className="blogs-track"
        style={{ transform: `translateX(-${activeIndex * 100}%)` }}
      >
        {posts.map((post) => (
          <div className="blogs-slide" key={post.id}>
            <NavLink
              to={post.link}
              className="blogs-card-link"
              aria-label={`Open ${post.title}`}
            >
              <article
                className="blogs-card blogs-card--media"
                style={{
                  "--media-image": post.image
                    ? `url(${post.image})`
                    : "linear-gradient(135deg, #1b1f27, #101318)",
                }}
              />
            </NavLink>

            <NavLink to={post.link} className="blogs-card-link">
              <article className="blogs-card blogs-card--content">
                <h3 className="blogs-title">{post.title}</h3>
                <p className="blogs-description">{post.description}</p>
                {post.date ? <p className="blogs-date">{post.date}</p> : null}
              </article>
            </NavLink>
          </div>
        ))}
      </div>

      <div className="blogs-dots">
        {posts.map((post, index) => (
          <button
            key={post.id}
            type="button"
            className={`blogs-dot ${index === activeIndex ? "active" : ""}`}
            onClick={() => onSelectIndex?.(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export const BlogGrid = ({ posts }) => {
  if (!posts.length) {
    return <div className="blogs-admin-note">No blog posts yet.</div>;
  }

  return (
    <div className="blogs-grid">
      {posts.map((post) => (
        <NavLink
          to={post.link}
          className="blogs-grid-link"
          aria-label={`Open ${post.title}`}
          key={post.id}
        >
          <article className="blogs-grid-card">
            <div
              className="blogs-grid-media"
              style={{
                "--media-image": post.image
                  ? `url(${post.image})`
                  : "linear-gradient(135deg, #1b1f27, #101318)",
              }}
            >
              {post.tag ? (
                <span className="blogs-grid-tag">{post.tag}</span>
              ) : null}
            </div>
            <div className="blogs-grid-body">
              <h3 className="blogs-grid-title">{post.title}</h3>
              <p className="blogs-grid-description">{post.description}</p>
              {post.date ? <p className="blogs-date">{post.date}</p> : null}
            </div>
          </article>
        </NavLink>
      ))}
    </div>
  );
};
