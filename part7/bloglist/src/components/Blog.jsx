import { Link } from "react-router-dom";

const Blog = ({ blog }) => {
  const blogStyle = {
    alignItems: "center",
    paddingTop: 10,
    paddingLeft: 2,
    border: "solid",
    borderWidth: 1,
    marginBottom: 5,
  };

  return (
    <div style={blogStyle}>
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
    </div>
  );
};

export default Blog;
