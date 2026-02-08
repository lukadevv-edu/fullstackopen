import { useState } from "react";

const Blog = ({ username, blog, onLike, onRemove }) => {
  const blogStyle = {
    alignItems: "center",
    paddingTop: 10,
    paddingLeft: 2,
    border: "solid",
    borderWidth: 1,
    marginBottom: 5,
  };

  const [view, setView] = useState(false);

  return (
    <div style={blogStyle}>
      <div
        style={{
          display: "flex",
          gap: 5,
        }}
      >
        <div>
          {blog.title} {blog.author}
        </div>
        <button onClick={() => setView((old) => !old)}>
          {view ? "hide" : "view"}
        </button>
      </div>
      {view && (
        <div>
          <p>{blog.url}</p>
          <div
            style={{
              display: "flex",
              gap: 2,
            }}
          >
            <p>{blog.likes}</p>
            <button onClick={onLike}>like</button>
          </div>
          <p>{blog.author}</p>
          {username === blog.user.username && (
            <button onClick={onRemove}>remove</button>
          )}
        </div>
      )}
    </div>
  );
};

export default Blog;
