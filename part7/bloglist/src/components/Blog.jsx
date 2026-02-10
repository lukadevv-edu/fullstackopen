import Container from "react-bootstrap/esm/Container";
import { Link } from "react-router-dom";

const Blog = ({ blog }) => {
  return (
    <Container className="border my-2">
      <div
        style={{
          display: "flex",
          gap: 5,
        }}
      >
        <Link to={`/blogs/${blog.id}`}>
          {blog.title} {blog.author}
        </Link>
      </div>
    </Container>
  );
};

export default Blog;
