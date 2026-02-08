import { useRef, useState } from "react";
import { Togglable } from "./Togglable";

export function AddForm({ handleSubmit }) {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [url, setUrl] = useState("");
  const createBlogRef = useRef();

  return (
    <Togglable ref={createBlogRef} buttonLabel="create new blog">
      <div>
        <h2>create new</h2>

        <form
          onSubmit={(e) => {
            handleSubmit(e, title, author, url);

            setTitle("");
            setAuthor("");
            setUrl("");
          }}
        >
          <div>
            title
            <input
              id="create-title"
              type="text"
              value={title}
              name="Title"
              onChange={({ target }) => setTitle(target.value)}
            />
          </div>
          <div>
            author
            <input
              id="create-author"
              type="text"
              value={author}
              name="Author"
              onChange={({ target }) => setAuthor(target.value)}
            />
          </div>
          <div>
            url
            <input
              id="create-url"
              type="text"
              value={url}
              name="Url"
              onChange={({ target }) => setUrl(target.value)}
            />
          </div>
          <button type="submit">create</button>
        </form>
      </div>
    </Togglable>
  );
}
