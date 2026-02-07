import { useCallback, useState } from "react";
import blogs from "../services/blogs";

export function AddForm({ user, setAlert }) {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [url, setUrl] = useState("");

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();

      blogs
        .createBlog(user, title, author, url)
        .then(() => {
          setAlert({
            message: `a new blog ${title} by ${author} added`,
            alertType: "success",
          });
        })
        .catch((e) => {
          setAlert({
            message: e?.message ?? e?.error?.message ?? "Error caught!",
            alertType: "error",
          });
        });
    },
    [author, setAlert, title, url, user],
  );

  return (
    <form onSubmit={handleSubmit}>
      <div>
        title
        <input
          type="text"
          value={title}
          name="Title"
          onChange={({ target }) => setTitle(target.value)}
        />
      </div>
      <div>
        author
        <input
          type="text"
          value={author}
          name="Author"
          onChange={({ target }) => setAuthor(target.value)}
        />
      </div>
      <div>
        url
        <input
          type="text"
          value={url}
          name="Url"
          onChange={({ target }) => setUrl(target.value)}
        />
      </div>
      <button type="submit">create</button>
    </form>
  );
}
