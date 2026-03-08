import { Button, Container } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import MiniHeader from "../header-navigation/mini-header";
import { BlogGrid } from "./BlogCards";
import BlogUpdateForm from "./BlogUpdateForm";
import { useBlogPosts } from "../hooksJavascript/useBlogPosts";

import "../styles/blogs.css";

const BlogUpdatePage = () => {
  const { posts, setPosts, visiblePosts } = useBlogPosts();
  const activePost = visiblePosts[0] ?? null;

  return (
    <>
      <MiniHeader />
      <section className="blogs-page">
        <div className="blogs-hero">
          <Container fluid="xl">
            <div className="blogs-actions">
              <Button
                as={NavLink}
                to="/Blogs"
                variant="outline-light"
                className="blogs-action-button"
              >
                View Blog Cards
              </Button>
            </div>
            <BlogUpdateForm
              posts={posts}
              setPosts={setPosts}
              visiblePosts={visiblePosts}
              activePost={activePost}
            />
            <div className="blogs-update-preview">
              <h2 className="blogs-form-title">Preview</h2>
              <BlogGrid posts={visiblePosts} />
            </div>
          </Container>
        </div>
      </section>
    </>
  );
};

export default BlogUpdatePage;
